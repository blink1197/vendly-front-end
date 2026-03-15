<script setup>
import { Notyf } from 'notyf';
import { computed, onBeforeMount, reactive, ref } from 'vue';
import api from '../api';
import { formatMoney } from '../utils/string';
import CreateProductModal from './CreateProductModal.vue';
import UpdateProductModal from './UpdateProductModal.vue';

const notyf = new Notyf();
const products = reactive({ data: [] });
const loading = reactive({ state: true });
const searchQuery = ref('');

const updateModal = ref(null);
const createModal = ref(null);

const isArchiving = ref(false);
const isActivating = ref(false);

function openUpdateModal(product) {
	updateModal.value.openModal(product);
}

function openCreateModal() {
	createModal.value.openModal();
}

function updateProduct(updatedData) {
	products.data[updatedData.index] = { ...products.data[updatedData.index], ...updatedData };
}

function createProduct(newProduct) {
	products.data.push(newProduct);
}

async function onArchive(updatedData) {
	isArchiving.value = true;
	try {
		await api.patch(`products/${products.data[updatedData.index]._id}/archive`);
		notyf.success('Product successfully archived.');
		products.data[updatedData.index].isActive = false;
	} catch (error) {
		console.error('Error archiving product:', error);
		notyf.error('Failed to archive product.');
	} finally {
		isArchiving.value = false;
	}
}

async function onActivate(updatedData) {
	isActivating.value = true;
	try {
		await api.patch(`products/${products.data[updatedData.index]._id}/activate`);
		notyf.success('Product successfully activated.');
		products.data[updatedData.index].isActive = true;
	} catch (error) {
		console.error('Error activating product:', error);
		notyf.error('Failed to activate product.');
	} finally {
		isActivating.value = false;
	}
}

onBeforeMount(async () => {
	try {
		const { data } = await api.get('products/all');
		products.data = data;
	} catch (error) {
		console.error('Error fetching products:', error);
	} finally {
		loading.state = false;
	}
});

// Computed filtered list
const filteredProducts = computed(() => {
	const query = searchQuery.value.trim().toLowerCase();
	if (!query) return products.data;
	return products.data.filter((p) => p.name?.toLowerCase().includes(query));
});
</script>

