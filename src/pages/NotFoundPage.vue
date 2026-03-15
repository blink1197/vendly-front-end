<template>
    <div class="bg-light min-vh-100 d-flex align-items-center page-container">
        <div class="container d-flex w-100 h-100 p-3 mx-auto flex-column">
            <main class="px-3 text-center">
                <h1 class="title-text">404 Not Found</h1>
                <p class="lead">The page you are looking for is not found.</p>
                <p class="lead"> <router-link :to="{ name: 'Home' }"
                        class="btn btn-lg btn-light fw-bold border-white bg-white">Back to Home</router-link></p>
            </main>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    margin-top: -200px;
}

.title-text {
    color: var(--color-primary)
}
</style>