# Admin User Implementation Guide

## Overview

This guide explains how to implement admin users who can view all users and all presentations. The implementation uses a hybrid approach:
- **Database Level**: Role stored in Supabase, enforced via RLS policies
- **Application Level**: Role checks for UI/UX and business logic

## Architecture Decision

✅ **Recommended Approach**: Store roles in Supabase database
- Security enforced at database level (RLS policies)
- Single source of truth
- Can be managed via Supabase dashboard or application
- Scalable for future role types (moderator, editor, etc.)

## Implementation Steps

### 1. Database Migration: Add Role Field

Create a new migration file: `supabase/migrations/006_add_user_roles.sql`

```sql
-- Add role column to users table
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin'));

-- Create index for role lookups
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Update existing users to have 'user' role (if null)
UPDATE users SET role = 'user' WHERE role IS NULL;

-- Set default for new users
ALTER TABLE users ALTER COLUMN role SET DEFAULT 'user';
```

### 2. RLS Policies for Admin Access

Update RLS policies to allow admins to see all data:

```sql
-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM users 
    WHERE id = user_id AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update presentations RLS policies
DROP POLICY IF EXISTS "Admins can view all presentations" ON presentations;
CREATE POLICY "Admins can view all presentations" ON presentations
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Update presentation_instances RLS policies
DROP POLICY IF EXISTS "Admins can view all instances" ON presentation_instances;
CREATE POLICY "Admins can view all instances" ON presentation_instances
  FOR SELECT
  USING (is_admin(auth.uid()));

-- Update users RLS policies
DROP POLICY IF EXISTS "Admins can view all users" ON users;
CREATE POLICY "Admins can view all users" ON users
  FOR SELECT
  USING (is_admin(auth.uid()));
```

### 3. Application-Level Role Checking

Create utility functions to check user roles in the application.

**File**: `src/lib/utils/user-roles.ts`

```typescript
import { supabase } from '@/lib/supabase/client';

export type UserRole = 'user' | 'admin';

export interface UserWithRole {
  id: string;
  email: string;
  role: UserRole;
  full_name?: string;
}

/**
 * Get current user's role
 */
export async function getUserRole(userId: string): Promise<UserRole> {
  const { data, error } = await supabase
    .from('users')
    .select('role')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return 'user'; // Default to user role
  }

  return (data.role as UserRole) || 'user';
}

/**
 * Check if current user is admin
 */
export async function isUserAdmin(userId: string): Promise<boolean> {
  const role = await getUserRole(userId);
  return role === 'admin';
}

/**
 * Get user with role information
 */
export async function getUserWithRole(userId: string): Promise<UserWithRole | null> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, full_name')
    .eq('id', userId)
    .single();

  if (error || !data) {
    return null;
  }

  return {
    id: data.id,
    email: data.email,
    role: (data.role as UserRole) || 'user',
    full_name: data.full_name || undefined,
  };
}
```

### 4. Update Service Functions

Update existing service functions to support admin access:

**File**: `src/lib/services/instances.ts` (add new function)

```typescript
/**
 * Get all instances (admin only) or user's instances
 */
export async function getAllInstances(userId: string, isAdmin: boolean = false) {
  if (isAdmin) {
    // Admins can see all instances
    const { data, error } = await supabase
      .from('presentation_instances')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  // Regular users see only their instances
  return getUserInstances(userId);
}
```

**File**: `src/lib/services/presentations.ts` (add new function)

```typescript
/**
 * Get all presentations (admin only) or user's presentations
 */
export async function getAllPresentations(userId: string, isAdmin: boolean = false) {
  if (isAdmin) {
    const { data, error } = await supabase
      .from('presentations')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  }
  
  return getUserPresentations(userId);
}
```

**File**: `src/lib/services/users.ts` (new file)

```typescript
import { supabase } from '@/lib/supabase/client';
import { UserWithRole } from '@/lib/utils/user-roles';

/**
 * Get all users (admin only)
 */
export async function getAllUsers(): Promise<UserWithRole[]> {
  const { data, error } = await supabase
    .from('users')
    .select('id, email, role, full_name, created_at')
    .order('created_at', { ascending: false });

  if (error) throw error;
  
  return data.map(user => ({
    id: user.id,
    email: user.email,
    role: (user.role as 'user' | 'admin') || 'user',
    full_name: user.full_name || undefined,
  }));
}

/**
 * Update user role (admin only)
 */
export async function updateUserRole(userId: string, role: 'user' | 'admin') {
  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select()
    .single();

  if (error) throw error;
  return data;
}
```

### 5. Admin Dashboard Component

**File**: `src/app/admin/page.tsx`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth/AuthProvider';
import { isUserAdmin } from '@/lib/utils/user-roles';
import { getAllUsers } from '@/lib/services/users';
import { getAllPresentations } from '@/lib/services/presentations';
import { getAllInstances } from '@/lib/services/instances';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  return (
    <ProtectedRoute>
      <AdminContent />
    </ProtectedRoute>
  );
}

