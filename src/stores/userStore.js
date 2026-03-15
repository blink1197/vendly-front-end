import { defineStore } from 'pinia';
import { computed, reactive, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';

export const useUserStore = defineStore('user', () => {
    const router = useRouter();

    // Load user from localStorage or initialize empty
    const storedUser = JSON.parse(localStorage.getItem('user')) || {
        token: null,
        email: null,
        firstName: null,
        lastName: null,
        mobileNo: null,
        avatarUrl: null,
        createdAt: null,
        isAdmin: null
    };

    // Reactive state
    const user = reactive(storedUser);

    // Computed: automatically updates when user changes
    const isLoggedIn = computed(() => !!(user.token && user.email));

    // Fetch user details using token
    async function getUserDetails(token) {
        if (!token) {
            logout();
            return;
        }

        try {
            const { data } = await api.get('users/details');

            user.token = token;
            user.email = data.user.email;
            user.firstName = data.user.firstName;
            user.lastName = data.user.lastName;
            user.mobileNo = data.user.mobileNo;
            user.createdAt = data.user.createdAt;
            user.avatarUrl = data.user.avatarUrl;
            user.isAdmin = data.user.isAdmin;
        } catch (error) {
            console.error('Error fetching user details:', error);
            logout();
        }
    }

    // Login
    async function login(email, password) {
        try {
            const { data } = await api.post('users/login', { email, password });

            if (data.access) {
                // Store token and fetch user details
                user.token = data.access;
                await getUserDetails(data.access);

                // Navigate after login
                router.push('/');
            }

            return { success: true };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                message: error.response?.data?.error || 'Login failed. Please try again.',
            };
        }
    }

    // Logout
    function logout() {
        Object.keys(user).forEach(key => {
            user[key] = null;
        });

        localStorage.removeItem('user');

        try {
            router.push('/login');
        } catch {
            console.warn('Router not available during logout');
        }
    }

    // Watch for user changes and persist in localStorage
    watch(
        () => user,
        (newVal) => {
            localStorage.setItem('user', JSON.stringify(newVal));
        },
        { deep: true }
    );

    // Rehydrate user automatically on app startup
    if (user.token) {
        getUserDetails(user.token);
    }

    return {
        user,
        isLoggedIn,
        getUserDetails,
        login,
        logout,
    };
});
