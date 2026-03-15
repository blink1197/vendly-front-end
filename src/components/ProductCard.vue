<template>
    <div class="col-12 col-md-6 col-lg-4 my-3">
        <div class="card p-2 cardHighlights shadow-sm position-relative" style="min-height: 100%">

            <!-- HOT badge -->
            <span v-if="productData.isTopProduct" class="badge-hot"><i class="bi bi-fire"></i> Hot</span>

            <img class="card-img-top product-image"
                :src="productData.imageUrl || `https://placehold.co/600x400/d7530f/ffffff?font=raleway&text=${encodeURIComponent(productData.name)}`"
                :alt="productData.name">

            <div class="card-body d-flex flex-column justify-content-between">
                <div>
                    <h4 class="card-title fw-bold mb-2">
                        {{ productData.name }}
                    </h4>
                    <p class="card-text text-muted mb-2">
                        {{ productData.description.slice(0, 100) + (productData.description.length > 100 ? '...' : '')
                        }}
                    </p>
                    <p class="mb-1">
                        <span class="fw-semibold">Price:</span> PHP {{ productData.price }}
                    </p>
                </div>

                <router-link class="btn btn-outline-primary d-block mt-3"
                    :to="{ path: `/products/${productData._id}` }">View Product</router-link>
            </div>
        </div>
    </div>
</template>

<script>
import { useUserStore } from '../stores/userStore.js';

export default {
    props: {
        productData: Object
    },
    setup() {
        const { user } = useUserStore();
        return { user };
    }
}
</script>

<style scoped>
.product-image {
    width: 100%;
    /* make it full card width */
    height: auto;
    /* let height adjust automatically */
    max-height: 300px;
    /* optional: limit max height */
    object-fit: cover;
    /* cover the area without distortion */
    border-radius: 0.25rem;
    /* optional: match card border radius */
    display: block;
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

/* HOT badge styling */
.badge-hot {
    position: absolute;
    top: 10px;
    right: 10px;
    background-color: var(--color-primary);
    color: white;
    font-weight: bold;
    padding: 0.3rem 0.6rem;
    border-radius: 0.3rem;
    font-size: 0.8rem;
    z-index: 10;
}
</style>