function AdminContent() {
  const { user } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<any[]>([]);
  const [presentations, setPresentations] = useState<any[]>([]);
  const [instances, setInstances] = useState<any[]>([]);

  useEffect(() => {
    checkAdminAccess();
  }, [user]);

  const checkAdminAccess = async () => {
    if (!user) {
      router.push('/dashboard');
      return;
    }

    const admin = await isUserAdmin(user.id);
    setIsAdmin(admin);

    if (!admin) {
      router.push('/dashboard');
      return;
    }

    loadAdminData();
  };

  const loadAdminData = async () => {
    try {
      const [usersData, presentationsData, instancesData] = await Promise.all([
        getAllUsers(),
        getAllPresentations(user!.id, true),
        getAllInstances(user!.id, true),
      ]);

      setUsers(usersData);
      setPresentations(presentationsData);
      setInstances(instancesData);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-2 border-indigo-500 border-t-transparent mx-auto"></div>
          <p className="mt-4 text-slate-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Users</h3>
            <p className="text-3xl font-bold text-white">{users.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Presentations</h3>
            <p className="text-3xl font-bold text-white">{presentations.length}</p>
          </div>
          <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
            <h3 className="text-slate-400 text-sm mb-2">Total Instances</h3>
            <p className="text-3xl font-bold text-white">{instances.length}</p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Users</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300">Role</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white">{user.email}</td>
                    <td className="py-3 px-4 text-slate-300">{user.full_name || '-'}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs ${
                        user.role === 'admin' 
                          ? 'bg-purple-600 text-white' 
                          : 'bg-slate-600 text-slate-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(user.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Presentations Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50 mb-6">
          <h2 className="text-xl font-semibold text-white mb-4">All Presentations</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Name</th>
                  <th className="text-left py-3 px-4 text-slate-300">Template</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created By</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {presentations.map((pres) => (
                  <tr key={pres.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white">{pres.name}</td>
                    <td className="py-3 px-4 text-slate-300">{pres.template_id}</td>
                    <td className="py-3 px-4 text-slate-300">{pres.created_by}</td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(pres.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Instances Table */}
        <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700/50">
          <h2 className="text-xl font-semibold text-white mb-4">All Instances</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-700">
                  <th className="text-left py-3 px-4 text-slate-300">Recipient</th>
                  <th className="text-left py-3 px-4 text-slate-300">Email</th>
                  <th className="text-left py-3 px-4 text-slate-300">Status</th>
                  <th className="text-left py-3 px-4 text-slate-300">Created</th>
                </tr>
              </thead>
              <tbody>
                {instances.map((instance) => (
                  <tr key={instance.id} className="border-b border-slate-700/50">
                    <td className="py-3 px-4 text-white">{instance.recipient_name || '-'}</td>
                    <td className="py-3 px-4 text-slate-300">{instance.recipient_email || '-'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded text-xs bg-slate-600 text-slate-200">
                        {instance.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-400 text-sm">
                      {new Date(instance.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### 6. Add Admin Link to Navigation

Update `src/components/Navigation.tsx` to show admin link for admin users:

```typescript
// Add this after checking if user is admin
{user && (
  // ... existing code ...
  {isAdmin && (
    <Link 
      href="/admin"
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
        pathname === '/admin' 
          ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' 
          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
      }`}
    >
      Admin
    </Link>
  )}
)}
```

## How to Make a User Admin

### Option 1: Via Supabase Dashboard (Recommended for Initial Setup)

1. Go to Supabase Dashboard → Table Editor → `users` table
2. Find the user you want to make admin
3. Edit the `role` column and set it to `'admin'`
4. Save

### Option 2: Via SQL

```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'admin@example.com';
```

### Option 3: Via Application (Future Enhancement)

Add a UI in the admin dashboard to promote users to admin (with proper security checks).

## Security Considerations

1. **RLS Policies**: Always enforce at database level - never trust client-side checks alone
2. **Role Assignment**: Only allow existing admins to assign admin roles
3. **Audit Logging**: Consider adding an audit log for admin actions
4. **Rate Limiting**: Add rate limiting to admin endpoints
5. **Two-Factor Auth**: Consider requiring 2FA for admin accounts

## Testing

1. Create a test admin user via Supabase dashboard
2. Log in as admin
3. Verify admin dashboard loads
4. Verify admin can see all users, presentations, and instances
5. Verify regular users cannot access `/admin` route
6. Verify RLS policies prevent non-admins from querying all data

## Future Enhancements

- Role management UI (promote/demote users)
- Admin activity logs
- Bulk operations (delete multiple instances, etc.)
- User management (suspend, delete users)
- Analytics dashboard
- Export functionality (CSV, JSON)

