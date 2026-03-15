<script setup>
import { Notyf } from 'notyf'
import { onBeforeMount, reactive, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import api from '../api'
import QuantityCounter from '../components/ui/QuantityCounter.vue'
import { useUserStore } from '../stores/userStore'
import { formatMoney } from '../utils/string'

const router = useRouter();
const notyf = new Notyf();
const { user, isLoggedIn } = useUserStore();
const route = useRoute();
const quantity = ref(1);
const productAdded = ref(false);
const isLoading = ref(false);

const product = reactive({
    data: null,
    loading: true,
    error: false
})

async function addToCart() {
    isLoading.value = true;
    const productToAdd = {
        productId: product.data._id,
        quantity: quantity.value,
        subtotal: product.data.price * quantity.value
    }

    try {
        await api.post(`cart/add-to-cart`, productToAdd)
        notyf.success('Product successsfully added to cart.')
        isLoading.value = false;
        productAdded.value = true;
        router.push('/products')
    } catch (err) {
        console.error('Error adding product to cart:', err)
        notyf.error('Failed to add product to cart.')
        isLoading.value = false;
    } finally {
        isLoading.loading = false
    }
}

onBeforeMount(async () => {
    try {
        const { data } = await api.get(`products/${route.params.id}`)
        if (!data || Object.keys(data).length === 0) {
            product.error = true
        } else {
            product.data = data
        }
    } catch (err) {
        console.error('Error fetching product:', err)
        product.error = true
    } finally {
        product.loading = false
    }
})
</script>

<template>
    <div class="container">
        <nav class="my-3" aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item">
                    <router-link to="/products">Products</router-link>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                    {{ product.data ? product.data.name : '...' }}
                </li>
            </ol>
        </nav>

        <!-- Loading State -->
        <div v-if="product.loading" class="row mx-auto my-3 gap-4 gap-md-0">
            <!-- Image Skeleton -->
            <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <div class="skeleton skeleton-img w-100 rounded"></div>
            </div>

            <!-- Details Skeleton -->
            <div class="col-12 col-md-6">
                <div class="skeleton skeleton-title mb-3"></div>
                <div class="skeleton skeleton-text mb-2"></div>
                <div class="skeleton skeleton-text mb-2 w-75"></div>
                <div class="skeleton skeleton-price my-4 w-25"></div>
                <div class="skeleton skeleton-btn w-50"></div>
            </div>
        </div>

        <!-- Empty / Not Found State -->
        <div v-else-if="product.error" class="text-center my-5">
            <img src="../assets/images/empty-box.png" alt="Not found" width="120" class="mb-3 opacity-75" />
            <h5 class="text-muted mb-3">Product not found or no longer available.</h5>
            <router-link to="/products" class="btn btn-outline-primary">
                Back to Products
            </router-link>
        </div>

        <!-- Product Details -->
        <div class="row mx-auto my-3 gap-4 gap-md-0" v-else>
            <!-- Product Image -->
            <div class="col-12 col-md-6 d-flex align-items-center justify-content-center">
                <img class="img-fluid rounded"
                    :src="product.data.imageUrl || `https://placehold.co/600x400/d7530f/ffffff?font=raleway&text=${encodeURIComponent(product.data.name)}`"
                    :alt="product.data.name" />
            </div>

            <!-- Product Details -->
            <div class="col-12 col-md-6">
                <div class="d-flex gap-2 text-primary">
                    <h1 class="bi bi-bag-fill"></h1>
                    <h1 class="mb-3">{{ product.data.name }}</h1>
                </div>
                <h6>Description:</h6>
                <p class="text-muted">{{ product.data.description }}</p>
                <p>Price: {{ formatMoney(product.data.price) }}</p>

                <!-- Quantity Counter -->
                <div class="d-flex align-items-center mb-3">
                    <QuantityCounter v-model="quantity" :min="1" :max="10" />
                    <span class="ms-3">x &nbsp;{{ formatMoney(product.data.price) }}</span>
                </div>

                <!-- Add to Cart Buttons -->
                <router-link to="/login" class="btn btn-outline-primary" type="button" v-if="!isLoggedIn">
                    Login to Purchase
                </router-link>

                <span v-else-if="!user.isAdmin">
                    <button v-if="!productAdded" class="btn btn-primary" type="button" @click="addToCart"
                        :disabled="isLoading">
                        {{ isLoading ? 'Adding' : 'Add to cart' }}
                    </button>
                    <router-link v-else class="btn btn-outline-primary" type="button" :to="{ name: 'Cart' }">
                        View cart
                    </router-link>

                </span>


                <button class="btn btn-primary" type="button" v-else disabled>
                    Admins are not allowed to purchase
                </button>


            </div>
        </div>
    </div>
</template>

<style scoped>
.text-primary {
    color: var(--color-primary) !important;
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

.skeleton {
    position: relative;
    background-color: #e2e2e2;
    border-radius: 8px;
    overflow: hidden;
}

.skeleton::after {
    content: "";
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg,
            rgba(255, 255, 255, 0) 0%,
            rgba(255, 255, 255, 0.4) 50%,
            rgba(255, 255, 255, 0) 100%);
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    100% {
        left: 100%;
    }
}

/* Sizes for specific skeleton blocks */
.skeleton-img {
    height: 350px;
}

.skeleton-title {
    height: 32px;
    width: 60%;
}

.skeleton-text {
    height: 16px;
    width: 90%;
}

.skeleton-price {
    height: 20px;
}

.skeleton-btn {
    height: 40px;
    border-radius: 6px;
}
</style>
