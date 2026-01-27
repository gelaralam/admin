const API_BASE_URL = "https://data.gelaralam.id";

export const api = {
    getToken() {
        return localStorage.getItem('paseto_token');
    },

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers,
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'An error occurred' }));
            throw new Error(error.message || `HTTP error! status: ${response.status}`);
        }

        return response.json();
    },

    async uploadImage(file) {
        const token = this.getToken();
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_BASE_URL}/api/upload`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Upload failed' }));
            throw new Error(error.message || 'Upload failed');
        }

        return response.json();
    },

    // Auth
    async loginGoogle(id_token) {
        return this.request('/api/auth/google', {
            method: 'POST',
            body: JSON.stringify({ id_token }),
        });
    },

    // Blog
    getBlogs() { return this.request('/api/blog/'); },
    createBlog(data) { return this.request('/api/blog/', { method: 'POST', body: JSON.stringify(data) }); },
    updateBlog(id, data) { return this.request(`/api/blog/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    deleteBlog(id) { return this.request(`/api/blog/${id}`, { method: 'DELETE' }); },

    // Budaya
    getBudayas() { return this.request('/api/budaya/'); },
    createBudaya(data) { return this.request('/api/budaya/', { method: 'POST', body: JSON.stringify(data) }); },
    updateBudaya(id, data) { return this.request(`/api/budaya/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    deleteBudaya(id) { return this.request(`/api/budaya/${id}`, { method: 'DELETE' }); },

    // Gallery
    getGallery() { return this.request('/api/gallery/'); },
    createGallery(data) { return this.request('/api/gallery/', { method: 'POST', body: JSON.stringify(data) }); },
    updateGallery(id, data) { return this.request(`/api/gallery/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    deleteGallery(id) { return this.request(`/api/gallery/${id}`, { method: 'DELETE' }); },

    // Testimonial
    getTestimonials() { return this.request('/api/testimonial/'); },
    createTestimonial(data) { return this.request('/api/testimonial/', { method: 'POST', body: JSON.stringify(data) }); },
    updateTestimonial(id, data) { return this.request(`/api/testimonial/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    deleteTestimonial(id) { return this.request(`/api/testimonial/${id}`, { method: 'DELETE' }); },

    // Timeline
    getTimelines() { return this.request('/api/timeline/'); },
    createTimeline(data) { return this.request('/api/timeline/', { method: 'POST', body: JSON.stringify(data) }); },
    updateTimeline(id, data) { return this.request(`/api/timeline/${id}`, { method: 'PUT', body: JSON.stringify(data) }); },
    deleteTimeline(id) { return this.request(`/api/timeline/${id}`, { method: 'DELETE' }); },
};
