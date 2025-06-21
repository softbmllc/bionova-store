// src/components/admin/EditProductModal.tsx
import React, { useState } from 'react';
import { useEffect } from "react";
import ImageUploader from "./ImageUploader";
import { handleImageUpload } from "../../utils/handleImageUpload";
import TiptapEditor from "./TiptapEditor";
import { Product } from "../../data/types";
import { updateProduct, fetchCategories, fetchSubcategories } from "../../firebaseUtils";
import { generateSlug } from "../../utils/generateSlug";
import { uploadImageToImageKit } from "../../utils/imagekitUtils";

// Drag and Drop
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core";

import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";

import { CSS } from "@dnd-kit/utilities";


// Tipo para ligas almacenadas en localStorage
type League = {
  id: number;
  name: string;
};

// Tipo para equipos almacenados en localStorage
type Team = {
  id: number;
  name: string;
  league: string;
};

interface Props {
  product: Product;
  onSave: (updatedProduct: Product) => void;
  onClose: () => void;
}

// Constantes para Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddkyumyw3/image/upload";
const UPLOAD_PRESET = "unsigned_preset";

// Componente para imagen arrastrable con flechas
function SortableImageItem({
  id,
  url,
  onRemove,
  onMoveLeft,
  onMoveRight,
}: {
  id: string;
  url: string;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Separar claramente el área arrastrable (solo la imagen) de los botones
  return (
    <div className="relative group">
      <div
        ref={setNodeRef}
        style={style}
        className="cursor-move"
        {...attributes}
        {...listeners}
      >
        <img
          src={url}
          alt="Vista previa"
          className="w-full h-40 object-cover rounded border"
        />
      </div>

      {/* Botón Eliminar */}
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
      >
        ×
      </button>

      {/* Flechas Izquierda y Derecha */}
      <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-100 transition">
        <button
          type="button"
          onClick={onMoveLeft}
          className="bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black"
        >
          ←
        </button>
        <button
          type="button"
          onClick={onMoveRight}
          className="bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black"
        >
          →
        </button>
      </div>
    </div>
  );
}

export default function EditProductModal({ product, onSave, onClose }: Props) {
  const [formData, setFormData] = useState<Product>({ ...product });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [uploadingImages, setUploadingImages] = useState(false);

  const [categories, setCategories] = useState<{ id: string; name: string; categoryId: string }[]>([]);
  const [subcategories, setSubcategories] = useState<{ id: string; name: string; categoryId: string }[]>([]);

  const [selectedCategory, setSelectedCategory] = useState(
    typeof product.category === "string" ? product.category : product.category?.id || ""
  );
  const [selectedSubcategory, setSelectedSubcategory] = useState(() => {
    if (typeof product.subcategory === "string") return product.subcategory;
    if (typeof product.subcategory === "object" && product.subcategory?.id) return product.subcategory.id;
    return "";
  });
  const [selectedTeam, setSelectedTeam] = useState<string>("");

  // Descripciones en inglés y español (inputs controlados)
  const [descriptionEN, setDescriptionEN] = useState(product.description?.en || "");
  const [descriptionES, setDescriptionES] = useState(product.description?.es || "");
  const [variants, setVariants] = useState(
    product.variants || [{ label: { es: "", en: "" }, options: [{ value: "", priceUSD: 0 }] }]
  );

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

useEffect(() => {
  const loadAllData = async () => {
    try {
      const categories = await fetchCategories();
      const allSubcategoriesWithCategoryId = (await Promise.all(
        categories.map(async (category: { id: string }) => {
          const subs = await fetchSubcategories(category.id);
          return subs.map((sub) => ({ ...sub, categoryId: category.id }));
        })
      )).flat();

      setCategories(categories.map((cat) => ({ ...cat, categoryId: cat.id })));
      // setSubcategories(allSubcategories.map((sub) => ({ ...sub, categoryId: "" })));
      setSubcategories(allSubcategoriesWithCategoryId);
    } catch (error) {
      console.error("[EditProductModal] Error al cargar datos desde Firebase:", error);
    }
  };

  loadAllData();
}, []);

const uploadToCloudinary = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", UPLOAD_PRESET);

  try {
    const response = await fetch(CLOUDINARY_URL, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) throw new Error(`Error de Cloudinary: ${response.statusText}`);
    const data = await response.json();
    return data.secure_url;
  } catch (error) {
    console.error("Error al subir la imagen a Cloudinary:", error);
    throw error;
  }
};

const handleChange = (field: keyof Product, value: any) => {
  setFormData((prev) => ({ ...prev, [field]: value }));
};


const [images, setImages] = useState<(string | null)[]>(
  product.images?.filter((img): img is string => typeof img === 'string') || []
);

// Mantener sincronizadas las imágenes con formData
useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    images: images.filter((img): img is string => img !== null),
  }));
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [images]);

