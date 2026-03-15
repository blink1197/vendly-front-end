<template>
  <div class="container-fluid p-0 vh-100" style="background: linear-gradient(180deg, #fffdf8 0%, #fff8f0 100%);">
    <!-- Main Section -->
    <section class="container pt-5 h-100">
      <div class="row align-items-center">
        <!-- Left Column: Logo, tagline, button -->
        <div class="col-12 col-md-6 d-flex flex-column align-items-center text-center">
          <!-- Logo -->
          <div class="mb-4">
            <img src="../assets/images/vendly.png" alt="Vendly logo" class="img-fluid"
              style="width:420px; max-width:100%; filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.15));" />
          </div>

          <!-- Tagline (Highlighted) -->
          <blockquote class="blockquote">
            <p class="mb-4 fw-semibold" style="font-size:1.3rem; line-height:1.8; max-width:600px; color:#4a4a4a;">
              "Discover
              <span style='color:#d35400;'>timeless sophistication</span>
              with our collection of
              <span style='color:#d35400;'>luxury bags</span> — expertly crafted
              for men and women who value
              <span style='color:#d35400;'>elegance</span>
              in every detail."
            </p>
          </blockquote>

          <!-- CTA Button (Centered) -->
          <div class="d-flex justify-content-center w-100">
            <router-link type="button" class="btn text-white px-5 py-3 fw-semibold shadow-sm"
              style="background-color:#d35400; border:none; border-radius:50px; font-size:1.1rem; transition:all .3s;"
              :to="{ name: 'Products' }">View Products
            </router-link>
          </div>
        </div>

        <!-- Right Column: Bag image -->
        <div class="col-12 col-md-6 d-flex justify-content-center mt-5 mt-md-0">
          <div class="card border-0 bg-transparent" style="max-width:540px;">
            <img src="../assets/images/bag.jpg" alt="Luxury leather bag" class="img-fluid rounded shadow-lg"
              style="border:4px solid #fff; border-radius:20px;" />
          </div>
        </div>
      </div>
    </section>

    <!-- Bottom Accent Bar -->
    <div style="background-color:#d35400; height:60px; width:100%; box-shadow:0 -3px 10px rgba(0,0,0,0.1);"></div>
  </div>
</template>

<style scoped></style>
