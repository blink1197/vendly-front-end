import 'bootstrap-icons/font/bootstrap-icons.min.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'notyf/notyf.min.css';
import './assets/main.css';

import { createPinia } from 'pinia';
import { createApp } from 'vue';
import App from './App.vue';

import CartPage from './pages/CartPage.vue';
import HomePage from './pages/HomePage.vue';
import LoginPage from './pages/LoginPage.vue';
import NotFoundPage from './pages/NotFoundPage.vue';
import OrdersPage from './pages/OrdersPage.vue';
import ProductsPage from './pages/ProductsPage.vue';
import ProfilePage from './pages/ProfilePage.vue';
import RegistrationPage from './pages/RegistrationPage.vue';
import ViewProduct from './pages/ViewProduct.vue';
import GoogleSuccess from './pages/auth/GoogleSuccess.vue';

import { createRouter, createWebHistory } from 'vue-router';
import clickOutside from './directives/clickOutside';


const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: HomePage
        },
        {
            path: '/login',
            name: 'Login',
            component: LoginPage
        },
        {
            path: '/register',
            name: 'Register',
            component: RegistrationPage
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartPage
        },
        {
            path: '/products',
            name: 'Products',
            component: ProductsPage
        },
        {
            path: '/products/:id',
            component: ViewProduct
        },
        {
            path: '/cart',
            name: 'Cart',
            component: CartPage
        },
        {
            path: '/orders',
            name: 'Orders',
            component: OrdersPage
        },
        {
            path: '/profile',
            name: 'Profile',
            component: ProfilePage
        },
        {
            path: '/auth/google-success',
            component: GoogleSuccess
        },
        {
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            component: NotFoundPage
        },
    ]
});



const app = createApp(App)
app.directive('click-outside', clickOutside);
app.use(createPinia())
app.use(router)
app.mount('#app');

