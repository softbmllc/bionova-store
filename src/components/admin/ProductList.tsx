// src/components/admin/ProductList.tsx
import { useEffect, useState } from "react";
import { Product } from "../../data/types";
import { fetchProducts, deleteProduct, fetchProductById, updateProduct } from "../../firebaseUtils";
import EditProductModal from "./EditProductModal";
import ModalConfirm from "./ModalConfirm";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filter, setFilter] = useState("Todas");
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [confirmDeleteName, setConfirmDeleteName] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      setError(null);
      try {
        const productsData = await fetchProducts();
        setProducts(productsData);
      } catch (error) {
        console.error("Error al cargar productos:", error);
        setError("No se pudieron cargar los productos. Intenta nuevamente.");
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, []);

  const handleEdit = async (id: string) => {
    try {
      const product = await fetchProductById(id);
      if (product) {
        setEditingProduct(product);
        setIsModalOpen(true);
      } else {
        setError(`No se encontró el producto con ID: ${id}`);
      }
    } catch (error) {
      console.error("Error al cargar producto para editar:", error);
      setError("No se pudo cargar el producto para editar. Intenta nuevamente.");
    }
  };

  const handleSaveProduct = async (updatedProduct: Product) => {
    try {
      if (updatedProduct.id) {
        await updateProduct(updatedProduct.id, updatedProduct);
        const refreshedProducts = await fetchProducts();
        setProducts(refreshedProducts);
        setIsModalOpen(false);
        setEditingProduct(null);
      }
    } catch (error) {
      console.error("Error al guardar cambios:", error);
      setError("No se pudo guardar el producto. Intenta nuevamente.");
    }
  };

  const toggleActive = async (id: string) => {
    try {
      const product = products.find((p) => p.id === id);
      if (!product) return;
      await updateProduct(id, { active: !product.active });
      const refreshedProducts = await fetchProducts();
      setProducts(refreshedProducts);
    } catch (error) {
      console.error("Error al actualizar estado:", error);
      setError("No se pudo actualizar el estado del producto.");
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setConfirmDeleteId(id);
    setConfirmDeleteName(name);
  };

  const confirmDelete = async () => {
    if (confirmDeleteId) {
      try {
        await deleteProduct(confirmDeleteId);
        const refreshedProducts = await fetchProducts();
        setProducts(refreshedProducts);
        setConfirmDeleteId(null);
        setConfirmDeleteName("");
      } catch (error) {
        console.error("Error al eliminar producto:", error);
        setError("No se pudo eliminar el producto.");
      }
    }
  };

  const cancelDelete = () => {
    setConfirmDeleteId(null);
    setConfirmDeleteName("");
  };

  const uniqueLeagues = [
    "Todas",
    ...Array.from(
      new Set(
        products
          .map((p) =>
            typeof p.category === "object" ? p.category?.name : p.category
          )
          .filter(Boolean)
      )
    ),
  ].sort();

  const filteredProducts =
    filter === "Todas"
      ? products
      : products.filter(
          (p) =>
            (typeof p.category === "object"
              ? p.category?.name
              : p.category) === filter
        );

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Publicaciones</h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
          <button onClick={() => setError(null)} className="ml-2">&times;</button>
        </div>
      )}

      <div className="mb-4">
        <label className="mr-2 font-medium">Filtrar por categoría:</label>
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded shadow focus:ring-black"
        >
          {uniqueLeagues.map((league) => (
            <option key={league} value={league}>
              {league}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="text-center py-8">Cargando productos...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-8 text-gray-500 italic">No hay productos.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left">Título</th>
                <th className="py-2 text-left">Liga</th>
                <th className="py-2 text-left">Precio</th>
                <th className="py-2 text-left">Stock</th>
                <th className="py-2 text-left">Estado</th>
                <th className="py-2 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} className="border-b">
                  <td className="py-2">{product.title}</td>
                  <td className="py-2">
                    {typeof product.category === "object"
                      ? product.category?.name
                      : product.category || "Sin categoría"}
                  </td>
                  <td className="py-2">{product.priceUSD} USD / {product.priceUYU} UYU</td>
                  <td className="py-2">{Object.entries(product.stock ?? {}).map(([size, qty]) => `${size}: ${qty}`).join(", ")}</td>
                  <td className="py-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${product.active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {product.active ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-2 space-x-2">
                    <button onClick={() => handleEdit(product.id!)} className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs">
                      Editar
                    </button>
                    <button onClick={() => toggleActive(product.id!)} className="bg-yellow-500 hover:bg-yellow-600 text-white px-2 py-1 rounded text-xs">
                      {product.active ? "Desactivar" : "Activar"}
                    </button>
                    <button onClick={() => handleDeleteClick(product.id!, product.title)} className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs">
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {confirmDeleteId && (
        <ModalConfirm
          title="¿Eliminar producto?"
          message={`¿Seguro que quieres eliminar "${confirmDeleteName}"?`}
          onConfirm={confirmDelete}
          onCancel={cancelDelete}
          isLoading={false}
        />
      )}

      {isModalOpen && editingProduct && (
        <EditProductModal
          product={editingProduct}
          onSave={handleSaveProduct}
          onClose={() => {
            setIsModalOpen(false);
            setEditingProduct(null);
          }}
        />
      )}
    </div>
  );
}