import axios from "axios";
import type { AuthResponse, GoogleSignInRequest, User } from "./api-interfaces";

const api = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
});

// interceptors handle requests/responses before handled by then or catch.

// If we have an access token, add it to the request headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})


// If we get a 401 (Unauthorized) response, try to refresh the token and retry the request
api.interceptors.response.use((response) => response, async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if(!refreshToken) {
                throw new Error('No refresh token available');
            }

            const response = await axios.post<AuthResponse>('/api/Auth/refresh', { refreshToken });
            const { accessToken, refreshToken: newRefreshToken } = response.data;

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', newRefreshToken);

            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return api(originalRequest);
        } catch(error) {
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
            return Promise.reject(error);
        }
    }
    return Promise.reject(error);
});

export const authApi = {
  googleSignIn: async (data: GoogleSignInRequest): Promise<AuthResponse> => {
    console.log('Calling API with data:', data);
    console.log('API base URL:', api.defaults.baseURL);
    try {
      const response = await api.post<AuthResponse>('/auth/google', data);
      console.log('Success response:', response);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

    refreshToken: async (refreshToken: string): Promise<AuthResponse> => {
        const response = await api.post<AuthResponse>('/Auth/refresh', { refreshToken });
        return response.data;
    },

    getCurrentUser: async (): Promise<User> => {
        const response = await api.get<User>('/Auth/me');
        return response.data;
    },

    logout: async (): Promise<void> => {
        await api.post('/Auth/logout');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    },

}

export default api;