const handleUpload = async (file: File): Promise<string | null> => {
  console.log("📤 Subiendo archivo:", file);

  try {
    const url = await uploadImageToImageKit(file);
    console.log("✅ URL devuelta por ImageKit:", url);
    return url;
  } catch (error) {
    console.error("❌ Error al subir imagen:", error);
    return null;
  }
};

const handleSaveProduct = async () => {
  setError("");
  setSaving(true);
  try {
    if (!formData.title?.en.trim()) {
      setError("El nombre del producto es obligatorio.");
      setSaving(false);
      return;
    }
    if (!selectedCategory || !selectedSubcategory) {
      setError("Debe seleccionar categoría y subcategoría.");
      setSaving(false);
      return;
    }
    if (!formData.images || formData.images.length === 0) {
      setError("Debe subir al menos una imagen del producto.");
      setSaving(false);
      return;
    }
    const productId = String(formData.id);
    const { id, ...productData } = formData;

    // Sincroniza variants en formData antes de guardar
    formData.variants = variants;

    const selectedCategoryObj = categories.find((cat) => cat.id === selectedCategory);
    const selectedSubcategoryObj = subcategories.find((sub) => sub.id === selectedSubcategory);

    const calculatedStockTotal = variants.reduce((total, variant) => {
      return total + variant.options.reduce((sum, opt: any) => sum + (opt.stock || 0), 0);
    }, 0);

    const updatedProduct: Product = {
      id: productId,
      ...productData,
      stockTotal: calculatedStockTotal,
      // productName: productData.productName?.trim() || "", // Removed: not part of Product type
      title: {
        en: productData.title?.en?.trim() || "",
        es: productData.title?.es?.trim() || "",
      },
      slug: productData.slug ?? generateSlug(productData.title?.en ?? ""),
      images: productData.images || [],
      priceUSD: productData.priceUSD || 0,
      stock: {},
      category: {
        id: selectedCategoryObj?.id ?? "",
        name: selectedCategoryObj?.name ?? "",
      },
      subcategory: {
        id: selectedSubcategoryObj?.id ?? "",
        name: selectedSubcategoryObj?.name ?? "",
      },
      defaultDescriptionType: productData.defaultDescriptionType || "none",
      extraDescriptionTop: productData.extraDescriptionTop || "",
      extraDescriptionBottom: productData.extraDescriptionBottom || "",
      description: {
        en: descriptionEN.trim(),
        es: descriptionES.trim(),
      },
      allowCustomization: productData.allowCustomization || false,
      descriptionPosition: productData.descriptionPosition || "bottom",
      active: productData.active !== undefined ? productData.active : true,
    };

    await updateProduct(productId, {
      ...updatedProduct,
      variants: variants,
    });
    
    onSave({
      ...updatedProduct,
      variants: variants,
    });
  } catch (error) {
    console.error("Error al guardar producto:", error);
    setError("Error al guardar el producto. Intenta nuevamente.");
  } finally {
    setSaving(false);
  }
};

