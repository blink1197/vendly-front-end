<script setup>
import { upload } from '@imagekit/vue';
import { ref, watch } from 'vue';
import api from '../api';

const props = defineProps({
    existingImageUrl: {
        type: String,
        default: ''
    }
})

const emit = defineEmits(['uploaded'])

const fileInput = ref(null)
const preview = ref(props.existingImageUrl)
const progress = ref(0)
const loading = ref(false)
const error = ref('')

function triggerFileSelect() {
    fileInput.value?.click()
}

async function getAuthParams() {
    const res = await api.get('imagekit/auth')
    return res.data
}

async function onFileSelected(e) {
    const file = e.target.files?.[0]
    if (!file) return

    preview.value = URL.createObjectURL(file)
    loading.value = true
    progress.value = 0
    error.value = ''

    try {
        const auth = await getAuthParams()
        const resp = await upload({
            ...auth,
            file,
            fileName: file.name,
            folder: 'images/vendly',
            publicKey: 'public_kQQO7pdQ1fOf3B3vEKCd3FJXxzI=',
            onProgress: e => (progress.value = Math.round((e.loaded / e.total) * 100)),
        })
        emit('uploaded', resp.url)
    } catch (err) {
        console.error(err)
        error.value = 'Upload failed. Please try again.'
    } finally {
        loading.value = false
    }
}

function reset() {
    preview.value = ''
    progress.value = 0
    error.value = ''
    fileInput.value.value = ''
}

watch(
    () => props.existingImageUrl,
    (newVal) => {
        preview.value = newVal || ''
    }
)

// Expose so parent can call it
defineExpose({ reset })
</script>

<template>
    <div class="d-flex flex-column align-items-center gap-3">
        <input ref="fileInput" type="file" accept="image/*" class="d-none" @change="onFileSelected" />

        <div class="position-relative w-100" style="max-width: 300px;">
            <img :src="preview || 'https://placehold.co/300x200/d7530f/ffffff?text=Upload+image'"
                class="img-fluid rounded border image" alt="Preview" />

            <button type="button" @click="triggerFileSelect" :disabled="loading"
                class="btn btn-sm btn-primary position-absolute bottom-0 end-0 m-2">
                {{ loading
                    ? 'Uploading...'
                    : props.existingImageUrl
                        ? 'Change'
                        : 'Upload'
                }}
            </button>
        </div>

        <div class="w-100" v-if="progress > 0 && progress < 100">
            <div class="progress">
                <div class="progress-bar" role="progressbar" :style="{ width: progress + '%' }"
                    :aria-valuenow="progress" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        </div>

        <small v-if="error" class="text-danger">{{ error }}</small>
    </div>
</template>
<style scoped>
.image {
    min-width: 300px;
}
</style>