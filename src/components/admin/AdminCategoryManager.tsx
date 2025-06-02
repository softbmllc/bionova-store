// src/components/admin/AdminCategoryManager.tsx
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  fetchCategories,
  fetchSubcategories,
  createCategory,
  deleteCategory,
  createSubcategory,
  deleteSubcategory,
} from "../../firebaseUtils";
import { doc, setDoc } from "firebase/firestore";
import { firebaseDB } from "@/firebase";
import { useConfirm } from "@/components/ui/confirm";

export default function AdminCategoryManager() {
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>("");
  const [subcategories, setSubcategories] = useState<{ id: string; name: string }[]>([]);
  const [newSubcategory, setNewSubcategory] = useState("");
  // Edición de nombre de categoría
  const [editingCategoryId, setEditingCategoryId] = useState<string | null>(null);
  const [editedCategoryName, setEditedCategoryName] = useState<string>("");

  const confirm = useConfirm();

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const fetched = await fetchCategories();
      setCategories(fetched.map((l) => ({ id: l.id, name: l.name })));
    } catch (err) {
      console.error("Error al cargar categorías:", err);
    }
  };

  const loadSubcategories = async (categoryId: string) => {
    try {
      const fetched = await fetchSubcategories(categoryId);
      setSubcategories(fetched);
    } catch (err) {
      console.error("Error al cargar subcategorías:", err);
    }
  };

  const handleCreateCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      setLoading(true);
      await createCategory(newCategory.trim());
      setNewCategory("");
      await loadCategories();
    } catch (err) {
      console.error("Error creando categoría:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const category = categories.find(l => l.id === id);
    const confirmed = await confirm({
      title: "¿Eliminar categoría?",
      description: `¿Seguro que querés eliminar "${category?.name}" permanentemente?`,
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      setLoading(true);
      await deleteCategory(id);
      setSelectedCategoryId("");
      setSubcategories([]);
      await loadCategories();
    } catch (err) {
      console.error("Error eliminando categoría:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSubcategory = async () => {
    if (!newSubcategory.trim() || !selectedCategoryId) return;
    try {
      setLoading(true);
      await createSubcategory(selectedCategoryId, newSubcategory.trim());
      setNewSubcategory("");
      await loadSubcategories(selectedCategoryId);
    } catch (err) {
      console.error("Error creando subcategoría:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteSubcategory = async (subcategoryId: string) => {
    if (!selectedCategoryId) return;
    const sub = subcategories.find((s) => s.id === subcategoryId);
    const confirmed = await confirm({
      title: "¿Eliminar subcategoría?",
      description: sub ? `¿Seguro que querés eliminar "${sub.name}" permanentemente?` : "¿Seguro que querés eliminar esta subcategoría permanentemente?",
      confirmText: "Eliminar",
      cancelText: "Cancelar",
      variant: "danger",
    });
    if (!confirmed) return;
    try {
      setLoading(true);
      await deleteSubcategory(selectedCategoryId, subcategoryId);
      await loadSubcategories(selectedCategoryId);
    } catch (err) {
      console.error("Error eliminando subcategoría:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestionar Categorías</h2>

      <div className="flex items-center gap-4 mb-6">
        <Input
          placeholder="Nueva categoría (ej. Tecnología)"
          value={newCategory}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewCategory(e.target.value)}
          disabled={loading}
        />
        <Button onClick={handleCreateCategory} disabled={loading || !newCategory.trim()}>
          Crear
        </Button>
      </div>

      <table className="w-full border text-sm mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 border">ID</th>
            <th className="px-4 py-2 border">Categoría</th>
            <th className="px-4 py-2 border">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => (
            <tr key={category.id} className={`text-center ${selectedCategoryId === category.id ? "bg-gray-50" : ""}`}>
              <td className="border px-4 py-2 text-xs text-gray-400">{category.id}</td>
              <td className="border px-4 py-2 font-medium">
                {editingCategoryId === category.id ? (
                  <Input
                    value={editedCategoryName}
                    onChange={(e) => setEditedCategoryName(e.target.value)}
                    onBlur={async () => {
                      if (!editedCategoryName.trim() || editedCategoryName === category.name) {
                        setEditingCategoryId(null);
                        return;
                      }
                      try {
                        setLoading(true);
                        const docRef = doc(firebaseDB, "categories", category.id);
                        await setDoc(docRef, { id: category.id, name: editedCategoryName.trim() });
                        await loadCategories();
                      } catch (err) {
                        console.error("Error actualizando nombre de categoría:", err);
                      } finally {
                        setEditingCategoryId(null);
                        setLoading(false);
                      }
                    }}
                    autoFocus
                    disabled={loading}
                  />
                ) : (
                  <span
                    className="cursor-pointer hover:underline"
                    onClick={async () => {
                      setSelectedCategoryId(category.id);
                      await loadSubcategories(category.id);
                    }}
                  >
                    {category.name}
                  </span>
                )}
              </td>
              <td className="border px-4 py-2">
                <Button
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                  onClick={() => handleDeleteCategory(category.id)}
                  disabled={loading}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedCategoryId && (
        <div className="mt-10">
          <p className="text-sm text-gray-500 mb-1">
            Visualizando subcategorías de: <span className="font-semibold">{categories.find(l => l.id === selectedCategoryId)?.name}</span>
          </p>
          <h3 className="text-xl font-bold mb-4">Etiquetas</h3>

          <div className="flex items-center gap-4 mb-6">
            <Input
              placeholder="Nueva etiqueta (ej. viral)"
              value={newSubcategory}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewSubcategory(e.target.value)}
              disabled={loading}
            />
            <Button onClick={handleCreateSubcategory} disabled={loading || !newSubcategory.trim()}>
              Crear
            </Button>
          </div>

          <table className="w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 border">ID</th>
                <th className="px-4 py-2 border">Subcategoría</th>
                <th className="px-4 py-2 border">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {subcategories.map((sub) => (
                <tr key={sub.id} className="text-center">
                  <td className="border px-4 py-2 text-xs text-gray-400">{sub.id}</td>
                  <td className="border px-4 py-2 font-medium">{sub.name}</td>
                  <td className="border px-4 py-2">
                    <Button
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-xs"
                      onClick={() => handleDeleteSubcategory(sub.id)}
                      disabled={loading}
                    >
                      Eliminar
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}