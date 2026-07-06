const API_BASE = '/api';

let isRefreshing = false;

// mảng chứa nhiều function callback
let refreshSubscribers: ((token: string) => void)[] = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}
// Core apiFetch client helper with auto silent-refresh on 401
export async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('auth_token');
  
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && endpoint !== '/auth/refresh' && endpoint !== '/auth/login') {
    const refreshToken = localStorage.getItem('auth_refresh_token');
    if (!refreshToken) {
      // Clear token and reload if there is no refresh token
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_refresh_token');
      localStorage.removeItem('auth_user');
      window.location.reload();
      throw new Error('Unauthorized');
    }

    if (!isRefreshing) {
      isRefreshing = true;
      try {
        const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            accessToken: token || '',
            refreshToken: refreshToken,
          }),
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to refresh token');
        }

        const tokenModel = await refreshResponse.json();
        localStorage.setItem('auth_token', tokenModel.accessToken);
        localStorage.setItem('auth_refresh_token', tokenModel.refreshToken);
        
        isRefreshing = false;
        onRefreshed(tokenModel.accessToken);
      } catch (error) {
        isRefreshing = false;
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_refresh_token');
        localStorage.removeItem('auth_user');
        window.location.reload();
        throw error;
      }
    }

    // Queue the current request to be run once token is refreshed
    const retryOriginalRequest = new Promise<T>((resolve, reject) => {
      subscribeTokenRefresh((newToken) => {
        const newHeaders = new Headers(options.headers || {});
        newHeaders.set('Content-Type', 'application/json');
        newHeaders.set('Authorization', `Bearer ${newToken}`);
        
        fetch(`${API_BASE}${endpoint}`, {
          ...options,
          headers: newHeaders,
        })
          .then(async (res) => {
            if (!res.ok) {
              const errText = await res.text();
              let errMessage = `API Error ${res.status}`;
              try {
                const errJson = JSON.parse(errText);
                errMessage = errJson.message || errMessage;
              } catch {
                errMessage = errText || errMessage;
              }
              throw new Error(errMessage);
            }
            if (res.status === 204) {
              resolve({} as T);
            } else {
              resolve(res.json() as Promise<T>);
            }
          })
          .catch((err) => reject(err));
      });
    });

    return retryOriginalRequest;
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `API Error ${response.status}`;
    try {
      const errorJson = JSON.parse(errorText);
      errorMessage = errorJson.message || errorMessage;
    } catch {
      errorMessage = errorText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  // For 204 No Content endpoints
  if (response.status === 204) {
    return {} as T;
  }

  return response.json() as Promise<T>;
}