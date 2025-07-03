import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import ManageUsers from "../views/ManageUsers.vue";
import StockPage from "../views/StockPage.vue";
import AdminLogin from "../views/AdminLogin.vue";
import SellPage from "../views/SellPage.vue";


const routes = [
  { path: "/", redirect: "/login" },
  { path: "/login", component: Login },
  {path: "/sell", component:SellPage},
  {
    path: "/stock",
    component: StockPage,
    beforeEnter: (to, from, next) => {
      const user = localStorage.getItem("user");
      if (!user) next("/login");
      else next();
    },
  },


  {
    path: "/manage-users",
    component: ManageUsers,
    beforeEnter: (to, from, next) => {
      const user = JSON.parse(localStorage.getItem("user"));
      if (user && user.username === "admin") {
        next();
      } else {
        alert("อนุญาตให้เฉพาะ admin เข้าหน้านี้");
        next("/login");
      }
    },
  },
  {
    path: "/admin-login",
    component: AdminLogin,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
