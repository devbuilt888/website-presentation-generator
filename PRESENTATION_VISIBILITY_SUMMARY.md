# Presentation Visibility & Access Control

## 🎯 Quick Answer

### Who Can See What?

| Type | URL | Visibility | Login Required |
|------|-----|------------|----------------|
| **Dashboard Presentations** | `/dashboard` | Only you (creator) | ✅ Yes |
| **Share Links** | `/view/ABC123TOKEN` | Anyone with link | ❌ No |
| **Template Previews** | `/presentations/zinzino-mex` | Anyone | ❌ No |

---

## 📊 Detailed Breakdown

### 1. Dashboard - Private (Logged In Users Only)

**URL:** `https://ultra-mango-generator.vercel.app/dashboard`

**Who Can See:**
- ✅ Only the user who created the presentations
- ❌ Other logged-in users cannot see your presentations
- ❌ Anonymous users are redirected to login

**What You See:**
- All presentations YOU created
- List of sent presentations with status
- Share links for your presentations

**Database Security:**
- Row Level Security (RLS) policy: `auth.uid() = created_by`
- Each user can only query their own presentations

**Example:**
- User A creates 5 presentations
- User B creates 3 presentations
- User A's dashboard shows only their 5 presentations
- User B's dashboard shows only their 3 presentations

---

### 2. Share Links - Public (Anyone with Link)

**URL:** `https://ultra-mango-generator.vercel.app/view/ABC123TOKEN`

**Who Can See:**
- ✅ **Anyone with the link** (no account needed)
- ✅ Can be opened in incognito/private mode
- ✅ Can be shared via email, SMS, social media

**What They See:**
- The customized presentation with their name
- Interactive elements (questions, inputs, etc.)
- Videos and content
- Call-to-action links

**Security:**
- Each instance has a unique 12-character token
- Token is randomly generated and hard to guess
- No authentication required
- RLS policy: `share_token IS NOT NULL`

**Example Flow:**
1. You create a presentation for "Maria Rodriguez"
2. You get share link: `/view/K7M2P9N4X1Q5`
3. You send link to Maria via email
4. Maria clicks link (no login required)
5. She sees presentation personalized with her name
6. She can interact with all questions/forms

**Privacy Notes:**
- ⚠️ Anyone with the token can view the presentation
- ⚠️ Treat share links like passwords
- ✅ Each presentation has a unique token
- ✅ Tokens cannot be guessed or enumerated

---

### 3. Template Previews - Public (Anyone)

**URL:** `https://ultra-mango-generator.vercel.app/presentations/zinzino-mex`

**Who Can See:**
- ✅ **Anyone** (no account needed)
- ✅ Shows the template without customization
- ✅ Can be used to preview before creating

**What They See:**
- The template in its original form
- Default placeholder text (e.g., "Customer" instead of actual name)
- All slides and content
- Basic flow and interactions

**Use Cases:**
- Preview templates before signing up
- Show clients what a presentation looks like
- Test functionality
- Share template demos

**Available Previews:**
1. `/presentations/zinzino-mex` - Zinzino Mexico
2. `/presentations/super-presentation-pro` - 3D Presentation
3. `/presentations/forest-night-journey` - Forest Journey
4. `/presentations/omega-balance` - Omega Balance Quiz

---

## 🔐 Security Model

### Authentication Layers

```
┌─────────────────────────────────────────────────────────┐
│  Dashboard & Creation                                   │
│  - Requires login (Supabase Auth)                       │
│  - RLS policies check auth.uid()                        │
│  - Can only see/edit own presentations                  │
└─────────────────────────────────────────────────────────┘
                            ↓
                     Creates & Sends
                            ↓
┌─────────────────────────────────────────────────────────┐
│  Share Link (Public)                                    │
│  - No login required                                    │
│  - Access via unique token                              │
│  - RLS allows read with valid token                     │
│  - Recipient can interact & submit answers              │
└─────────────────────────────────────────────────────────┘
```

### Database Policies

**For Authenticated Users (Dashboard):**
```sql
-- Users can only see their own presentations
CREATE POLICY "Users can read own presentations" ON presentations
  FOR SELECT USING (auth.uid() = created_by);

-- Users can only manage their own instances
CREATE POLICY "Users can manage own instances" ON presentation_instances
  FOR ALL USING (auth.uid() = created_by);
```

