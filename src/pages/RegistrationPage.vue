<script setup>
import { Notyf } from 'notyf';
import { onBeforeMount, ref, watch } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api.js';
import { useUserStore } from '../stores/userStore.js';

const router = useRouter();
const { user } = useUserStore();

const firstName = ref("");
const lastName = ref("");
const mobileNumber = ref("");
const email = ref("");
const password = ref("");
const confirmPassword = ref("");
const isEnabled = ref(false);
const isLoading = ref(false);
const notyf = new Notyf();
const showPassword = ref(false);

// enable button only when all fields filled & passwords match
watch([email, password, confirmPassword, firstName, lastName, mobileNumber], (current) => {
	isEnabled.value = current.every(input => input !== "") && current[1] === current[2];
});

async function handleSubmit() {
	isLoading.value = true;
	try {
		const response = await api.post('users/register', {
			firstName: firstName.value,
			lastName: lastName.value,
			email: email.value,
			mobileNo: mobileNumber.value,
			password: password.value
		});

		if (response.status === 201) {
			notyf.success(response.data.message);

			firstName.value = "";
			lastName.value = "";
			mobileNumber.value = "";
			email.value = "";
			password.value = "";
			confirmPassword.value = "";

			router.push({ path: '/login' });
		} else {
			notyf.error("Registration Failed. Please contact administrator.");
		}
	} catch (e) {
		if (e.response && [400, 401, 404, 409].includes(e.response.status)) {
			notyf.error(e.response.data.message);
		} else {
			console.error(e);
			notyf.error("Registration Failed. Please contact Administrator.");
		}
	} finally {
		isLoading.value = false;
	}
}



// Google sign up redirect handler
function handleGoogleSignUp() {
	window.location.href = `${import.meta.env.VITE_JOB_TRACKER_API}/auth/google`;
}

onBeforeMount(() => {
	if (user.token) {
		router.push({ path: '/login' });
	}
});
</script>

<template>
	<div class="bg-light min-vh-100 d-flex align-items-center">
		<div class="container register-container">
			<div class="row">
				<div class="col-10 col-sm-8 col-md-6 col-lg-4 m-auto form-container">

					<div class="bg-white mt-5 pt-3 text-center wrapper rounded-top shadow-sm">

						<h2 class="pt-3">Register Now</h2>

						<form @submit.prevent="handleSubmit" class="p-4 pb-2">
							<div class="input-group mb-3">
								<span class="input-group-text"><i class="bi bi-person-fill"></i></span>
								<input type="text" class="form-control" placeholder="First Name" required
									v-model="firstName">
							</div>

							<div class="input-group mb-3">
								<span class="input-group-text"><i class="bi bi-person-fill"></i></span>
								<input type="text" class="form-control" placeholder="Last Name" required
									v-model="lastName">
							</div>

							<div class="input-group mb-3">
								<span class="input-group-text"><i class="bi bi-envelope-fill"></i></span>
								<input type="email" class="form-control" placeholder="Email" required v-model="email">
							</div>

							<div class="input-group mb-3">
								<span class="input-group-text"><i class="bi bi-telephone-fill"></i></span>
								<input type="tel" class="form-control" placeholder="Mobile No (e.g., 09123456789)"
									required v-model="mobileNumber" maxlength="11">
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

							<div class="input-group mb-3">
								<span class="input-group-text">
									<i class="bi bi-lock-fill"></i>
								</span>
								<input :type="showPassword ? 'text' : 'password'" class="form-control"
									placeholder="Confirm Password" required v-model="confirmPassword"
									:disabled="isLoading" />
								<button type="button" class=" input-group-text password-toggle"
									@click="showPassword = !showPassword" tabindex="-1">
									<i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
								</button>
							</div>

							<div class="d-grid mt-2">
								<button type="submit"
									class="btn btn-success d-flex justify-content-center align-items-center gap-2"
									:disabled="!isEnabled || isLoading">
									<span v-if="isLoading" class="spinner-border spinner-border-sm"></span>
									<span>{{ isLoading ? 'Signing Up...' : 'Sign Up' }}</span>
								</button>
							</div>

						</form>
						<p class="mb-2">or</p>
						<!-- Google Login Button -->
						<div class="d-grid px-4 mb-3">
							<button
								class="btn btn-outline-primary d-flex align-items-center justify-content-center gap-2"
								@click="handleGoogleSignUp">
								<img src="https://www.gstatic.com/marketing-cms/assets/images/d5/dc/cfe9ce8b4425b410b49b7f2dd3f3/g.webp=s48-fcrop64=1,00000000ffffffff-rw"
									alt="Google Logo" width="20" height="20" />
								<span>Sign up with Google</span>
							</button>
						</div>

						<p class="text-center pt-3 pb-3 border-top">
							Already have an account? <router-link :to="{ name: 'Login' }"
								class="text-decoration-none">Login Now</router-link>
						</p>
					</div>

				</div>
			</div>
		</div>
	</div>
</template>

<style scoped>
.register-container {
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
