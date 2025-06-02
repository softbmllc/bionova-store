// src/components/LayoutRoutes.tsx
import { Outlet } from "react-router-dom";
import Layout from "./Layout";

export default function LayoutRoutes() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}