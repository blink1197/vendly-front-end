<script setup>
import { Notyf } from "notyf";
import { computed, onBeforeMount, ref } from "vue";
import { useRouter } from "vue-router";
import api from "../api";
import ConfirmationModal from "../components/ui/ConfirmationModal.vue";
import SuccessModal from "../components/ui/SuccessModal.vue";
import { useUserStore } from "../stores/userStore";
import { formatMoney } from "../utils/string";

const router = useRouter();
const { isLoggedIn } = useUserStore();
const confirmModal = ref(null);
const confirmClearModal = ref(null);
const confirmCheckoutModal = ref(null);
const successModal = ref(null);
const selectedItem = ref(null);
const selectedIndex = ref(null);



function handleSuccessClose() {
    router.push({ name: 'Orders' });
}

function showConfirmCheckout() {
    confirmCheckoutModal.value.openModal();
}

async function handleConfirmCheckout() {
    isCheckingOut.value = true;
    try {
        await api.post('orders/checkout');
        isCheckingOut.value = false;
        cartItems.value = [];
        successModal.value.openModal();
    } catch (error) {
        console.error('Error updating quantity:', error);
        notyf.error('Failed to update quantity.')
        isCheckingOut.value = false;
    } finally {
        isCheckingOut.value = false;
    }
}


function showConfirm(item, index) {
    selectedItem.value = item;
    selectedIndex.value = index;
    confirmModal.value.openModal();
}

function showConfirmClear() {
    confirmClearModal.value.openModal();
}

async function handleConfirm() {
    if (selectedItem.value && selectedIndex.value !== null) {
        await removeItem(selectedItem.value, selectedIndex.value);
        selectedItem.value = null;
        selectedIndex.value = null;
    }
}

async function handleConfirmClear() {
    await clearCart();
}

const notyf = new Notyf();
const loading = ref(true);
const cartItems = ref([]);
const isClearing = ref(false);
const isRemoving = ref(false);
const isUpdating = ref(false);
const isCheckingOut = ref(false);

// Computed Total
const cartTotal = computed(() => {
    if (!cartItems.value) return 0
    return cartItems.value.reduce((sum, item) => sum + item.productId.price * item.quantity, 0)
}

);

// Quantity Control
const updateQty = async (item, change) => {
    const newQty = item.quantity + change;
    if (newQty >= 1) item.quantity = newQty;

    const quantityUpdate = {
        productId: item.productId._id,
        newQuantity: item.quantity
    }

    isUpdating.value = true;
    try {
        await api.patch(`cart/update-cart-quantity`, quantityUpdate);
        notyf.success('Quantity successsfully updated.')
    } catch (error) {
        console.error('Error updating quantity:', error);
        notyf.error('Failed to update quantity.')
    } finally {
        isUpdating.value = false;
    }
};

// Remove from cart
const removeItem = async (item, index) => {
    isRemoving.value = true;
    try {
        await api.patch(`cart/${item.productId._id}/remove-from-cart`);
        notyf.success('Item successsfully removed from cart.')
        cartItems.value.splice(index, 1)
    } catch (error) {
        console.error('Error removing item:', error);
        notyf.error('Failed to remove item.')
    } finally {
        isRemoving.value = false;
    }
};

// Clear Cart
const clearCart = async () => {
    isClearing.value = true;
    try {
        await api.put(`cart/clear-cart`);
        notyf.success('Cart successsfully cleared.')
        cartItems.value = [];
    } catch (error) {
        console.error('Error clearing cart:', error);
        notyf.error('Failed to clear cart.')
    } finally {
        isClearing.value = false;
    }
};

onBeforeMount(async () => {
    if (!isLoggedIn) router.push({ name: 'Home' })

    try {
        const { data } = await api.get(`cart/get-cart`);
        cartItems.value = data.cartItems || [];
    } catch (err) {
        console.error('Error cart items:', err);
    } finally {
        loading.value = false;
    }
});


