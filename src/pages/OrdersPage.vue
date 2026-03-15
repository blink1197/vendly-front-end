<script setup>
import { onBeforeMount, ref } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api';
import { useUserStore } from '../stores/userStore';
import { formatMoney } from '../utils/string';

const { isLoggedIn } = useUserStore();
const router = useRouter();
const orders = ref([])
const loading = ref(true);



onBeforeMount(async () => {
    if (!isLoggedIn) router.push({ name: 'Home' })

    try {
        const { data } = await api.get(`orders/my-orders`);
        orders.value = data.orders || [];
    } catch (err) {
        console.error('Error retreiving orders:', err);
    } finally {
        loading.value = false;
    }

})

</script>


<template>
    <div class="container main-content orders-list mt-5">
        <h2 class="mb-4">Your Orders</h2>

        <!-- Top Buttons -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <router-link class="btn browse-btn mb-2 mb-md-0 me-3" :to="{ name: 'Products' }">Browse
                Products</router-link>
            <router-link class="btn btn-primary mb-2 mb-md-0 me-3" :to="{ name: 'Cart' }">Your Cart</router-link>
        </div>

        <!-- Main Card -->
        <div class="card shadow-sm border-0">
            <div class="card-header bg-white fw-bold fs-5">
                Orders
            </div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading your bag...</p>
            </div>

            <!-- Empty Cart -->
            <div v-else-if="!orders.length" class="text-center py-5">
                <img src="../assets/images/empty-box.png" alt="No items" width="120" class="mb-3 opacity-75" />
                <p class="text-muted mb-3 fs-5">No orders found.</p>
            </div>

            <!-- Ordders List -->
            <div v-else class="p-3 orders-list">
                <div v-for="order in orders" :key="order._id" class="card mb-4 border-0 shadow-sm rounded-4">
                    <div class="card-body border">
                        <!-- Order Header -->
                        <div class="d-flex justify-content-between align-items-center flex-wrap mb-3">
                            <div>
                                <h5 class="fw-bold mb-1">Order #{{ order._id.slice(-6).toUpperCase() }}</h5>
                                <p class="text-muted small mb-0">
                                    Ordered on
                                    {{ new Date(order.orderedOn).toLocaleDateString('en-PH', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                    }) }}
                                </p>
                            </div>
                            <span class="badge fs-6" :class="{
                                'bg-warning text-dark': order.status === 'Pending',
                                'bg-success': order.status === 'Completed',
                                'bg-danger': order.status === 'Cancelled'
                            }">
                                {{ order.status }}
                            </span>
                        </div>

                        <!-- Products List -->
                        <div class="border-top pt-3">
                            <div v-for="item in order.productsOrdered" :key="item._id"
                                class="d-flex align-items-center mb-3 flex-wrap">
                                <img :src="item.productId?.imageUrl || 'https://placehold.co/70x70/d7530f/ffffff?font=raleway'"
                                    alt="Product Image" width="70" height="70" class="rounded me-3 mb-2 mb-md-0"
                                    style="object-fit: cover;" />
                                <div class="flex-grow-1">
                                    <div class="fw-semibold">{{ item.productId?.name }}</div>
                                    <div class="text-muted small">
                                        {{ item.quantity }} × {{ formatMoney(item.productId?.price) }}
                                    </div>
                                </div>
                                <div class="fw-semibold text-success">
                                    {{ formatMoney(item.subtotal) }}
                                </div>
                            </div>
                        </div>

                        <!-- Total Section -->
                        <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                            <div class="fw-bold text-muted">Total:</div>
                            <div class="fw-bold text-success fs-5">{{ formatMoney(order.totalPrice) }}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-content {
    padding-bottom: 4rem;
}

.btn-outline-secondary,
.browse-btn {
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

.table td,
.table th {
    vertical-align: middle;
}

.badge {
    font-size: 0.85rem;
    padding: 0.4em 0.6em;
}

.orders-list {
    max-width: 800px;
}
</style>
