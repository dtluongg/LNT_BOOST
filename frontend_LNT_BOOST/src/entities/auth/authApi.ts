import { apiFetch } from '../../core/api/httpClient';
import { transformLoginResponse } from './authTransformer';
import type { LoginResponse } from '../../types';

export const authApi = {
  // Authentication login endpoint
  login: async (username: string, password: string): Promise<LoginResponse> => {
    const raw = await apiFetch<any>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    return transformLoginResponse(raw);
  },

  // Reset password for users (Admin only)
  resetPassword: async (username: string, newPassword: string): Promise<{ message: string }> => {
    return apiFetch<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ username, newPassword }),
    });
  }
};
