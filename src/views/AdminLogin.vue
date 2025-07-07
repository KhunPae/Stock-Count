<template>
  <div
    class="flex justify-center items-center h-screen bg-cover bg-center"
    style="background-image: url('/public/Login.jpg')"
  >
    <div
      class="backdrop-blur-sm md:backdrop-blur-lg p-8 rounded shadow w-full max-w-sm"
    >
      <div class="flex justify-center mb-6">
        <img :src="stockCountLogo" alt="Stock Count Logo" class="brightness-125 w-48 h-auto" />
      </div>
      <h1
        class="font-mali text-2xl font-bold mb-6 text-center bg-white-500 text-blue-800 shadow-lg"
      >
        Admin Login
      </h1>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <div class="relative mb-4">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          class="w-full p-3 pr-10 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span
          @click="showPassword = !showPassword"
          class="absolute right-3 top-3 cursor-pointer text-gray-500 hover:text-gray-700"
        >
          <component
            :is="showPassword ? EyeSlashIcon : EyeIcon"
            class="w-5 h-5"
            :key="showPassword"
          />
        </span>
      </div>

      <button @click="goUserLogin" class="text-blue-600 underline mb-2">
        User Login
      </button>

      <button
        @click="login"
        class="bg-blue-500 text-white px-4 py-2 w-full rounded-full hover:bg-blue-600"
      >
        Login
      </button>
      <p v-if="error" class="text-red-500 mt-2 text-center">{{ error }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import stockCountLogo from "../assets/logo.png";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/24/outline";

const username = ref("");
const password = ref("");
const error = ref("");
const router = useRouter();
const showPassword = ref(false);

function login() {
  if (username.value.trim() === "admin" && password.value === "1234") {
    localStorage.setItem(
      "user",
      JSON.stringify({ username: "admin", name: "ผู้ดูแลระบบ" })
    );
    router.push("/stock");
  } else {
    error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง";
  }
}

function goAdminLogin() {
  router.push("/admin-login");
}

function goUserLogin() {
  router.push("/login");
}
</script>
