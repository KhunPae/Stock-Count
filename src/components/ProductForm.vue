<template>
  <div class="fixed inset-0 flex items-center justify-center z-50" v-if="show">
    <div class="absolute inset-0 bg-black/50" @click="close" />
    <div
      class="relative bg-white w-full max-w-md mx-4 p-6 rounded-lg shadow-lg z-10"
    >
      <h3 class="text-lg font-bold mb-4 text-center">
        {{ isEdit ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่" }}
      </h3>

      <div class="space-y-3">
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">รหัสสต็อก</label>
          <input v-model="formProduct.code" class="input flex-1" />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">รหัสขาย</label>
          <input v-model="formProduct.saleCode" class="input flex-1" />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">ชื่อสินค้า</label>
          <input v-model="formProduct.name" class="input flex-1" />
        </div>
        <div class="flex items-start gap-3">
          <label class="w-32 pt-2 text-right">รายละเอียด</label>
          <textarea
            v-model="formProduct.detail"
            rows="2"
            class="input flex-1"
          ></textarea>
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">จำนวน</label>
          <input
            v-model.number="formProduct.quantity"
            type="number"
            class="input flex-1"
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">ต้นทุน (฿)</label>
          <input
            :value="costDisplay"
            @input="onCostInput"
            class="input flex-1 text-right"
          />
        </div>
        <div class="flex items-center gap-3">
          <label class="w-32 text-right">ราคา (฿)</label>
          <input
            :value="priceDisplay"
            @input="onPriceInput"
            class="input flex-1 text-right"
          />
        </div>
        <div class="flex items-start gap-3">
          <label class="w-32 pt-2 text-right">รูปภาพ</label>
          <div class="flex-1 space-y-2">
            <input
              type="file"
              accept="image/*"
              @change="onFileChange"
              class="input w-full"
            />
            <img
              v-if="previewUrl"
              :src="previewUrl"
              class="max-h-32 rounded border"
            />
          </div>
        </div>

        <!-- แสดง Barcode -->
        <div
          class="flex justify-center mb-3"
          v-if="formProduct.code && formProduct.saleCode"
        >
          <svg ref="barcode"></svg>
        </div>
      </div>

      <div class="mt-6 flex justify-end gap-2">
        <button
          @click="submit"
          class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          {{ isEdit ? "บันทึกการแก้ไข" : "บันทึก" }}
        </button>
        <button
          @click="close"
          class="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          ปิด
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps, onMounted, nextTick } from "vue";
import JsBarcode from "jsbarcode";

const emits = defineEmits(["save", "close"]);

const props = defineProps({
  show: Boolean,
  isEdit: Boolean,
  initialProduct: Object,
});

const formProduct = ref({
  code: "",
  saleCode: "",
  name: "",
  detail: "",
  quantity: 0,
  cost: 0,
  price: 0,
  image: null,
});

const previewUrl = ref(null);
const costDisplay = ref("");
const priceDisplay = ref("");
const barcode = ref(null);

watch(
  () => props.initialProduct,
  async (val) => {
    if (val) {
      formProduct.value = { ...val };
      previewUrl.value = val.image || null;
      costDisplay.value = formatMoney(String(val.cost));
      priceDisplay.value = formatMoney(String(val.price));
      await nextTick();
      generateBarcode();
    } else {
      resetForm();
    }
  },
  { immediate: true }
);

function resetForm() {
  formProduct.value = {
    code: "",
    saleCode: "",
    name: "",
    detail: "",
    quantity: 0,
    cost: 0,
    price: 0,
    image: null,
  };
  previewUrl.value = null;
  costDisplay.value = "";
  priceDisplay.value = "";
  generateBarcode();
}

function formatMoney(val) {
  const numericVal = Number(val);
  if (isNaN(numericVal)) {
    return "";
  }
  return numericVal.toLocaleString("th-TH");
}

function unformatMoney(s) {
  return Number(String(s).replace(/,/g, "") || 0);
}

// สร้าง Barcode
function generateBarcode() {
  if (formProduct.value.code && formProduct.value.saleCode && barcode.value) {
    const barcodeValue = `${formProduct.value.code}-${formProduct.value.saleCode}`;
    JsBarcode(barcode.value, barcodeValue, {
      format: "CODE128",
      width: 2,
      height: 50,
      displayValue: true,
    });
  } else if (barcode.value) {
    barcode.value.innerHTML = "";
  }
}

watch(
  () => [formProduct.value.code, formProduct.value.saleCode],
  () => generateBarcode()
);

function onCostInput(event) {
  const rawValue = event.target.value;
  const numericValue = unformatMoney(rawValue);
  formProduct.value.cost = numericValue;
  costDisplay.value = formatMoney(String(numericValue));
}

function onPriceInput(event) {
  const rawValue = event.target.value;
  const numericValue = unformatMoney(rawValue);
  formProduct.value.price = numericValue;
  priceDisplay.value = formatMoney(String(numericValue));
}

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    previewUrl.value = reader.result;
    formProduct.value.image = reader.result;
  };
  reader.readAsDataURL(file);
}

function submit() {
  if (
    !formProduct.value.code.trim() ||
    !formProduct.value.saleCode.trim() ||
    !formProduct.value.name.trim()
  ) {
    alert("กรุณากรอก รหัสสต็อก, รหัสขาย และชื่อสินค้า");
    return;
  }
  const barcodeValue = `${formProduct.value.code}-${formProduct.value.saleCode}`;
  emits("save", { ...formProduct.value, barcode: barcodeValue });
}
function close() {
  emits("close");
}

onMounted(() => {
  generateBarcode();
});
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300;
}
</style>
