<script setup>
import { ref } from "vue";
import { useUserStore } from "../stores/userStore";
import OrdersAdmin from "./OrdersAdmin.vue";
import ProductsAdmin from "./ProductsAdmin.vue";
import UsersAdmin from "./UsersAdmin.vue";

const tabs = ["Products", "Orders", "Users"];
const activeTab = ref("Products");


// Route guard for non admin users
defineOptions({
    beforeRouteEnter(to, from, next) {
        const { user } = useUserStore();
        if (!user.isAdmin) next({ name: "Home" });
        else next();
    },
});


</script>

<template>
    <div class="container mt-4">
        <h1 class="mb-3">Welcome back, Admin</h1>

        <!-- Tabs -->
        <ul class="nav nav-tabs">
            <li class="nav-item" v-for="tab in tabs" :key="tab">
                <button class="nav-link" :class="{ active: activeTab === tab }" @click="activeTab = tab">
                    {{ tab }}
                </button>
            </li>
        </ul>

        <!-- Tab Content -->
        <div class="mt-4">
            <div v-if="activeTab === 'Products'">
                <ProductsAdmin />
            </div>

            <div v-else-if="activeTab === 'Orders'">
                <OrdersAdmin />
                <!-- Replace with <OrdersTable /> -->
            </div>

            <div v-else-if="activeTab === 'Users'">
                <UsersAdmin />
                <!-- Replace with <UsersTable /> -->
            </div>
        </div>
    </div>
</template>



<style scoped>
.nav-tabs {
    border-bottom: 2px solid #ddd;
}

.nav-link {
    color: #555;
    font-weight: 500;
    transition: 0.2s;
}

.nav-link:hover {
    color: var(--color-primary);
}

.nav-link.active {
    background-color: var(--color-primary);
    color: #fff;
    border: none;
    border-radius: 6px 6px 0 0;
}
</style>