import { axiosPublic } from '../api/axios';
import { useAuth } from '../Context/AuthContext';

export const useRefreshToken = () => {
  const { setAuth } = useAuth();

  const refresh = async () => {
    try {
      // The browser automatically sends the HttpOnly cookie
      const response = await axiosPublic.post('/api/users/refresh');
      const newAccessToken = response.data.accessToken;

      // Update the auth state with the new access token
      setAuth((prev) => {
        return { ...prev, accessToken: newAccessToken };
      });

      return newAccessToken;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      // Clear auth state if refresh fails
      setAuth({});
      throw error;
    }
  };

  return refresh;
};
