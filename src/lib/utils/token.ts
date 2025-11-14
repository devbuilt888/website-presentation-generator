/**
 * Generate a unique share token for presentation instances
 */

export function generateShareToken(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let token = '';
  
  for (let i = 0; i < 12; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return token;
}

export function validateShareToken(token: string): boolean {
  // Token should be exactly 12 alphanumeric characters
  return /^[A-Z0-9]{12}$/.test(token);
}

