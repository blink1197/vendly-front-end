<script setup>
import { Notyf } from 'notyf';
import { defineEmits, defineProps, ref } from 'vue';
import api from '../api';

const notyf = new Notyf();
const props = defineProps({
    productData: {
        type: Object,
        required: true
    },
    index: {
        type: Number,
        required: true
    }
});

const isArchiving = ref(false)
const isActivating = ref(false)

const emit = defineEmits(['update', 'archive', 'activate']);

function handleUpdate() {
    emit('update', { ...props.productData, index: props.index });
}

async function handleArchive() {
    isArchiving.value = true;
    try {
        await api.patch(`products/${props.productData._id}/archive`);
        notyf.success('Product successsfully archived.')
        isArchiving.value = false;
    } catch (error) {
        console.error('Error archiving product:', error);

        notyf.error('Failed to archive product.')
        isArchiving.value = false;
    } finally {
        isArchiving.value = false;
    }

    emit('archive', { ...props.productData, index: props.index });
}

async function handleActivate() {
    isArchiving.value = true;
    try {
        await api.patch(`products/${props.productData._id}/activate`);
        notyf.success('Product successsfully activated.')
        isArchiving.value = false;
    } catch (error) {
        console.error('Error archiving product:', error);

        notyf.error('Failed to activate product.')
        isArchiving.value = false;
    } finally {
        isArchiving.value = false;
    }
    emit('activate', { ...props.productData, index: props.index });
}
</script>

<template>
    <tr>
        <td>{{ index + 1 }}</td>
        <td class="d-none d-md-table-cell">
            <img :src="productData.imageUrl || 'https://placehold.co/50x50/d7530f/ffffff?font=raleway'" alt="Thumbnail"
                class="img-thumbnail" style="width: 50px; height: 50px; object-fit: cover;" />
        </td>
        <td>{{ productData.name }}</td>
        <td class="d-none d-md-table-cell">
            {{ productData.description.length > 50 ? productData.description.slice(0, 50) + '...' :
                productData.description }}
        </td>

        <!-- 💰 Price column added -->
        <td>
            ₱{{ productData.price?.toLocaleString(undefined, { minimumFractionDigits: 2 }) }}
        </td>

        <td>
            <span class="badge" :class="productData.isActive ? 'bg-success' : 'bg-danger'">
                {{ productData.isActive ? 'Available' : 'Unavailable' }}
            </span>
        </td>
        <td class="text-center">
            <div class="d-flex flex-wrap justify-content-start align-items-center gap-2">
                <button title="Update" class="btn btn-sm btn-primary" @click="handleUpdate">
                    <i class="bi bi-pencil-square"></i>
                    <span class="d-none d-lg-inline ms-1">Update</span>
                </button>

                <button title="Archive" class="btn btn-sm btn-danger" @click="handleArchive" :disabled="isArchiving">
                    <i class="bi bi-archive"></i>
                    <span class="d-none d-lg-inline ms-1">Archive</span>
                </button>

                <button title="Activate" class="btn btn-sm btn-success" @click="handleActivate"
                    :disabled="isActivating">
                    <i class="bi bi-check-circle"></i>
                    <span class="d-none d-lg-inline ms-1">Activate</span>
                </button>
            </div>
        </td>
    </tr>
</template>