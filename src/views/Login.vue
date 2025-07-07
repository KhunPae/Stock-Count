<template>
  <div
    class="flex justify-center items-center h-screen bg-cover bg-center"
    style="background-image: url('/public/Login.jpg')"
  >
    <div
      class="backdrop-blur-sm md:backdrop-blur-lg p-8 rounded shadow w-full max-w-sm"
    >
      <div class="flex justify-center mb-6">
        <img
          :src="stockCountLogo"
          alt="Stock Count Logo"
          class="brightness-125 w-48 h-auto"
        />
      </div>
      <h1
        class="font-mali text-2xl font-bold mb-8 text-center bg-white-500 shadow-lg text-blue-800 rounded-full"
      >
        User Login
      </h1>

      <input
        v-model="username"
        type="text"
        placeholder="Username"
        class="w-full p-3 border border-gray-300 rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <!-- 🔐 ช่องกรอกรหัสผ่าน พร้อมปุ่มดูรหัสผ่าน -->
      <div class="relative mb-4">
        <input
          v-model="password"
          :type="showPassword ? 'text' : 'password'"
          placeholder="Password"
          class="w-full p-3 pr-10 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
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

      <button @click="goAdminLogin" class="text-blue-600 underline mt-2">
        Admin Login
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

// ✅ ดึง users จาก localStorage
const users = ref(
  JSON.parse(localStorage.getItem("users")) || [
    { username: "sunatcha", password: "1234", name: "sunatcha" },
    { username: "asadawut", password: "1234", name: "asadawut" },
  ]
);

// ✅ ถ้ายังไม่มี users ใน storage → เซ็ตไว้
if (!localStorage.getItem("users")) {
  localStorage.setItem("users", JSON.stringify(users.value));
}

function login() {
  // โหลด users ใหม่จาก localStorage ก่อนทุกครั้ง
  users.value = JSON.parse(localStorage.getItem("users")) || [];

  const foundUser = users.value.find(
    (u) => u.username === username.value.trim() && u.password === password.value
  );
  if (foundUser) {
    localStorage.setItem("user", JSON.stringify(foundUser));
    router.push("/stock");
  } else {
    error.value = "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง";
  }
}
function goAdminLogin() {
  router.push("/admin-login");
}
</script>
