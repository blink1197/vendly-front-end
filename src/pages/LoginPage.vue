<script setup>
import { Notyf } from 'notyf';
import { onBeforeMount, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useUserStore } from '../stores/userStore';

const route = useRoute();
const router = useRouter();
const notyf = new Notyf();
const { login, user } = useUserStore();

const email = ref("");
const password = ref("");
const isEnabled = ref(false);
const isLoading = ref(false);
const showPassword = ref(false); // 👈 new state for toggling visibility

async function handleSubmit() {
    isLoading.value = true;
    const result = await login(email.value, password.value);
    isLoading.value = false;

    if (result.success) {
        notyf.success('Login successful');
    } else {
        notyf.error(result.message);
    }
}

// Google login redirect handler
function handleGoogleLogin() {
    window.location.href = `${import.meta.env.VITE_JOB_TRACKER_API}/auth/google`;
}

watch([email, password], ([newEmail, newPassword]) => {
    isEnabled.value = newEmail !== "" && newPassword !== "";
});

onBeforeMount(() => {
    if (user.email) {
        router.push({ path: "/" });
        return;
    }

    const error = route.query.error;
    if (error) {
        const messageMap = {
            google_auth_failed: 'Google authentication failed. Please try again.',
            default: 'An error occurred during login. Please try again.'
        };

        notyf.error(messageMap[error] || messageMap.default);
        router.replace({ query: {} });
    }
});
</script>

<template>
    <div class="bg-light min-vh-100 d-flex align-items-center">
        <div class="container login-container">
            <div class="row">
                <div class="col-10 col-sm-8 col-md-6 col-lg-4 m-auto form-container">
                    <div class="bg-white pt-3 text-center wrapper rounded-top shadow-sm">
                        <h2 class="pt-3">Login</h2>

                        <form @submit.prevent="handleSubmit" class="p-4 pb-2">
                            <div class="input-group mb-3">
                                <span class="input-group-text">
                                    <i class="bi bi-envelope-fill"></i>
                                </span>
                                <input type="email" class="form-control" placeholder="Email" required v-model="email"
                                    :disabled="isLoading" />
                            </div>

                            <div class="input-group mb-3">
                                <span class="input-group-text">
                                    <i class="bi bi-lock-fill"></i>
                                </span>
                                <input :type="showPassword ? 'text' : 'password'" class="form-control"
                                    placeholder="Password" required v-model="password" :disabled="isLoading" />
                                <button type="button" class=" input-group-text password-toggle"
                                    @click="showPassword = !showPassword" tabindex="-1">
                                    <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
                                </button>
                            </div>

                            <div class="d-grid mt-2">
                                <button type="submit"
                                    class="btn btn-success d-flex justify-content-center align-items-center gap-2"
                                    :disabled="!isEnabled || isLoading">
                                    <span v-if="!isLoading">Log in</span>
                                    <span v-else>
                                        <span class="spinner-border spinner-border-sm" role="status"></span>
                                        Logging in
                                    </span>
                                </button>
                            </div>
                        </form>

                        <p class="mb-2">or</p>

                        <!-- Google Login Button -->
                        <div class="d-grid px-4 mb-3">
                            <button
                                class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
                                @click="handleGoogleLogin">
                                <img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
                                    alt="Google Logo" width="20" height="20" />
                                <span>Sign in with Google</span>
                            </button>
                        </div>

                        <p class="text-center pt-3 pb-3 border-top">
                            Need an account?
                            <router-link :to="{ name: 'Register' }" class="text-decoration-none">
                                Sign up
                            </router-link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    margin-top: -200px;
}

.btn-success {
    background-color: var(--color-primary) !important;
    border: none !important;
}

.spinner-border {
    width: 1rem;
    height: 1rem;
}

.wrapper {
    transition: all 0.3s ease;
}

.password-toggle {
    border-left: none;
    color: #6c757d;
}

.password-toggle:hover {
    background-color: #f8f9fa;
    color: var(--color-primary);
}

.btn-outline-primary {
    --bs-btn-color: var(--color-primary);
    --bs-btn-border-color: var(--color-primary);
    --bs-btn-hover-color: #fff;
    --bs-btn-hover-bg: var(--color-primary);
    --bs-btn-hover-border-color: var(--color-primary);
    --bs-btn-focus-shadow-rgb: 13, 110, 253;
    --bs-btn-active-color: #fff;
    --bs-btn-active-bg: var(--color-primary);
    --bs-btn-active-border-color: var(--color-primary);
    --bs-btn-active-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
    --bs-btn-disabled-color: var(--color-primary);
    --bs-btn-disabled-bg: transparent;
    --bs-btn-disabled-border-color: var(--color-primary);
    --bs-gradient: none;
}
</style>