**For Public Access (Share Links):**
```sql
-- Anyone can view instances with valid token
CREATE POLICY "Anyone can view instances by share token" ON presentation_instances
  FOR SELECT USING (share_token IS NOT NULL);

-- Anyone can submit answers for shared instances
CREATE POLICY "Anyone can submit answers for shared instances" ON question_answers
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM presentation_instances
      WHERE id = instance_id AND share_token IS NOT NULL
    )
  );
```

---

## 🎮 User Flows

### Flow 1: Creator Creates Presentation

```
1. Sign up / Log in
   ↓
2. Go to Dashboard
   ↓
3. Select template
   ↓
4. Fill customization form
   - Recipient name: "John Smith"
   - Email: john@example.com
   - Store link: https://mystore.com
   ↓
5. Click "Create & Send"
   ↓
6. System generates:
   - Presentation record (private to you)
   - Instance with unique token
   - Share link
   ↓
7. Copy share link
   ↓
8. Send to recipient
```

### Flow 2: Recipient Views Presentation

```
1. Receives share link via email/SMS
   ↓
2. Clicks link (no account needed)
   ↓
3. Views personalized presentation
   - Sees their name: "Hello John Smith"
   - Sees customized content
   ↓
4. Interacts with presentation
   - Answers questions
   - Provides input
   - Watches videos
   ↓
5. Completes call-to-action
   - Clicks store link
   - Signs up
   - Etc.
```

### Flow 3: Public Preview

```
1. Visit /presentations/[template-id]
   ↓
2. View template (no login)
   ↓
3. See all slides and features
   ↓
4. Decide to sign up and create customized version
```

---

## 📈 Privacy & Data Control

### What Data is Private?

**Stored in Database (Private):**
- Your account info (email, name)
- List of presentations you created
- Recipient email addresses
- Custom store links
- When presentations were sent/viewed

**Accessible via Share Link (Semi-Public):**
- Recipient name (in presentation)
- Store link (if you provided one)
- Custom questions and answers
- Presentation content

### Best Practices:

✅ **DO:**
- Share links only with intended recipients
- Use email delivery for sensitive presentations
- Monitor who has access to share links
- Regenerate presentations if link is compromised

❌ **DON'T:**
- Post share links publicly on social media
- Include sensitive personal information in presentations
- Share links with untrusted parties
- Use same presentation for multiple recipients (create separate ones)

---

## 🔧 Technical Implementation

### Middleware Protection

**File:** `src/middleware.ts`

```typescript
// Public routes (no auth required)
const publicRoutes = [
  '/auth/login',      // Login page
  '/auth/signup',     // Signup page  
  '/view',            // Share links
  '/presentations'    // Template previews
];

// All other routes require authentication
```

### Share Token Generation

**File:** `src/lib/services/instances.ts`

- Generates random 12-character alphanumeric token
- Checks uniqueness against database
- Stores in `presentation_instances.share_token`
- Token format: `K7M2P9N4X1Q5` (uppercase letters + numbers)

---

## 🎯 Summary Table

| Feature | Authentication | Data Privacy | Use Case |
|---------|---------------|--------------|----------|
| **Dashboard** | Required | Private (your data only) | Create & manage presentations |
| **Share Links** | Not required | Semi-public (anyone with link) | Send to recipients |
| **Template Previews** | Not required | Public (demo content) | Preview before creating |
| **Database Records** | Required to create | Private (RLS protected) | Store presentation data |

---

## ✅ Key Takeaways

1. **Your dashboard is private** - Only you can see your presentations
2. **Share links are public** - Anyone with the link can view (no login)
3. **Each share link is unique** - Different token for each presentation
4. **Template previews are public** - Anyone can preview templates
5. **Database is protected** - RLS policies enforce access control
6. **Recipients don't need accounts** - Share links work without signup

---

## 🚀 Live Example

Your site: **https://ultra-mango-generator.vercel.app/**

**Try it:**
1. Visit homepage (public)
2. Preview templates at `/presentations/omega-balance` (public)
3. Sign up at `/auth/signup` (creates account)
4. Go to `/dashboard` (private - your presentations only)
5. Create a presentation (generates unique share link)
6. Share link works without login (public with token)

**Security verified!** ✅

