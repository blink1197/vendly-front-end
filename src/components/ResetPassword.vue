<script setup>
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { computed, ref } from 'vue';
import api from '../api';
import { useUserStore } from '../stores/userStore.js';

const newPassword = ref('');
const loading = ref(false);
const notyf = new Notyf();
const showPassword = ref(false);

const { user } = useUserStore();

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

// 🔒 Password strength checker
const strength = computed(() => {
  const pwd = newPassword.value;
  let score = 0;

  if (!pwd) return { width: '0%', color: '#ddd', text: '' };

  // Score calculation
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd)) score++;
  if (/[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[@$!%*?&]/.test(pwd)) score++;

  // Convert score to level
  if (score <= 2) {
    return { width: '33%', color: '#dc3545', text: 'Weak' }; // red
  } else if (score === 3 || score === 4) {
    return { width: '66%', color: '#ffc107', text: 'Moderate' }; // yellow
  } else {
    return { width: '100%', color: '#28a745', text: 'Strong' }; // green
  }
});

const handleReset = async () => {
  try {
    loading.value = true;

    if (!user.token) {
      notyf.error('You are not authorized');
      loading.value = false;
      return;
    }

    await api.put("users/update-password", { newPassword: newPassword.value });

    notyf.success('Password reset successfully');
    newPassword.value = '';
  } catch (err) {
    const msg = err.response?.data?.message || 'Password reset failed';
    notyf.error(msg);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="d-flex align-items-center justify-content-center">
    <div class="card shadow-lg border-0">
      <div class="card-body p-5">
        <h2 class="text-center mb-3 text-gradient fw-bold">🔐 Reset Your Password</h2>
        <p class="text-muted text-center mb-4">
          Create a strong new password to secure your account.
        </p>

        <form @submit.prevent="handleReset" class="needs-validation">
          <!-- Password input -->
          <div class="mb-4 position-relative">
            <label for="newPassword" class="form-label fw-semibold">New Password</label>
            <div class="input-group">
              <input :type="showPassword ? 'text' : 'password'" id="newPassword" v-model="newPassword"
                class="form-control form-control-lg" placeholder="Enter new password" required />
              <button type="button" class="btn btn-outline-secondary" @click="togglePassword">
                <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
              </button>
            </div>
          </div>

          <!-- Strength Indicator -->
          <div v-if="newPassword" class="mb-3">
            <div class="progress" style="height: 6px;">
              <div class="progress-bar" role="progressbar"
                :style="{ width: strength.width, backgroundColor: strength.color }"></div>
            </div>
            <small class="text-muted">{{ strength.text }}</small>
          </div>

          <!-- Submit Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 mt-3 rounded-pill fw-semibold" :disabled="loading">
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span> Resetting...
            </span>
            <span v-else>Reset Password</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>
