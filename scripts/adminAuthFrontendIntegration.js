/*
  Frontend integration helpers for admin auth.
  Copy these into your frontend codebase or import this file if shared.
*/

export function getNextPasswordInputType(currentType) {
  return currentType === 'password' ? 'text' : 'password';
}

export async function adminLogin(apiBaseUrl, { email, password }) {
  const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Login failed');
  }

  // Expected response:
  // { token: string, admin: { id: string, email: string } }
  return data;
}

export async function updateAdminPassword(
  apiBaseUrl,
  token,
  { currentPassword, newPassword, confirmNewPassword }
) {
  const response = await fetch(`${apiBaseUrl}/api/auth/update-password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      currentPassword,
      newPassword,
      confirmNewPassword,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Could not update password');
  }

  // Expected response:
  // { message: 'Password updated successfully' }
  return data;
}
