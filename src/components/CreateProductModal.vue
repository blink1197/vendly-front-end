<script setup>
import { Modal } from "bootstrap";
import { Notyf } from "notyf";
import { computed, ref } from "vue";
import api from "../api";
import ProductImageUploader from "./ProductImageUploader.vue";

const notyf = new Notyf();
const modalElement = ref(null);
let modalInstance = null;
const isLoading = ref(false);
const createProduct = ref(null);
const uploaderRef = ref(null);

const form = ref({
    name: "",
    description: "",
    price: 0,
    imageUrl: "",
});

const isFormValid = computed(() => {
    return (
        form.value.name.trim() !== "" &&
        form.value.description.trim() !== "" &&
        form.value.price > 0
    );
});

const emit = defineEmits(["create"]);

function openModal() {
    modalInstance = new Modal(modalElement.value);
    modalInstance.show();
}

function closeModal() {
    modalInstance?.hide();
}

async function handleSubmit() {
    if (!isFormValid.value) {
        notyf.error("Please fill out all fields before submitting.");
        return;
    }


    isLoading.value = true;
    try {
        const { data } = await api.post('products', { ...form.value });
        createProduct.value = data;
        notyf.success('Product successfully created.');

        emit("create", createProduct.value);

        closeModal();

        // Reset form
        form.value = { name: "", description: "", price: 0, imageUrl: "" };

        // Reset image uploader
        uploaderRef.value?.reset();


    } catch (error) {
        console.error('Error creating product:', error);
        notyf.error('Failed to create product.');
    } finally {
        isLoading.value = false;
    }
}

defineExpose({ openModal, closeModal });
</script>

<template>
    <div class="modal fade" ref="modalElement" id="updateProductModal" tabindex="-1"
        aria-labelledby="updateProductModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header bg-light">
                    <h5 class="modal-title" id="updateProductModalLabel">Create New Product</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>

                <form @submit.prevent="handleSubmit">
                    <div class="modal-body">
                        <div class="d-flex gap-2 flex-column mb-3">
                            <ProductImageUploader ref="uploaderRef" @uploaded="url => form.imageUrl = url" />
                        </div>

                        <div class="mb-3">
                            <label for="name" class="form-label">Product Name</label>
                            <input v-model="form.name" type="text" class="form-control" id="name"
                                placeholder="Enter product name" required />
                        </div>

                        <div class="mb-3">
                            <label for="description" class="form-label">Description</label>
                            <textarea v-model="form.description" class="form-control" id="description" rows="3"
                                placeholder="Enter product description" required></textarea>
                        </div>

                        <div class="mb-3">
                            <label for="price" class="form-label">Price</label>
                            <input v-model.number="form.price" type="number" class="form-control" id="price"
                                placeholder="Enter price" min="0" step="0.01" required />
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                        <button type="submit" class="btn btn-primary" :disabled="isLoading || !isFormValid">
                            {{ isLoading ? 'Creating...' : 'Create Product' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>
