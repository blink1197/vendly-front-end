<script setup>
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { ref } from 'vue';
import api from '../api';
import { useUserStore } from '../stores/userStore.js';
import ProfileImageUploader from './ProfileImageUploader.vue';

const { user } = useUserStore();
const notyf = new Notyf();

const firstName = ref(user.firstName || '');
const lastName = ref(user.lastName || '');
const mobileNo = ref(user.mobileNo || '');
const avatarUrl = ref(user.avatarUrl || '');
const loading = ref(false);
const uploaderRef = ref(null);

async function updateProfile() {
  if (!firstName.value || !lastName.value || !mobileNo.value) {
    notyf.error('All fields are required.');
    return;
  }

  loading.value = true;

  try {
    await api.patch(
      '/users/details',
      {
        firstName: firstName.value,
        lastName: lastName.value,
        mobileNo: mobileNo.value,
        avatarUrl: avatarUrl.value
      },
    );

    // Update user store
    user.firstName = firstName.value;
    user.lastName = lastName.value;
    user.mobileNo = mobileNo.value;
    user.avatarUrl = avatarUrl.value;

    notyf.success('Profile updated successfully!');

  } catch (error) {
    console.error(error);
    notyf.error('Failed to update profile.');
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="d-flex justify-content-center align-items-center">
    <div class="card shadow-lg border-0 w-100">
      <div class="card-body p-5">
        <!-- Header -->
        <div class="text-center mb-4">
          <div class="avatar-wrapper mx-auto position-relative">
            <ProfileImageUploader ref="uploaderRef" @uploaded="url => {
              avatarUrl = url
              loading = false
            }" @uploading="() => loading = true" />
          </div>
          <h3 class="fw-bold mt-3 text-gradient">Update Profile</h3>
          <p class="text-muted small">Keep your details up to date</p>
        </div>

        <!-- Form -->
        <form @submit.prevent="updateProfile" class="text-start">
          <!-- First Name -->
          <div class="mb-3">
            <label for="firstName" class="form-label fw-semibold">First Name</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person"></i></span>
              <input type="text" id="firstName" v-model="firstName" class="form-control" placeholder="Enter first name"
                required />
            </div>
          </div>

          <!-- Last Name -->
          <div class="mb-3">
            <label for="lastName" class="form-label fw-semibold">Last Name</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-person-badge"></i></span>
              <input type="text" id="lastName" v-model="lastName" class="form-control" placeholder="Enter last name"
                required />
            </div>
          </div>

          <!-- Mobile Number -->
          <div class="mb-3">
            <label for="mobileNo" class="form-label fw-semibold">Mobile Number</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-telephone"></i></span>
              <input type="text" id="mobileNo" v-model="mobileNo" maxlength="11" class="form-control"
                placeholder="09XXXXXXXXX" required />
            </div>
            <small class="text-muted">{{ mobileNo.length }}/11 digits</small>
          </div>

          <!-- Update Button -->
          <button type="submit" class="btn btn-primary w-100 py-2 mt-3 rounded-pill fw-semibold" :disabled="loading">
            <span v-if="loading">
              <span class="spinner-border spinner-border-sm me-2"></span> Updating...
            </span>
            <span v-else><i class="bi bi-pencil-square me-2"></i>Update Profile</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</template>



<style scoped>
.card {
  max-width: 500px;
  margin: 0 auto;
}

.avatar-img {
  max-height: 300px;
}
</style>
