<template>
  <div
    class="flex justify-center items-center h-screen bg-cover bg-center "
    style="background-image: url('/public/businessman.webp')"
  >
    <div
      class="backdrop-blur-sm md:backdrop-blur-lg p-6 rounded shadow-2xl w-full max-w-lg"
    >
      <!-- ปุ่ม Back -->
      <button
        @click="backToLogin"
        class="bg-gray-500 text-white text-sm px-3 py-1.5 rounded hover:bg-gray-600 self-start mb-4"
      >
        ← Back to Login
      </button>

      <h2 class=" font-mali text-3xl font-bold mb-6 text-center">จัดการพนักงาน</h2>

      <!-- ฟอร์มเพิ่มพนักงาน -->
      <div class="mb-8">
        <input
          v-model="newUser.username"
          type="text"
          placeholder="Username"
          class="w-full px-4 py-3 text-lg border-2 rounded mb-4"
        />
        <input
          v-model="newUser.password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 text-lg border-2 rounded mb-4"
        />
        <button
          @click="addUser"
          class="bg-green-500 text-white px-6 py-3 text-lg rounded-full hover:bg-green-600 w-full"
        >
          เพิ่มพนักงาน
        </button>
      </div>

      <!-- ตารางรายชื่อพนักงาน -->
      <table class="w-full border text-base">
        <thead>
          <tr class="bg-gray-100">
            <th class="px-3 py-3 border">Username</th>
            <th class="px-3 py-3 border">ลบ</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(user, index) in users"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="text-center px-3 py-3 border">{{ user.username }}</td>
            <td class="text-center px-3 py-3 border">
              <button
                @click="deleteUser(index)"
                class="text-red-600 hover:underline"
              >
                ลบ
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const router = useRouter();

const users = ref([]);
const newUser = ref({ username: "", password: "" });

function backToLogin() {
  router.push("/login");
}

function loadUser() {
  const data = localStorage.getItem("users");
  users.value = data ? JSON.parse(data) : [];
}

function saveUser() {
  localStorage.setItem("users", JSON.stringify(users.value));
}

function addUser() {
  if (!newUser.value.username.trim() || !newUser.value.password.trim()) {
    alert("กรุณากรอกให้ครบ");
    return;
  }

  const exists = users.value.some((u) => u.username === newUser.value.username);
  if (exists) {
    alert("Username ซ้ำ!");
    return;
  }

  users.value.push({
    username: newUser.value.username,
    password: newUser.value.password,
    name: newUser.value.username,
  });

  saveUser();
  console.log("Users after add:", users.value);
  newUser.value = { username: "", password: "" };
}

function deleteUser(index) {
  if (confirm("คุณต้องการลบพนักงานคนนี้หรือไม่")) {
    users.value.splice(index, 1);
    saveUser();
  }
}

onMounted(loadUser);
</script>