</script>
<template>
    <div class="container main-content mt-5">
        <h2 class="mb-4">Your Bag Basket</h2>

        <!-- Top Buttons -->
        <div class="d-flex justify-content-between align-items-center mb-4 flex-wrap">
            <router-link class="btn browse-btn mb-2 mb-md-0 me-3" :to="{ name: 'Products' }">
                Browse Products
            </router-link>
            <button class="btn btn-danger mb-2 mb-md-0" @click="showConfirmClear" :disabled="isClearing"
                v-if="cartItems.length">
                {{ isClearing ? 'Clearing' : 'Clear Cart' }}
            </button>
        </div>

        <!-- Main Card -->
        <div class="card shadow-sm border-0 mx-auto" style="max-width: 900px;">
            <div class="card-header bg-white fw-bold fs-5">Added items</div>

            <!-- Loading State -->
            <div v-if="loading" class="text-center py-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-3 text-muted">Loading your cart...</p>
            </div>

            <!-- Empty Cart -->
            <div v-else-if="!cartItems.length" class="text-center py-5">
                <img src="../assets/images/empty-box.png" alt="No items" width="120" class="mb-3 opacity-75" />
                <p class="text-muted mb-3 fs-5">Your bag is empty</p>
            </div>

            <!-- Cart Items (Card List) -->
            <div v-else class="p-3">
                <div v-for="(item, index) in cartItems" :key="item._id" class="card mb-3 border-0 shadow-sm rounded-4">
                    <div class="card-body d-flex flex-wrap align-items-center justify-content-between">
                        <!-- Product Info -->
                        <div class="d-flex align-items-center flex-grow-1 me-3">
                            <img :src="item.productId?.imageUrl || 'https://placehold.co/80x80/d7530f/ffffff?font=raleway'"
                                alt="Product" width="80" height="80" class="rounded me-3" style="object-fit: cover;" />
                            <div>
                                <h6 class="fw-bold mb-1">{{ item.productId?.name }}</h6>
                                <p class="text-muted small mb-1">
                                    {{ item.productId?.description?.length > 50
                                        ? item.productId.description.slice(0, 50) + '...'
                                        : item.productId?.description }}
                                </p>
                                <div class="fw-semibold text-primary small">
                                    {{ formatMoney(item.productId?.price) }}
                                </div>
                            </div>
                        </div>

                        <!-- Quantity Controls -->
                        <div class="d-flex align-items-center mb-2 mb-md-0 me-4">
                            <button :disabled="isUpdating || item.quantity === 1"
                                class="btn btn-outline-secondary btn-sm" @click="updateQty(item, -1)">
                                -
                            </button>
                            <input type="text" v-model="item.quantity"
                                class="form-control form-control-sm text-center mx-2" style="width: 50px" readonly />
                            <button :disabled="isUpdating" class="btn btn-outline-secondary btn-sm"
                                @click="updateQty(item, 1)">
                                +
                            </button>
                        </div>

                        <!-- Subtotal + Remove -->
                        <div class="text-end">
                            <div class="fw-bold text-success">{{ formatMoney(item.productId.price * item.quantity) }}
                            </div>
                            <button title="Remove" class="btn btn-sm btn-outline-danger mt-2"
                                @click="showConfirm(item, index)" :disabled="isRemoving">
                                <i class="bi bi-trash me-1"></i> Remove
                            </button>
                        </div>
                    </div>
                </div>

                <!-- Summary Section -->
                <div class="border-top pt-3 mt-3 d-flex justify-content-between align-items-center">
                    <h5 class="mb-0 fw-bold">Total: {{ formatMoney(cartTotal) }}</h5>
                    <button class="btn btn-success" @click="showConfirmCheckout" :disabled="isCheckingOut">
                        {{ isCheckingOut ? 'Checking out...' : 'Checkout' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Modals -->
        <SuccessModal ref="successModal" title="Order Placed!" message="Your order has been successfully created."
            buttonText="Go to Orders" @closed="handleSuccessClose" />

        <ConfirmationModal ref="confirmCheckoutModal" title="Ready to checkout?"
            text="Make sure your cart items and quantities are correct before continuing." buttonText="Yes, Continue"
            @confirm="handleConfirmCheckout" />

        <ConfirmationModal ref="confirmModal" title="Remove Item"
            text="Are you sure you want to remove this item? This action cannot be undone." buttonText="Yes, Remove"
            @confirm="handleConfirm" />

        <ConfirmationModal ref="confirmClearModal" title="Clear Cart"
            text="Are you sure you want to clear your cart? This action cannot be undone." buttonText="Yes, Clear it"
            @confirm="handleConfirmClear" />
    </div>
</template>


<style scoped>
.card {
    transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
}

.main-content {
    padding-bottom: 4rem;
    max-width: 900px;
}

.cart-item-list,
.cart-list {
    max-width: 900px;
    margin: 0 auto;
}

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
</style>
