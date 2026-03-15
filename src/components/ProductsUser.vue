<script setup>
import { computed, onBeforeMount, reactive, ref, watch } from 'vue';
import api from '../api';
import ProductCard from '../components/ProductCard.vue';

const products = reactive({ data: [] });
const loading = reactive({ state: true });
const searchQuery = ref('');
const searchedProducts = reactive({ data: [] }); // for filtered results
const hasSearched = ref(false); // track if a search has been made

// Helper to merge top products into the main products array
function mergeAndSortProducts(allProducts, topProducts) {
  const topIds = new Set(topProducts.map(p => p.productId));

  const merged = allProducts.map(p => ({
    ...p,
    isTopProduct: topIds.has(p._id),
  }));

  merged.sort((a, b) => {
    if (a.isTopProduct && !b.isTopProduct) return -1;
    if (!a.isTopProduct && b.isTopProduct) return 1;
    return 0;
  });

  return merged;
}

// Initial fetch (all + top products)
async function fetchAllProducts() {
  try {
    loading.state = true;
    const [allProductsRes, topProductsRes] = await Promise.all([
      api.get('products/active'),
      api.get('products/hot'),
    ]);

    const allProducts = allProductsRes.data;
    const topProducts = topProductsRes.data.topProducts || [];

    products.data = mergeAndSortProducts(allProducts, topProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
  } finally {
    loading.state = false;
  }
}

onBeforeMount(fetchAllProducts);

// Watch for clearing the search input
watch(searchQuery, async (newVal) => {
  if (newVal.trim() === '') {
    hasSearched.value = false;
    searchedProducts.data = [];
    await fetchAllProducts();
  }
});

// Triggered when user clicks the search button
async function handleSearch() {
  const query = searchQuery.value.trim().toLowerCase();
  hasSearched.value = true;

  // if search box empty -> show all again
  if (!query) {
    searchedProducts.data = [];
    hasSearched.value = false;
    await fetchAllProducts();
    return;
  }

  // Local filtering
  const localMatches = products.data.filter(product =>
    product.name.toLowerCase().includes(query)
  );

  // if found locally
  if (localMatches.length > 0) {
    searchedProducts.data = localMatches;
    return;
  }

  // else fetch from API
  try {
    loading.state = true;
    const response = await api.post(`/products/search-by-name`, { name: searchQuery.value });
    const remoteResults = response.data.products || [];
    searchedProducts.data = remoteResults;
  } catch (error) {
    console.error('Error searching products by name:', error);
    searchedProducts.data = [];
  } finally {
    loading.state = false;
  }
}

// What to render (all products or searched)
const displayedProducts = computed(() => {
  if (!hasSearched.value) return products.data;
  return searchedProducts.data;
});

</script>

<template>
  <div class="container">
    <!-- Header -->
    <div class="row">
      <div class="col my-5 text-center">
        <h1 class="text-primary py-1 product-title">Products Offered</h1>
        <p class="tagline">Made to Move With You!</p>
      </div>
    </div>

    <!-- Search Bar -->
    <div class="row mb-4 align-items-center justify-content-center">
      <div class="col-md-6 d-flex">
        <input v-model="searchQuery" type="text" class="form-control form-control-lg text-center"
          placeholder="Search a product ..." />
        <button class="btn btn-outline-primary ms-2 px-4" @click="handleSearch">Search</button>
      </div>
    </div>

    <!-- Loading Skeleton -->
    <div v-if="loading.state" class="row g-4 mt-3">
      <div v-for="n in 6" :key="n" class="col-12 col-md-4">
        <div class="card shadow-sm p-3 border-0 placeholder-card">
          <div class="placeholder-img mb-3"></div>
          <div class="placeholder-line w-75 mb-2"></div>
          <div class="placeholder-line w-50"></div>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <Transition name="fade-slide" mode="out-in">
      <div v-if="!loading.state && displayedProducts.length === 0" key="empty-state" class="text-center py-5">
        <img src="../assets/images/empty-box.png" alt="No products" width="120" class="mb-3" />
        <h5 class="text-muted" v-if="searchQuery">
          No products found for "{{ searchQuery }}"
        </h5>
        <h5 class="text-muted" v-else>
          No products available at the moment.
        </h5>
      </div>

      <!-- Product Grid -->
      <TransitionGroup v-else key="product-list" name="fade-slide" tag="div" class="row g-4 mt-3">
        <ProductCard v-for="product in displayedProducts" :key="product._id" :productData="product" />
      </TransitionGroup>
    </Transition>
  </div>
</template>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Playfair+Display:ital,wght@1,500&display=swap");

.text-primary {
  color: var(--color-primary) !important;
}

/* Heading Font Style */
.product-title {
  font-family: "Montserrat", sans-serif;
  font-weight: 700;
  font-size: 2.8rem;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* Tagline Font Style */
.tagline {
  font-family: "Playfair Display", serif;
  font-style: italic;
  font-size: 1.4rem;
  color: #555;
  margin-top: 0.5rem;
}

input.form-control {
  border-radius: 2rem;
  padding: 0.75rem 1.25rem;
}

/* Transition Animations */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.4s ease;
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(15px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Loading placeholders */
.placeholder-card {
  height: 100%;
  background: #fff;
  border-radius: 1rem;
}

.placeholder-img {
  width: 100%;
  height: 180px;
  border-radius: 0.75rem;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
}

.placeholder-line {
  height: 16px;
  border-radius: 8px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e5e5e5 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite;
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
  border-radius: 2rem !important;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
