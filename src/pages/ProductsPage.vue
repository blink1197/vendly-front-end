<script setup>
import AdminDashboard from '../components/AdminDashboard.vue';
import ProductsUser from '../components/ProductsUser.vue';
import { useUserStore } from '../stores/userStore';

const { user } = useUserStore();
</script>

<template>
    <div>
        <AdminDashboard v-if="user.isAdmin" />
        <ProductsUser v-else />
    </div>
</template>