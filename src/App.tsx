// src/App.tsx
import { Routes, Route, Navigate, useParams, useNavigate } from "react-router-dom";
import LayoutRoutes from "./components/LayoutRoutes";
import Hero from "./components/Hero";
import CategorySection from "./components/CategorySection";
import PromoSlider from "./components/PromoSlider";
// import ProductPage from "./pages/ProductPage";
// import FootballPage from "./pages/FootballPage";
import CartPage from "./pages/CartPage";
// import SuccessPage from "./pages/SuccessPage";
// import FailurePage from "./pages/FailurePage";
// import PendingPage from "./pages/PendingPage";
import AdminPanel from "./pages/AdminPanel";
import LoginForm from "./components/LoginForm";
import RequireAuth from "./components/RequireAuth";
import AdminCategoryManager from "./components/admin/AdminCategoryManager"; // ✅ NUEVO componente oficial
import OrderAdmin from "./components/admin/OrderAdmin";
import ClientDetail from "./components/admin/ClientDetail";

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

        {/* ✅ Rutas públicas de secciones */}
        <Route path="/carrito" element={<CartPage />} />

        {/* ✅ Rutas con layout */}
        <Route path="/" element={<LayoutRoutes />}>
          <Route index element={<Home />} />
          <Route path="explore" element={<CategorySection />} />
          <Route path="about" element={<div className='p-6 text-center'>Sobre nosotros</div>} />
          <Route path="contact" element={<div className='p-6 text-center'>Contacto</div>} />
        </Route>

        {/* ✅ Fallback 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}