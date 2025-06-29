import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Header } from "./Header";

const Layout = () => {
  return (
<div className="app-layout flex h-screen overflow-hidden w-full">
  <Sidebar />
  <div className="flex flex-col flex-1 min-w-0 h-full">
    <Header />
    <main className="flex-1 min-w-0  overflow-x-auto p-4">
      <Outlet className="h-auto flex flex-col"/>
    </main>
  </div>
  <ToastContainer position="top-right" autoClose={3000} />
</div>
  );
};
export default Layout;
