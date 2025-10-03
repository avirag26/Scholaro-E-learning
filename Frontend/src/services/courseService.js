const API_BASE_URL = 'http://localhost:5000/api';

// Helper function to get auth token
const getAuthToken = () => {
    const tutorToken = localStorage.getItem('tutorAuthToken');
    const userToken = localStorage.getItem('authToken');
    return tutorToken || userToken;
};

// Helper function to create headers
const createHeaders = (includeAuth = true) => {
    const headers = {
        'Content-Type': 'application/json',
    };
    
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Helper function to create FormData headers
const createFormDataHeaders = (includeAuth = true) => {
    const headers = {};
    
    if (includeAuth) {
        const token = getAuthToken();
        if (token) {
            headers.Authorization = `Bearer ${token}`;
        }
    }
    
    return headers;
};

// Course Service Functions
export const courseService = {
    // Test authentication
    async testAuth() {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/test-auth`, {
                method: 'GET',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Authentication failed');
            }

            return data;
        } catch (error) {
            console.error('Error testing auth:', error);
            throw error;
        }
    },
    // Create a new course
    async createCourse(courseData) {
        try {
            console.log('=== FRONTEND CREATE COURSE DEBUG ===');
            console.log('Course data:', courseData);
            
            const token = getAuthToken();
            console.log('Auth token:', token ? 'Present' : 'Missing');
            
            const formData = new FormData();
            formData.append('title', courseData.title);
            formData.append('description', courseData.description);
            formData.append('category', courseData.category);
            formData.append('regularPrice', courseData.regularPrice);
            formData.append('offerPercentage', courseData.offerPercentage || 0);
            
            if (courseData.image) {
                formData.append('image', courseData.image);
                console.log('Image file:', courseData.image.name, courseData.image.size);
            }

            console.log('Making request to:', `${API_BASE_URL}/courses/create`);
            
            const response = await fetch(`${API_BASE_URL}/courses/create`, {
                method: 'POST',
                headers: createFormDataHeaders(),
                body: formData,
            });
            
            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            const data = await response.json();
            
            if (!response.ok) {
                console.error('Server response:', response.status, data);
                throw new Error(data.message || `Server error: ${response.status}`);
            }

            return data;
        } catch (error) {
            console.error('Error creating course:', error);
            console.error('Error details:', {
                message: error.message,
                stack: error.stack
            });
            throw error;
        }
    },

    // Get all courses for a tutor
    async getTutorCourses() {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/tutor/courses`, {
                method: 'GET',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch courses');
            }

            return data;
        } catch (error) {
            console.error('Error fetching tutor courses:', error);
            throw error;
        }
    },

    // Toggle course listing status
    async toggleCourseListing(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/toggle-listing/${courseId}`, {
                method: 'PATCH',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle course listing');
            }

            return data;
        } catch (error) {
            console.error('Error toggling course listing:', error);
            throw error;
        }
    },

    // Add lesson to course
    async addLesson(courseId, lessonData) {
        try {
            const formData = new FormData();
            formData.append('title', lessonData.title);
            formData.append('position', lessonData.position);
            
            if (lessonData.video) {
                formData.append('video', lessonData.video);
            }
            
            if (lessonData.pdfNotes) {
                formData.append('pdf', lessonData.pdfNotes);
            }

            const response = await fetch(`${API_BASE_URL}/courses/add-lesson/${courseId}`, {
                method: 'POST',
                headers: createFormDataHeaders(),
                body: formData,
            });

            const data = await response.json();
            
            if (!response.ok) {
                // Handle token expiration
                if (data.expired || data.message?.includes('expired')) {
                    localStorage.removeItem('tutorAuthToken');
                    localStorage.removeItem('tutorInfo');
                    window.location.href = '/tutor/login';
                    throw new Error('Session expired. Please login again.');
                }
                throw new Error(data.message || 'Failed to add lesson');
            }

            return data;
        } catch (error) {
            console.error('Error adding lesson:', error);
            throw error;
        }
    },

    // Delete course
    async deleteCourse(courseId) {
        try {
            const response = await fetch(`${API_BASE_URL}/courses/delete/${courseId}`, {
                method: 'DELETE',
                headers: createHeaders(),
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete course');
            }

            return data;
        } catch (error) {
            console.error('Error deleting course:', error);
            throw error;
        }
    },

    // Get all listed courses (for users)
    async getListedCourses(filters = {}) {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.page) queryParams.append('page', filters.page);
            if (filters.limit) queryParams.append('limit', filters.limit);

            const response = await fetch(`${API_BASE_URL}/courses/listed?${queryParams}`, {
                method: 'GET',
                headers: createHeaders(false), // No auth needed for public courses
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch listed courses');
            }

            return data;
        } catch (error) {
            console.error('Error fetching listed courses:', error);
            throw error;
        }
    }
};

export default courseService;