const handleDragEnd = (event: DragEndEvent) => {
  const { active, over } = event;
  if (over && active.id !== over.id) {
    setFormData((prevState) => {
      const oldImages = prevState.images || [];
      const activeIndex = oldImages.findIndex((url) => url === active.id);
      const overIndex = oldImages.findIndex((url) => url === over.id);
      return { ...prevState, images: arrayMove(oldImages, activeIndex, overIndex) };
    });
  }
};

const moveImageLeft = (index: number) => {
  if (index > 0 && formData.images) {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      [newImages[index - 1], newImages[index]] = [newImages[index], newImages[index - 1]];
      return { ...prev, images: newImages };
    });
  }
};

const moveImageRight = (index: number) => {
  if (formData.images && index < formData.images.length - 1) {
    setFormData((prev) => {
      const newImages = [...(prev.images || [])];
      [newImages[index], newImages[index + 1]] = [newImages[index + 1], newImages[index]];
      return { ...prev, images: newImages };
    });
  }
};

const removeImage = (index: number) => {
  setFormData((prev) => {
    const newImages = [...(prev.images || [])];
    newImages.splice(index, 1);
    return { ...prev, images: newImages };
  });
};

return (
  <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
    <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={onClose}></div>
      <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-5xl sm:w-full">
        <div className="absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            onClick={onClose}
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <span className="sr-only">Cerrar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4" id="modal-title">Editar Producto</h3>

          {error && (
            <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">{error}</div>
          )}

          <div className="space-y-4 max-h-[70vh] overflow-y-auto p-1">
            {/* Datos básicos */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="lg:col-span-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Título Interno</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (EN)</label>
                    <input
                      type="text"
                      value={formData.title?.en || ""}
                      onChange={(e) => handleChange("title", { ...formData.title, en: e.target.value })}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md appearance-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (ES)</label>
                    <input
                      type="text"
                      value={formData.title?.es || ""}
                      onChange={(e) => handleChange("title", { ...formData.title, es: e.target.value })}
                      className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md appearance-none"
                    />
                  </div>
                </div>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value);
                    setSelectedSubcategory("");
                    setSelectedTeam("");
                  }}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar Categoría</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Subcategoría</label>
                <select
                  value={selectedSubcategory}
                  onChange={(e) => {
                    setSelectedSubcategory(e.target.value);
                    setSelectedTeam("");
                  }}
                  className="shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  required
                >
                  <option value="">Seleccionar Subcategoría</option>
                  {subcategories
                    .filter((sub) => sub.categoryId === selectedCategory)
                    .map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {typeof sub.name === "string"
                          ? sub.name
                          : typeof sub.name === "object" && sub.name !== null && "en" in sub.name && "es" in sub.name
                          ? (sub.name as { en?: string; es?: string }).en ?? (sub.name as { en?: string; es?: string }).es ?? ""
                          : ""}
                      </option>
                    ))}
                </select>
              </div>
              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Precio USD</label>
                <input
                  type="number"
                  value={formData.priceUSD || 0}
                  onChange={(e) => handleChange("priceUSD", parseFloat(e.target.value))}
                  className="remove-arrows shadow-sm focus:ring-primary-500 focus:border-primary-500 block w-full sm:text-sm border-gray-300 rounded-md appearance-none"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              {/* Precio UYU eliminado */}
            </div>



            {/* Descripción */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (EN)</label>
                <TiptapEditor content={descriptionEN} onChange={setDescriptionEN} withDefaultStyles={true} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Descripción (ES)</label>
                <TiptapEditor content={descriptionES} onChange={setDescriptionES} withDefaultStyles={true} />
              </div>
            </div>

            {/* Variantes */}
<div className="mt-6">
  <label className="block font-semibold mb-2">Variantes del producto</label>
  {variants.map((variant, vIndex) => (
    <div key={vIndex} className="mb-4 border p-3 rounded-md bg-gray-50">
      <div className="flex gap-4 mb-2">
        <input
          type="text"
          className="w-1/2 border p-2"
          placeholder="Nombre en español (Ej: Tamaño)"
          value={variant.label.es}
          onChange={(e) => {
            const updated = [...variants];
            updated[vIndex].label.es = e.target.value;
            setVariants(updated);
          }}
        />
        <input
          type="text"
          className="w-1/2 border p-2"
          placeholder="Nombre en inglés (Ej: Size)"
          value={variant.label.en}
          onChange={(e) => {
            const updated = [...variants];
            updated[vIndex].label.en = e.target.value;
            setVariants(updated);
          }}
        />
      </div>
      {variant.options.map((option, oIndex) => (
        <div key={oIndex} className="grid grid-cols-3 gap-2 mb-1 items-end">
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Valor</label>
            <input
              type="text"
              className="border p-2 w-full"
              placeholder="Ej: 60 cápsulas"
              value={option.value}
              onChange={(e) => {
                const updated = [...variants];
                updated[vIndex].options[oIndex].value = e.target.value;
                setVariants(updated);
              }}
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Precio USD</label>
            <input
              type="number"
              step="0.01"
              min={0}
              className="border p-2 w-full"
              placeholder="Ej: 19.99"
              value={option.priceUSD}
              onChange={(e) => {
                const updated = [...variants];
                updated[vIndex].options[oIndex].priceUSD = parseFloat(e.target.value);
                setVariants(updated);
              }}
            />
          </div>
          <div className="flex gap-1 items-end">
            <div className="w-full">
              <label className="block text-xs font-semibold text-gray-600 mb-1">Stock</label>
              <input
                type="number"
                min={0}
                className="border p-2 w-full"
                placeholder="Ej: 10"
                value={option.stock || 0}
                onChange={(e) => {
                  const updated = [...variants];
                  updated[vIndex].options[oIndex].stock = parseInt(e.target.value);
                  setVariants(updated);
                }}
              />
            </div>
            <button
              type="button"
              onClick={() => {
                const updated = [...variants];
                updated[vIndex].options = updated[vIndex].options.filter((_, i) => i !== oIndex);
                setVariants(updated);
              }}
              className="ml-1 px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600"
            >
              ×
            </button>
          </div>
        </div>
      ))}
      <button
        type="button"
        className="text-blue-600 text-sm mt-2"
        onClick={() => {
          const updated = [...variants];
          updated[vIndex].options.push({ value: "", priceUSD: 0 });
          setVariants(updated);
        }}
      >
        + Agregar opción
      </button>
      {/* Eliminar variante */}
      <button
        type="button"
        onClick={() => {
          const newVariants = variants.filter((_, i) => i !== vIndex);
          setVariants(newVariants);
        }}
        className="bg-red-500 text-white px-2 py-1 rounded mt-2 ml-2"
      >
        Eliminar
      </button>
    </div>
  ))}
  <button
    type="button"
    className="text-blue-600 mt-2"
    onClick={() => {
      setVariants([...variants, { label: { es: "", en: "" }, options: [{ value: "", priceUSD: 0 }] }]);
    }}
  >
    + Agregar variante
  </button>
</div>

            {/* Imágenes */}
            <div className="space-y-4">
              <label className="flex justify-between items-center">
                Imágenes
                <span className="text-gray-400 text-sm ml-2">(arrastrá para ordenar)</span>
              </label>
              <ImageUploader
                onUpload={handleUpload}
                images={images.filter((img): img is string => img !== null)}
                onChange={setImages}
              />
            </div>
          </div>
        </div>

        {/* Footer de botones */}
        <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            type="button"
            onClick={handleSaveProduct}
            disabled={saving}
            className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-black text-base font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black sm:ml-3 sm:w-auto sm:text-sm disabled:bg-gray-400"
          >
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
);
}