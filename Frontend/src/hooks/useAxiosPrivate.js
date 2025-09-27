import { useEffect } from 'react';
import { axiosPrivate } from '../api/axios';
import { useAuth } from '../Context/AuthContext';
import { useRefreshToken } from './useRefreshToken';

export const useAxiosPrivate = () => {
  const refresh = useRefreshToken();
  const { auth } = useAuth();

  useEffect(() => {
    // Request Interceptor: Add the Authorization header before the request is sent
    const requestIntercept = axiosPrivate.interceptors.request.use(
      (config) => {
        if (!config.headers['Authorization']) {
          config.headers['Authorization'] = `Bearer ${auth?.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response Interceptor: Handle token expiration and refresh
    const responseIntercept = axiosPrivate.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error?.config;
        // If the error is 401 and we haven't retried yet
        if (error?.response?.status === 401 && !prevRequest?.sent) {
          prevRequest.sent = true; // Mark as retried
          try {
            const newAccessToken = await refresh();
            prevRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
            // Retry the original request
            return axiosPrivate(prevRequest);
          } catch (refreshError) {
            // Refresh token failed, handle logout
            console.error('Refresh token failed', refreshError);
            // Here you would typically log the user out
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Cleanup function to remove interceptors
    return () => {
      axiosPrivate.interceptors.request.eject(requestIntercept);
      axiosPrivate.interceptors.response.eject(responseIntercept);
    };
  }, [auth, refresh]);

  return axiosPrivate;
};
