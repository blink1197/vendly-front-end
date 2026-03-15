<template>
    <div class="d-inline-flex align-items-center gap-2">
        <button type="button" class="btn btn-outline-secondary btn-sm" @click="decreaseQuantity"
            :disabled="modelValue <= min">
            -
        </button>

        <input type="number" class="form-control text-center" style="width: 60px;" :value="modelValue"
            @input="updateValue($event.target.value)" min="min" max="max" readonly />

        <button type="button" class="btn btn-outline-secondary btn-sm" @click="increaseQuantity"
            :disabled="modelValue >= max">
            +
        </button>
    </div>
</template>

<script setup>
import { defineEmits, defineProps } from 'vue';

const props = defineProps({
    modelValue: {
        type: Number,
        required: true,
    },
    min: {
        type: Number,
        default: 1,
    },
    max: {
        type: Number,
        default: 99,
    },
});

const emit = defineEmits(['update:modelValue']);

function increaseQuantity() {
    if (props.modelValue < props.max) {
        emit('update:modelValue', props.modelValue + 1);
    }
}

function decreaseQuantity() {
    if (props.modelValue > props.min) {
        emit('update:modelValue', props.modelValue - 1);
    }
}

function updateValue(value) {
    const num = Number(value);
    if (!isNaN(num) && num >= props.min && num <= props.max) {
        emit('update:modelValue', num);
    }
}
</script>

<style scoped>
button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* Chrome, Safari, Edge, Opera */
s input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
}

.btn-outline-secondary {
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
