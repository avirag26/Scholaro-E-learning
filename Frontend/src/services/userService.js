const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get user auth token
const getUserAuthToken = () => {
    return localStorage.getItem('authToken');
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = getUserAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// User Service Functions
export const userService = {
    // Get user profile
    async getUserProfile() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'GET',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Session expired. Please login again.');
                }
                if (data.message?.includes('blocked')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Your account has been blocked. Please contact support.');
                }
                throw new Error(data.message || 'Failed to fetch profile');
            }

            return data;
        } catch (error) {
            console.error('Error fetching user profile:', error);
            throw error;
        }
    },

    // Update user profile
    async updateUserProfile(profileData) {
        try {
            const response = await fetch(`${API_BASE_URL}/users/profile`, {
                method: 'PUT',
                headers: createHeaders(),
                body: JSON.stringify(profileData),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Session expired. Please login again.');
                }
                if (data.message?.includes('blocked')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Your account has been blocked. Please contact support.');
                }
                throw new Error(data.message || 'Failed to update profile');
            }

            return data;
        } catch (error) {
            console.error('Error updating user profile:', error);
            throw error;
        }
    },

    // Logout user
    async logoutUser() {
        try {
            const response = await fetch(`${API_BASE_URL}/users/logout`, {
                method: 'POST',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to logout');
            }

            // Clear local storage
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');

            return data;
        } catch (error) {
            console.error('Error logging out:', error);
            // Clear local storage even if API call fails
            localStorage.removeItem('authToken');
            localStorage.removeItem('userInfo');
            throw error;
        }
    },

    // Get enrolled courses
    async getEnrolledCourses() {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/enrolled`, {
                method: 'GET',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Session expired. Please login again.');
                }
                if (data.message?.includes('blocked')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Your account has been blocked. Please contact support.');
                }
                throw new Error(data.message || 'Failed to fetch enrolled courses');
            }

            return data;
        } catch (error) {
            console.error('Error fetching enrolled courses:', error);
            throw error;
        }
    },

    // Enroll in course
    async enrollInCourse(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/enroll/${courseId}`, {
                method: 'POST',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Session expired. Please login again.');
                }
                if (data.message?.includes('blocked')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Your account has been blocked. Please contact support.');
                }
                throw new Error(data.message || 'Failed to enroll in course');
            }

            return data;
        } catch (error) {
            console.error('Error enrolling in course:', error);
            throw error;
        }
    },

    // Get course progress
    async getCourseProgress(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/progress/${courseId}`, {
                method: 'GET',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Session expired. Please login again.');
                }
                if (data.message?.includes('blocked')) {
                    localStorage.removeItem('authToken');
                    localStorage.removeItem('userInfo');
                    window.location.href = '/user/login';
                    throw new Error('Your account has been blocked. Please contact support.');
                }
                throw new Error(data.message || 'Failed to fetch course progress');
            }

            return data;
        } catch (error) {
            console.error('Error fetching course progress:', error);
            throw error;
        }
    }
};

export default userService;