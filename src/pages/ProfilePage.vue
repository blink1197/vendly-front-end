<script setup>
import { onBeforeMount } from 'vue';
import { useRouter } from 'vue-router';
import ResetPassword from '../components/ResetPassword.vue';
import UpdateProfile from '../components/UpdateProfile.vue';
import { useUserStore } from '../stores/userStore.js';
import { formatReadableDateMonthYear } from '../utils/date.js';
import { capitalizeWords } from '../utils/string.js';

const { user } = useUserStore();

const router = useRouter()

onBeforeMount(() => {
  if (!user.token) {
    router.push({ path: '/login' })
  }
})
</script>

<template>
  <div class="container-fluid bg-light min-vh-100 py-5" v-if="user.email">
    <!-- Page Title -->
    <h1 class="text-center text-primary fw-bold mb-5 animate-fade-in">
      My Profile
    </h1>

    <div class="row justify-content-center">
      <!-- Profile Card -->
      <div class="col-md-6 col-lg-5">
        <div class="card shadow-lg border-0 rounded-4 p-4 animate-slide-up">
          <!-- Profile Image -->
          <div class="text-center mb-4">
            <img
              :src="user.avatarUrl || `https://placehold.co/50x50?text=${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`"
              alt="Profile Picture" class="rounded-circle border border-3 border-primary-subtle shadow-sm"
              style="width: 120px; height: 120px; object-fit: cover;" />
          </div>

          <!-- Profile Info -->
          <div class="text-center mb-3">
            <h3 class="fw-semibold text-dark mb-1">{{ capitalizeWords(`${user.firstName} ${user.lastName}`) }}</h3>
            <p class="text-muted">Member since: <strong>{{ formatReadableDateMonthYear(user.createdAt) }}</strong></p>
          </div>

          <hr />

          <!-- Contact Information -->
          <div class="px-3">
            <h5 class="fw-bold text-secondary mb-3">Contact Information</h5>
            <ul class="list-unstyled">
              <li class="mb-2">
                <i class="bi bi-envelope-fill text-primary me-2"></i>
                <strong>Email:</strong> {{ user.email }}
              </li>
              <li>
                <i class="bi bi-phone-fill text-success me-2"></i>
                <strong>Mobile:</strong> {{ user.mobileNo }}
              </li>
            </ul>
          </div>

          <!-- Action Buttons -->
          <div class="text-center mt-4 d-flex flex-column gap-3 flex-md-row align-items-center justify-content-center">
            <button class="btn btn-primary px-4 py-2 rounded-pill shadow-sm" data-bs-toggle="modal"
              data-bs-target="#updateProfileModal">
              <i class="bi bi-pencil-square me-2"></i>Update Profile
            </button>
            <button class="btn btn-outline-danger px-4 py-2 rounded-pill shadow-sm" data-bs-toggle="modal"
              data-bs-target="#resetPasswordModal">
              <i class="bi bi-lock-fill me-2"></i>Reset Password
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modals for Update and Reset -->
    <div class="mt-5 text-center">
      <div class="modal fade" id="updateProfileModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-3 rounded-4 shadow">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <UpdateProfile />
          </div>
        </div>
      </div>

      <div class="modal fade" id="resetPasswordModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content p-3 rounded-4 shadow">
            <div class="modal-header">
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <ResetPassword />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped>
.text-primary {
  color: var(--color-primary) !important;
}
</style>