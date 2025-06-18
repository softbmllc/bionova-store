// src/App.tsx
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import LayoutRoutes from "./components/LayoutRoutes";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import PromoSlider from "./components/PromoSlider";
import AboutPreview from "./components/AboutPreview";
import ProductPage from "./pages/ProductPage";
// import FootballPage from "./pages/FootballPage";
import CartPage from "./pages/CartPage";
// import SuccessPage from "./pages/SuccessPage";
// import FailurePage from "./pages/FailurePage";
// import PendingPage from "./pages/PendingPage";
import AdminPanel from "./pages/AdminPanel";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginForm from "./components/LoginForm";
import RequireAuth from "./components/RequireAuth";
import AdminCategoryManager from "./components/admin/AdminCategoryManager"; // ✅ NUEVO componente oficial
import OrderAdmin from "./components/admin/OrderAdmin";
import ClientDetail from "./components/admin/ClientDetail";
import Shop from "./pages/Shop";

function ClientDetailWrapper() {
  const { id } = useParams();
  const navigate = useNavigate();

  const clientId = id || "";

  return <ClientDetail clientId={clientId} onBack={() => navigate("/admin")} />;
}

function Home() {
  return (
    <>
      <Hero />
      <CategorySection />
      <PromoSlider />
      <AboutPreview />
    </>
  );
}

export default function App() {
  return (
    <div className="bg-white min-h-screen flex flex-col">
      <Routes>
        {/* ✅ Login público */}
        <Route path="/login" element={<LoginForm />} />

        {/* ✅ Ruta protegida directa al administrador de categorías */}
        <Route
          path="/admin/categorias"
          element={
            <RequireAuth>
              <AdminCategoryManager />
            </RequireAuth>
          }
        />

        {/* ✅ Detalle de cliente en administración */}
        <Route
          path="/admin/clientes/:id"
          element={
            <RequireAuth>
              <ClientDetailWrapper />
            </RequireAuth>
          }
        />

        {/* ✅ Panel completo de administración */}
        <Route path="/admin/*" element={<RequireAuth><AdminPanel /></RequireAuth>} />

        {/* ✅ Ruta pública sin layout */}
        <Route path="/carrito" element={<CartPage />} />

        {/* ✅ Ruta pública sin layout */}
        <Route path="/producto/:slug" element={<ProductPage />} />

        {/* ✅ Layout general para todas las rutas públicas */}
<Route element={<LayoutRoutes />}>
  <Route path="/" element={<Home />} />
  <Route path="/explore" element={<CategorySection />} />
  <Route path="/about" element={<AboutPage />} />
  <Route path="/contact" element={<ContactPage />} />
  <Route path="/shop" element={<Shop />} />
</Route>

        {/* ✅ Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}