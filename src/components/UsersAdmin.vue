<script setup>
import { Notyf } from 'notyf';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import api from '../api';
import { useUserStore } from '../stores/userStore';

const notyf = new Notyf();
const { user: adminUser } = useUserStore();
const users = reactive({ data: [] });
const loading = reactive({ state: true });
const searchQuery = ref(''); // 🔍 search input

// Fetch all users
onBeforeMount(async () => {
    try {
        const { data } = await api.get('users/all');
        users.data = data.users;
    } catch (error) {
        console.error('Error fetching users:', error);
    } finally {
        loading.state = false;
    }
});

// Computed filtered list based on search query
const filteredUsers = computed(() => {
    const query = searchQuery.value.trim().toLowerCase();
    if (!query) return users.data;
    return users.data.filter(user =>
        user.firstName?.toLowerCase().includes(query) ||
        user.lastName?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
});

// Toggle admin status
async function toggleAdmin(user) {
    if (user.email === adminUser.email) {
        notyf.error("You cannot revoke your own admin privileges.");
        return;
    }

    try {
        if (user.isAdmin) {
            await api.patch(`users/${user._id}/revoke-admin`);
        } else {
            await api.patch(`users/${user._id}/set-as-admin`);
        }

        const index = users.data.findIndex(u => u._id === user._id);
        if (index !== -1) {
            users.data[index] = { ...users.data[index], isAdmin: !users.data[index].isAdmin };
        }

        notyf.success("User privileges updated");
    } catch (error) {
        console.error('Failed to toggle admin:', error);
    }
}
</script>

<template>
    <div class="container py-4">
        <h1 class="h4 fw-bold mb-4 text-dark">User Management</h1>

        <!-- Search Bar -->
        <div class="mb-3">
            <input v-model="searchQuery" type="text" class="form-control" placeholder="Search by name or email..." />
        </div>

        <!-- Loading -->
        <div v-if="loading.state" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading users...</p>
        </div>

        <!-- Empty -->
        <div v-else-if="filteredUsers.length === 0" class="text-secondary">No matching users found.</div>

        <!-- Users -->
        <div v-else>
            <!-- Table layout for large screens -->
            <div class="d-none d-md-block">
                <div class="card shadow-sm border-0">
                    <div class="card-header bg-white fw-semibold fs-6">
                        Users List
                    </div>
                    <div class="table-responsive card-body">
                        <table class="table align-middle mb-0">
                            <thead class="table-light">
                                <tr>
                                    <th scope="col">Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Mobile</th>
                                    <th scope="col">Role</th>
                                    <th scope="col" class="text-end">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="user in filteredUsers" :key="user._id">
                                    <td>
                                        <div class="d-flex align-items-center">
                                            <img class="rounded-circle border text-primary fw-bold d-flex align-items-center justify-content-center me-2"
                                                :src="user.avatarUrl || `https://placehold.co/50x50?text=${user.firstName.charAt(0).toUpperCase()}${user.lastName.charAt(0).toUpperCase()}`"
                                                style="width: 36px; height: 36px;" />
                                            <span class="fw-semibold">{{ user.firstName }} {{ user.lastName }}</span>
                                        </div>
                                    </td>
                                    <td class="text-secondary">{{ user.email }}</td>
                                    <td class="text-secondary">{{ user.mobileNo || '—' }}</td>
                                    <td>
                                        <span class="badge"
                                            :class="user.isAdmin ? 'bg-success bg-opacity-25 text-success' : 'bg-secondary bg-opacity-25 text-secondary'">
                                            {{ user.isAdmin ? 'Admin' : 'User' }}
                                        </span>
                                    </td>
                                    <td class="text-end">
                                        <button @click="toggleAdmin(user)"
                                            :class="user.isAdmin ? 'btn btn-sm btn-outline-danger' : 'btn btn-sm btn-outline-primary'">
                                            {{ user.isAdmin ? 'Demote' : 'Promote' }}
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <!-- Card layout for mobile -->
            <div class="row row-cols-1 row-cols-sm-2 g-3 d-md-none">
                <div v-for="user in filteredUsers" :key="user._id" class="col">
                    <div class="card border-0 shadow-sm h-100">
                        <div class="card-body">
                            <div class="d-flex align-items-center mb-2">
                                <div class="rounded-circle bg-primary bg-opacity-10 text-primary fw-bold d-flex align-items-center justify-content-center me-3"
                                    style="width: 40px; height: 40px;">
                                    {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
                                </div>
                                <div>
                                    <h6 class="mb-0 fw-semibold">{{ user.firstName }} {{ user.lastName }}</h6>
                                    <small class="text-muted">{{ user.email }}</small>
                                </div>
                            </div>

                            <div class="d-flex justify-content-between align-items-center small text-muted">
                                <span>{{ user.mobileNo || '—' }}</span>
                                <span class="badge"
                                    :class="user.isAdmin ? 'bg-success bg-opacity-25 text-success' : 'bg-secondary bg-opacity-25 text-secondary'">
                                    {{ user.isAdmin ? 'Admin' : 'User' }}
                                </span>
                            </div>
                        </div>

                        <div class="card-footer bg-transparent border-0 pt-0">
                            <button @click="toggleAdmin(user)"
                                :class="user.isAdmin ? 'btn btn-sm btn-outline-danger w-100' : 'btn btn-sm btn-outline-primary w-100'">
                                {{ user.isAdmin ? 'Demote' : 'Promote' }}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
