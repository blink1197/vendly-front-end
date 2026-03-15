import axios from 'axios';

const api = axios.create({
	baseURL: import.meta.env.VITE_JOB_TRACKER_API,
});

api.interceptors.request.use((config) => {
	try {
		const userStr = localStorage.getItem('user');
		if (!userStr) return config; // no user stored

		const user = JSON.parse(userStr);
		if (user?.token) {
			config.headers.Authorization = `Bearer ${user.token}`;
		}
	} catch (err) {
		console.warn('Failed to parse user from localStorage:', err);
	}

	return config;
});

export default api;
