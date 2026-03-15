<template>
    <nav class="container px-0" v-click-outside="handleClickOutside">
        <div class="navbar navbar-expand-md navbar-light bg-white">
            <div class="container-fluid">
                <!-- Brand -->
                <router-link class="navbar-brand" to="/">
                    <img class="img-fluid" src="../assets/images/logo-vendly.png" alt="Flyx Logo" height="44" />
                </router-link>

                <!-- Toggle (visible on small screens) -->
                <button class="navbar-toggler" type="button" @click="toggleNavbar" aria-controls="navbarNavAltMarkup"
                    :aria-expanded="visible.toString()" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>

                <!-- Collapsible nav with smooth transition -->
                <div ref="menu" class="navbar-collapse" :class="{ show: visible }" :style="collapseStyle"
                    id="navbarNavAltMarkup">
                    <div class="navbar-nav ms-auto">
                        <router-link :to="{ name: 'Home' }" class="nav-link">Home</router-link>
                        <router-link :to="{ name: 'Products' }" class="nav-link">Products</router-link>
                        <router-link :to="{ name: 'Cart' }" class="nav-link" v-if="user.email && !user.isAdmin">My
                            Cart</router-link>
                        <router-link :to="{ name: 'Orders' }" class="nav-link" v-if="user.email && !user.isAdmin">My
                            Orders</router-link>
                        <router-link :to="{ name: 'Register' }" class="nav-link"
                            v-if="!user.email">Register</router-link>
                        <router-link :to="{ name: 'Login' }" class="nav-link" v-if="!user.email">Login</router-link>
                        <router-link :to="{ name: 'Profile' }" class="nav-link" v-if="user.email">Profile</router-link>
                        <button v-if="user.email" class="btn btn-link nav-link text-danger text-start" @click="logout">
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </nav>
</template>

<script setup>
import { computed, nextTick, ref } from 'vue';
import { useUserStore } from '../stores/userStore';

const { user, logout } = useUserStore();

const visible = ref(false)
const menu = ref(null)
const menuHeight = ref('0px')

// Smoothly toggle height on small screens
function toggleNavbar() {
    visible.value = !visible.value
    nextTick(() => {
        if (visible.value) {
            menuHeight.value = menu.value.scrollHeight + 'px'
        } else {
            menuHeight.value = '0px'
        }
    })
}

// Collapse when clicking outside
function handleClickOutside() {
    if (visible.value && window.innerWidth < 768) {
        visible.value = false
        menuHeight.value = '0px'
    }
}

// Let Bootstrap handle open state for md+ screens
const collapseStyle = computed(() => {
    return window.innerWidth >= 768
        ? { height: 'auto' }
        : { height: menuHeight.value, overflow: 'hidden', transition: 'height 0.3s ease' }
})
</script>

<style scoped>
nav .nav-link {
    color: var(--color-gray-3) !important;
    transition: color 0.3s ease;
}

nav .nav-link:hover {
    color: var(--color-primary) !important;
}

/* Smooth height animation */
.navbar-collapse {
    overflow: hidden;
    transition: height 0.3s ease;
}

img {
    height: 40px;
}

/* Ensure auto height for md+ */
@media (min-width: 768px) {
    .navbar-collapse {
        height: auto !important;
        overflow: visible !important;
        transition: none !important;
    }
}
</style>


<!-- <script setup>
import { ref } from 'vue';
import { useUserStore } from '../stores/userStore';

const { user, logout } = useUserStore();
const isMenuOpen = ref(false);

</script>

<style scoped>

</style> -->
