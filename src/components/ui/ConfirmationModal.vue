<template>
    <div class="modal fade" tabindex="-1" ref="modalElement" aria-labelledby="confirmModalLabel" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content border-0 rounded-3 shadow">
                <div class="modal-header border-0">
                    <h5 class="modal-title" id="confirmModalLabel">{{ title }}</h5>
                    <button type="button" class="btn-close" @click="closeModal"></button>
                </div>
                <div class="modal-body">
                    <p class="mb-0">{{ text }}</p>
                </div>
                <div class="modal-footer border-0">
                    <button type="button" class="btn btn-secondary" @click="closeModal">
                        Cancel
                    </button>
                    <button type="button" class="btn btn-primary" @click="confirmAction">
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
    title: { type: String, default: "Confirm Action" },
    text: { type: String, default: "Are you sure you want to continue?" },
    buttonText: { type: String, default: "Confirm" },
});

const emit = defineEmits(["confirm", "cancel"]);

const modalElement = ref(null);
let modalInstance = null;

onMounted(() => {
    modalInstance = new Modal(modalElement.value);
});

function openModal() {
    modalInstance.show();
}

function closeModal() {
    modalInstance.hide();
    emit("cancel");
}

function confirmAction() {
    emit("confirm");
    modalInstance.hide();
}

defineExpose({ openModal, closeModal });
</script>

<style scoped>
.modal-content {
    transition: transform 0.2s ease, opacity 0.2s ease;
}
</style>
