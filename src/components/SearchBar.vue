<template>
  <div class="grid grid-cols-12 gap-4 mb-4">
    <input
      v-model="searchCode"
      placeholder="ค้นหารหัสสต็อก"
      class="col-span-12 md:col-span-4 input"
      @input="$emit('update:searchCode', searchCode)"
    />
    <input
      v-model="searchSaleCode"
      placeholder="ค้นหารหัสขาย"
      class="col-span-12 md:col-span-4 input"
      @input="$emit('update:searchSaleCode', searchSaleCode)"
    />
    <input
      v-model="searchDetail"
      placeholder="ค้นหารายละเอียด"
      class="col-span-12 md:col-span-4 input"
      @input="$emit('update:searchDetail', searchDetail)"
    />
  </div>
</template>

<script setup>
import { ref, watch, defineEmits, defineProps } from "vue";

const emits = defineEmits([
  "update:searchCode",
  "update:searchSaleCode",
  "update:searchDetail",
]);

const props = defineProps({
  searchCode: String,
  searchSaleCode: String,
  searchDetail: String,
});

const searchCode = ref(props.searchCode || "");
const searchSaleCode = ref(props.searchSaleCode || "");
const searchDetail = ref(props.searchDetail || "");

watch(searchCode, (val) => emits("update:searchCode", val));
watch(searchSaleCode, (val) => emits("update:searchSaleCode", val));
watch(searchDetail, (val) => emits("update:searchDetail", val));
</script>

<style scoped>
.input {
  @apply border border-gray-300 rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-300;
}
</style>
