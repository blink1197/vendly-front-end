<template>
    <div class="modal fade" tabindex="-1" ref="modalRef" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 shadow-lg rounded-4">
                <div class="modal-body text-center py-4">
                    <div class="text-success mb-3">
                        <i class="bi bi-check-circle-fill fs-1"></i>
                    </div>
                    <h5 class="fw-bold mb-2">{{ title }}</h5>
                    <p class="text-muted mb-4">{{ message }}</p>
                    <button type="button" class="btn btn-success px-4" @click="handleClose">
                        {{ buttonText }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { Modal } from "bootstrap";
import { onMounted, ref } from "vue";

const props = defineProps({
    title: {
        type: String,
        default: "Success!",
    },
    message: {
        type: String,
        default: "Your action was completed successfully.",
    },
    buttonText: {
        type: String,
        default: "OK",
    },
});

const emit = defineEmits(["closed"]);

const modalRef = ref(null);
let modalInstance = null;

onMounted(() => {
    modalInstance = new Modal(modalRef.value);
});

function openModal() {
    modalInstance.show();
}

function closeModal() {
    modalInstance.hide();
}

function handleClose() {
    closeModal();
    emit("closed");
}

defineExpose({ openModal, closeModal });
</script>

<style scoped>
.modal-content {
    animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(0.95);
    }

    to {
        opacity: 1;
        transform: scale(1);
    }
}
</style>
