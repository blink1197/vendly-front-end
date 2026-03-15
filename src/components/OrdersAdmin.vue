<script setup>
import { computed, onBeforeMount, reactive, ref } from 'vue'
import api from '../api'
import { formatMoney } from '../utils/string'

const orders = reactive({ data: [] })
const loading = reactive({ state: true })
const searchQuery = ref('') // 🔍 search input

// Fetch all orders
onBeforeMount(async () => {
    try {
        const { data } = await api.get('orders/all-orders')
        orders.data = data.orders
    } catch (error) {
        console.error('Error fetching orders:', error)
    } finally {
        loading.state = false
    }
})

// Computed filtered orders
const filteredOrders = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()
    if (!query) return orders.data

    return orders.data.filter(order => {
        const orderId = order._id?.toLowerCase() || ''
        const fullName = order.user?.fullName?.toLowerCase() || ''
        const email = order.user?.email?.toLowerCase() || ''
        return (
            orderId.includes(query) ||
            fullName.includes(query) ||
            email.includes(query)
        )
    })
})
</script>

<template>
    <div class="container py-4">
        <h1 class="h4 fw-bold mb-4 text-dark">Orders Management</h1>

        <!-- 🔍 Search Bar -->
        <div class="mb-3">
            <input v-model="searchQuery" type="text" class="form-control"
                placeholder="Search by order number, customer name, or email..." />
        </div>

        <!-- Loading State -->
        <div v-if="loading.state" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Loading...</span>
            </div>
            <p class="mt-3 text-muted">Loading orders...</p>
        </div>

        <!-- Empty State -->
        <div v-else-if="!filteredOrders.length" class="text-center py-5">
            <img src="../assets/images/empty-box.png" alt="No orders" width="120" class="mb-3 opacity-75" />
            <p class="text-muted fs-5">No matching orders found.</p>
        </div>

        <!-- TABLE VIEW (Large Screens) -->
        <div v-else class="d-none d-md-block">
            <div class="card shadow-sm border-0">
                <div class="card-header bg-white fw-semibold fs-6">Orders List</div>

                <div class="table-responsive card-body">
                    <table class="table align-middle mb-0">
                        <thead class="table-light">
                            <tr>
                                <th>#</th>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Email</th>
                                <th>Products</th>
                                <th>Total</th>
                                <th>Status</th>
                                <th>Ordered On</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(order, index) in filteredOrders" :key="order._id">
                                <td>{{ index + 1 }}</td>
                                <td><strong>#{{ order._id.slice(-6).toUpperCase() }}</strong></td>
                                <td>{{ order.user.fullName }}</td>
                                <td class="text-muted small">{{ order.user.email }}</td>

                                <!-- ✅ Product details -->
                                <td>
                                    <div v-for="(item, i) in order.products" :key="i"
                                        class="d-flex align-items-center border-bottom py-2"
                                        :class="{ 'border-0': i === order.products.length - 1 }">
                                        <img :src="item.imageUrl || 'https://placehold.co/50x50?text=No+Image'"
                                            alt="Product" class="rounded me-2"
                                            style="width: 50px; height: 50px; object-fit: cover;" />
                                        <div>
                                            <div class="fw-semibold">{{ item.name }}</div>
                                            <div class="text-muted small" v-if="item.description">
                                                {{ item.description.slice(0, 50) + (item.description.length > 50 ? '...'
                                                    : '-') }}
                                            </div>
                                            <div class="text-muted small" v-else>-</div>
                                            <div class="text-muted small">
                                                {{ formatMoney(item.price) }} × {{ item.quantity }}
                                            </div>
                                            <div class="fw-semibold text-success">
                                                Subtotal: {{ formatMoney(item.subtotal) }}
                                            </div>
                                        </div>
                                    </div>
                                </td>

                                <td class="fw-semibold text-success">{{ formatMoney(order.totalPrice) }}</td>

                                <td>
                                    <span class="badge" :class="{
                                        'bg-warning text-dark': order.status === 'Pending',
                                        'bg-success': order.status === 'Completed',
                                        'bg-danger': order.status === 'Cancelled'
                                    }">
                                        {{ order.status }}
                                    </span>
                                </td>

                                <td>
                                    {{
                                        new Date(order.orderedOn).toLocaleDateString('en-PH', {
                                            year: 'numeric',
                                            month: 'short',
                                            day: 'numeric'
                                        })
                                    }}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- CARD VIEW (Small Screens) -->
        <div v-if="!loading.state && filteredOrders.length" class="row row-cols-1 g-3 d-md-none">
            <div v-for="(order, index) in filteredOrders" :key="order._id" class="col">
                <div class="card border-0 shadow-sm order-card">
                    <div class="card-header bg-light d-flex justify-content-between align-items-center flex-wrap">
                        <div>
                            <strong>Order #{{ order._id.slice(-6).toUpperCase() }}</strong>
                            <div class="text-muted small">
                                Ordered on
                                {{
                                    new Date(order.orderedOn).toLocaleDateString('en-PH', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric'
                                    })
                                }}
                            </div>
                        </div>

                        <span class="badge fs-6 mt-2 mt-md-0" :class="{
                            'bg-warning text-dark': order.status === 'Pending',
                            'bg-success': order.status === 'Completed',
                            'bg-danger': order.status === 'Cancelled'
                        }">
                            {{ order.status }}
                        </span>
                    </div>

                    <div class="card-body">
                        <div class="mb-3">
                            <h6 class="fw-bold mb-2">Customer</h6>
                            <p class="mb-1"><strong>{{ order.user.fullName }}</strong></p>
                            <p class="mb-1 text-muted small">{{ order.user.email }}</p>
                            <p class="mb-0 text-muted small">{{ order.user.mobileNo }}</p>
                        </div>

                        <div class="border-top pt-3">
                            <h6 class="fw-bold mb-3">Items</h6>
                            <div v-for="item in order.products" :key="item.name"
                                class="d-flex align-items-center justify-content-between py-2 border-bottom">
                                <div class="d-flex align-items-center">
                                    <img :src="item.imageUrl || 'https://placehold.co/60x60?text=No+Image'"
                                        alt="Product Image" class="me-3 rounded"
                                        style="width: 60px; height: 60px; object-fit: cover;" />
                                    <div>
                                        <div class="fw-semibold">{{ item.name }}</div>
                                        <div class="text-muted small">
                                            {{ formatMoney(item.price) }} × {{ item.quantity }}
                                        </div>
                                    </div>
                                </div>
                                <div class="fw-semibold text-success">
                                    {{ formatMoney(item.subtotal) }}
                                </div>
                            </div>
                        </div>

                        <div class="d-flex justify-content-between align-items-center mt-3 pt-2 border-top">
                            <div class="fw-bold text-muted">Total:</div>
                            <div class="fw-bold text-success fs-5">
                                {{ formatMoney(order.totalPrice) }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.order-card {
    border-radius: 10px;
    transition: all 0.2s ease-in-out;
}

.order-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.1);
}

.badge {
    font-size: 0.9rem;
    padding: 0.4em 0.75em;
}
</style>
