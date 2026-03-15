<script setup>
import { useUserStore } from '../../stores/userStore'
defineOptions({
    async beforeRouteEnter(to, from, next) {
        const token = to.query.token
        const userStore = useUserStore()


        if (!token) {
            // If no token in query, redirect immediately
            return next('/login')
        }

        try {
            // Save token to localStorage and userStore
            localStorage.setItem('user', JSON.stringify({ token }))
            await userStore.getUserDetails(token)
            userStore.user.token = token
            localStorage.setItem('user', JSON.stringify(userStore.user))

            // Redirect to home without flicker
            next('/')
        } catch (err) {
            console.error('Error logging in with Google:', err)
            next('/login')
        }
    },
})
</script>

<template>
    <div class="flex items-center justify-center h-screen">
        <p>Signing you in with Google...</p>
    </div>
</template>