<template>
	<div class="container py-4">
		<div class="d-flex justify-content-between flex-wrap mb-4 flex-column flex-sm-row align-items-start">
			<h1 class="h4 fw-bold text-dark mb-2">Product Management</h1>
			<button class="btn btn-primary mb-2 mt-2 mt-md-0" @click="openCreateModal">
				<i class="bi bi-plus-lg me-1"></i> Add Product
			</button>
		</div>

		<!-- Search Input -->
		<div class="mb-3">
			<input v-model="searchQuery" type="text" class="form-control" placeholder="Search products by name..." />
		</div>

		<!-- Loading -->
		<div v-if="loading.state" class="text-center py-5">
			<div class="spinner-border text-primary" role="status">
				<span class="visually-hidden">Loading...</span>
			</div>
			<p class="mt-3 text-muted">Loading products...</p>
		</div>

		<!-- Empty -->
		<div v-else-if="!filteredProducts.length" class="text-center py-5">
			<img src="../assets/images/empty-box.png" alt="No products" width="120" class="mb-3 opacity-75" />
			<p class="text-muted fs-5">No products found</p>
		</div>

		<!-- Table layout for large screens -->
		<div v-else class="d-none d-md-block">
			<div class="card shadow-sm border-0">
				<div class="card-header bg-white fw-semibold fs-6">Product List</div>

				<div class="table-responsive card-body">
					<table class="table align-middle mb-0">
						<thead class="table-light">
							<tr>
								<th>#</th>
								<th>Thumbnail</th>
								<th>Name</th>
								<th>Description</th>
								<th>Price</th>
								<th>Status</th>
								<th class="text-center">Actions</th>
							</tr>
						</thead>
						<tbody>
							<tr v-for="(product, index) in filteredProducts" :key="product._id" class="align-middle">
								<td>{{ index + 1 }}</td>
								<td>
									<img :src="product.imageUrl || '../assets/images/no-image.png'" alt="thumbnail"
										class="rounded" style="width: 50px; height: 50px; object-fit: cover;" />
								</td>
								<td class="fw-semibold">
									<router-link :to="{ path: `/products/${product._id}` }" target="_blank">
										<i class="bi bi-box-arrow-up-right" title="View Product"></i>
									</router-link>
									{{ product.name }}
								</td>
								<td class="text-muted text-truncate" style="max-width: 180px;">
									{{ product.description }}
								</td>
								<td class="fw-semibold text-success">{{ formatMoney(product.price) }}</td>
								<td class="status-data">
									<span class="badge" :class="product.isActive
										? 'bg-success bg-opacity-25 text-success'
										: 'bg-secondary bg-opacity-25 text-secondary'
										">
										{{ product.isActive ? 'Active' : 'Archived' }}
									</span>
								</td>
								<td class="text-center">
									<div class="btn-group">
										<button class="btn btn-sm btn-outline-primary" @click="openUpdateModal(product)"
											title="Update">
											<i class="bi bi-pencil"></i>
										</button>
										<button v-if="product.isActive" class="btn btn-sm btn-outline-danger"
											@click="onArchive({ index })" title="Disable">
											<i class="bi bi-archive"></i>
										</button>
										<button v-else class="btn btn-sm btn-outline-success"
											@click="onActivate({ index })" title="Activate">
											<i class="bi bi-arrow-clockwise"></i>
										</button>
									</div>
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</div>

		<!-- Card layout for mobile -->
		<div v-if="!loading.state && filteredProducts.length" class="row row-cols-1 row-cols-sm-2 g-3 d-md-none">
			<div v-for="(product, index) in filteredProducts" :key="product._id" class="col">
				<div class="card border-0 shadow-sm h-100">
					<img :src="product.imageUrl || '../assets/images/no-image.png'" class="card-img-top"
						alt="Product Image" style="height: 160px; object-fit: cover;" />
					<div class="card-body">
						<h6 class="fw-bold mb-1">
							<router-link :to="{ path: `/products/${product._id}` }" target="_blank">
								<i class="bi bi-box-arrow-up-right" title="View Product"></i>
							</router-link>
							{{ product.name }}
						</h6>
						<p class="text-muted small mb-2">{{ product.description }}</p>
						<p class="fw-semibold text-success mb-2">{{ formatMoney(product.price) }}</p>
						<span class="badge" :class="product.isActive
							? 'bg-success bg-opacity-25 text-success'
							: 'bg-secondary bg-opacity-25 text-secondary'
							">
							{{ product.isActive ? 'Active' : 'Archived' }}
						</span>
					</div>
					<div class="card-footer bg-transparent border-0 pt-0">
						<div class="d-flex justify-content-between">
							<button class="btn btn-sm btn-outline-primary w-100 me-1" @click="openUpdateModal(product)">
								<i class="bi bi-pencil"></i>
							</button>
							<button v-if="product.isActive" class="btn btn-sm btn-outline-danger w-100 ms-1"
								@click="onArchive({ index })">
								<i class="bi bi-archive"></i>
							</button>
							<button v-else class="btn btn-sm btn-outline-success w-100 ms-1"
								@click="onActivate({ index })">
								<i class="bi bi-arrow-clockwise"></i>
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>

		<!-- Modals -->
		<CreateProductModal ref="createModal" @create="createProduct" />
		<UpdateProductModal ref="updateModal" @update="updateProduct" />
	</div>
</template>

<style scoped>
.status-data {
	max-width: 60px !important;
}

.text-muted {
	color: #6c757d !important;
}

.opacity-75 {
	opacity: 0.75;
}
</style>
