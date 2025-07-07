<template>
  <Navbar
    :user="user"
    :isAdmin="isAdmin"
    @logout="logout"
    @manage-users="goManageUsers"
  />

  <div class="p-6">
    <h2 class="font-mali text-2xl font-bold mb-4">📦 รายการสินค้า</h2>

    <button
      @click="startAdd"
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600"
    >
      + เพิ่มสินค้าใหม่
    </button>

    <SearchBar
      v-model:searchCode="searchCode"
      v-model:searchSaleCode="searchSaleCode"
      v-model:searchDetail="searchDetail"
    />

    <table class="w-full border border-gray-300">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2 border">รหัสสต็อก</th>
          <th class="p-2 border">รหัสขาย</th>
          <th class="p-2 border">ชื่อสินค้า</th>
          <th class="p-2 border">รายละเอียดสินค้า</th>
          <th class="p-2 border">จำนวน</th>
          <th class="p-2 border">ต้นทุน</th>
          <th class="p-2 border">ราคา</th>
          <th class="p-2 border">รูป</th>
          <th class="p-2 border w-24">จัดการ</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="(item, idx) in filteredProducts"
          :key="idx"
          class="text-center"
        >
          <td class="p-2 border">{{ item.code }}</td>
          <td class="p-2 border">{{ item.saleCode }}</td>
          <td class="p-2 border">{{ item.name }}</td>
          <td class="p-2 border">{{ item.detail }}</td>
          <td class="p-2 border">{{ item.quantity }}</td>
          <td class="p-2 border text-right">
            {{ item.cost.toLocaleString() }}
          </td>
          <td class="p-2 border text-right">
            {{ item.price.toLocaleString() }}
          </td>
          <td class="p-2 border">
            <img v-if="item.image" :src="item.image" class="h-12 mx-auto" />
          </td>
          <td class="p-2 border">
            <button
              @click="startEdit(item, idx)"
              class="inline-block text-blue-600 hover:text-blue-800 mr-1"
            >
              <PencilSquareIcon class="h-5 w-5" />
            </button>
            <button
              @click="deleteProduct(idx)"
              class="inline-block text-red-600 hover:text-red-800"
            >
              <TrashIcon class="h-5 w-5" />
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <ProductForm
      :show="showModal"
      :isEdit="isEdit"
      :initialProduct="currentProduct"
      @save="handleSaveProduct"
      @close="handleCloseForm"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";

import Navbar from "../components/Navbar.vue";
import ProductForm from "../components/ProductForm.vue";
import SearchBar from "../components/SearchBar.vue";
import { PencilSquareIcon, TrashIcon } from "@heroicons/vue/24/solid";
// import func from "../../vue-temp/vue-editor-bridge";

const router = useRouter();

const user = ref(null);
const isAdmin = ref(false);

const products = ref([
  {
    code: "ST001",
    saleCode: "SC001",
    name: "น้ำดื่ม",
    detail: "ขวด 1.5ML",
    quantity: 24,
    cost: 4,
    price: 8,
    image: null,
  },
  // ...
]);

const showModal = ref(false);
const isEdit = ref(false);
const currentProduct = ref(null);
const currentIndex = ref(null);

const searchCode = ref("");
const searchSaleCode = ref("");
const searchDetail = ref("");

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

function goManageUsers() {
  router.push("/manage-users");
}

function startAdd() {
  isEdit.value = false;
  currentProduct.value = null;
  showModal.value = true;
}

function startEdit(item, idx) {
  isEdit.value = true;
  currentIndex.value = idx;
  currentProduct.value = { ...item };
  showModal.value = true;
}

function saveProduct(product) {
  if (isEdit.value) {
    if (currentIndex.value !== null) {
      products.value[currentIndex.value] = product;
    }
  } else {
    products.value.push(product);
  }
  showModal.value = false;
}

function deleteProduct(idx) {
  if (confirm("ลบสินค้านี้?")) {
    products.value.splice(idx, 1);
  }
}
function handleSaveProduct(product) {
  if (isEdit.value) {
    // กรณีแก้ไข
    if (currentIndex.value !== null) {
      products.value[currentIndex.value] = product;
    }
    showModal.value = false; // ปิดหน้าต่างแก้ไข
  } else {
    // กรณีเพิ่มใหม่
    products.value.push(product);
    // ไม่ปิด modal แต่ล้าง currentProduct เพื่อให้ฟอร์มล้างค่า
    currentProduct.value = {
      code: "",
      saleCode: "",
      name: "",
      detail: "",
      quantity: 0,
      cost: 0,
      price: 0,
      image: null,
    };
  }
}
function handleCloseForm() {
  showModal.value = false;
  currentProduct.value = null;
}

const filteredProducts = computed(() =>
  products.value.filter(
    (p) =>
      (!searchCode.value ||
        p.code.toLowerCase().includes(searchCode.value.trim().toLowerCase())) &&
      (!searchSaleCode.value ||
        p.saleCode
          .toLowerCase()
          .includes(searchSaleCode.value.trim().toLowerCase())) &&
      (!searchDetail.value ||
        p.detail
          .toLowerCase()
          .includes(searchDetail.value.trim().toLowerCase()))
  )
);

onMounted(() => {
  const saveUser = localStorage.getItem("user");
  if (!saveUser) router.push("/login");
  else {
    user.value = JSON.parse(saveUser);
    isAdmin.value = user.value.username === "admin";
  }
});
</script>
