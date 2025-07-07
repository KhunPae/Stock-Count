<template>
  <div class="flex justify-between items-center mb-6 p-6 bg-white shadow">
    <div class="font-mali text-xl font-semibold text-black">
      👋 สวัสดีคุณ {{ user?.name || user?.username || "" }}
    </div>

    <div class="flex gap-2 items-center">
      <!-- ปุ่มไปหน้าขายสินค้า -->
      <router-link
        v-if="!onSellPage"
        to="/sell"
        class="px-4 py-2 bg-purple-600 font-mali text-white rounded hover:bg-purple-700"
      >
        เปิดหน้าขายสินค้า
      </router-link>

      <!-- ถ้าอยู่หน้า Sell แล้วแทนที่ด้วยปุ่มกลับหน้า สต็อก -->
      <router-link
        v-else
        to="/stock"
        class="px-4 py-2 bg-indigo-600 font-mali text-white rounded hover:bg-indigo-700"
        >กลับไปหน้าสต็อก</router-link
      >

      <!-- ปุ่ม admin -->
      <button
        v-if="isAdmin"
        @click="emit('manage-users')"
        class="bg-green-500 font-mali text-white px-4 py-2 rounded hover:bg-green-600"
      >
        จัดการพนักงาน
      </button>

      <!-- ปุ่ม logout -->
      <button
        @click="emit('logout')"
        class="bg-red-500 font-mali text-white px-4 py-2 rounded hover:bg-red-600"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";
import { useRoute } from "vue-router";

const route = useRoute(); // ✅ เพิ่มบรรทัดนี้
const onSellPage = computed(() => route.path === "/sell");

const props = defineProps({
  user: Object,
  isAdmin: Boolean,
});

const emit = defineEmits(["logout", "manage-users"]);

</script>
