<template>
  <div class="p-6 max-w-3xl mx-auto">
    <Navbar
      :user="user"
      :isAdmin="isAdmin"
      @logout="logout"
      @manage-users="goManageUsers"
    />

    <h2 class="text-2xl font-bold mb-4">หน้าขายสินค้า</h2>
    <!-- ช่องรับ barcode -->
    <input
      ref="barcodeInput"
      v-model="barcodeBuffer"
      @keyup.enter="handleScan"
      class="absolute -left-full"
      autocomplete="off"
    />

    <button
      @click="focusScanner"
      class="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
    >
      คลิกหรือยิง Barcode เพื่อเริ่มขาย
    </button>

    <!-- ตารางการขาย -->
    <table v-if="cart.length" class="w-full border mb-4">
      <thead class="bg-gray-200">
        <tr>
          <th class="p-2 border">รหัสขาย</th>
          <th class="p-2 border">ชื่อสินค้า</th>
          <th class="p-2 border">จำนวน</th>
          <th class="p-2 border">ราคา/ชิ้น</th>
          <th class="p-2 border">รวม (฿)</th>
          <th class="p-2 border">ลบ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, idx) in cart" :key="idx" class="text-center">
          <td class="p-2 border">{{ item.saleCode }}</td>
          <td class="p-2 border">{{ item.name }}</td>
          <td class="p-2 border">{{ item.qty }}</td>
          <td class="p-2 border">{{ item.price.toLocaleString() }}</td>
          <td class="p-2 border">
            {{ (item.qty * item.price).toLocaleString() }}
          </td>
          <td class="p-2 border">
            <button @click="removeItem(idx)" class="text-red-600">✕</button>
          </td>
        </tr>
      </tbody>
    </table>

    <!-- รวมเงิน -->
    <div v-if="cart.length" class="text-right text-xl font-bold">
      รวม&nbsp;{{ totalPrice.toLocaleString() }}&nbsp;บาท
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from "vue";
import Navbar from "../components/Navbar.vue";
import { useRouter } from "vue-router";

const router = useRouter();

// โหลกสินค้าออกจาก localStorage
const products = ref([]);
function loadProducts() {
  const saved = localStorage.getItem("products");
  products.value = saved ? JSON.parse(saved) : [];
}

// ตัวแปรหน่วย
const cart = reactive([]);
const barcodeBuffer = ref("");
const barcodeInput = ref(null);

function focusScanner() {
  barcodeInput.value?.focus();
}

function handleScan() {
  const code = barcodeBuffer.value.trim();
  if (!code) return;
  const product = products.value.find((p) => p.barcode === code);
  if (!product) {
    alert(`ไม่พบ Barcode: ${code}`);
    barcodeBuffer.value = "";
    return;
  }
  if (product.quantity <= 0) {
    alert("จำนวนสต็อกไม่พอขาย");
    barcodeBuffer.value = "";
    return;
  }

  // ใส่ตะกร้า
  const line = cart.find((c) => c.barcode === code);
  if (line) {
    line.qty += 1;
  } else {
    cart.push({
      barcode: product.barcode,
      saleCode: product.saleCode,
      name: product.name,
      price: product.price,
      qty: 1,
    });
  }

  // ลดสต็อก
  product.quantity -= 1;
  saveProducts();

  barcodeBuffer.value = "";
}

function removeItem(idx) {
  const item = cart[idx];
  if (!item) return;

  // เติมสต็อกกลับ
  const prod = products.value.find((p) => p.barcode === item.barcode);
  if (prod) prod.quantity += item.qty;
  cart.splice(idx, 1);
  saveProducts();
}

function saveProducts() {
  localStorage.setItem("products", JSON.stringify(products.value));
}
const totalPrice = computed(() =>
  cart.reduce((sum, it) => sum + it.qty * it.price, 0)
);

onMounted(() => {
  loadProducts();
  focusScanner();
});

const user = JSON.parse(localStorage.getItem("user")) || {};
const isAdmin = user.username === "admin";

function logout() {
  localStorage.removeItem("user");
  router.push("/login");
}

function goManageUsers() {
  router.push("/manage-users");
}

</script>

<style></style>
