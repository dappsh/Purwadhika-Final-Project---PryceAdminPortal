import Login from "views/Login/Login";
import Product from "views/Product/Product";
// import Dashboard from "views/Dashboard/Dashboard";
// import UserProfile from "views/UserProfile/UserProfile";
// import TableList from "views/TableList/TableList";
// import Typography from "views/Typography/Typography";
// import Icons from "views/Icons/Icons";
// import Maps from "views/Maps/Maps";
// import Notifications from "views/Notifications/Notifications";

const dashboardRoutes = [
  {
    path: "/login",
    name: "Login",
    icon: "pe-7s-graph",
    component: Login,
    hide: true
  },
  {
    path: "/product",
    name: "Product",
    icon: "pe-7s-coffee",
    component: Product
  },
  { redirect: true, path: "/", to: "/login", name: "Login" }
];

export default dashboardRoutes;
