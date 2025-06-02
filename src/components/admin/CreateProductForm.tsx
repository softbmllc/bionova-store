// src/components/admin/CreateProductForm.tsx
import React, { useState, useEffect, useRef } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { Product } from "../../data/types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  createProduct,
  fetchSubcategories,
  fetchCategories,
} from "../../firebaseUtils";

// Definimos los tamaños disponibles como una constante
const SIZES = ["S", "M", "L", "XL"] as const;
// Creamos un tipo a partir de los valores de SIZES
type Size = typeof SIZES[number];

// Tipamos el objeto de stock para que utilice el tipo Size
type StockRecord = Record<Size, number>;

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

// Interfaz para nuestro formulario
interface FormData {
  title: string;
  league: string;
  team: string;
  priceUSD: number;
  cjProductId: string;
  defaultDescriptionType: "none" | "camiseta";
  extraDescriptionTop: string;
  extraDescriptionBottom: string;
  descriptionPosition: "top" | "bottom";
  active: boolean;
  customizable: boolean;
  stock: StockRecord;
}

// Constantes para Cloudinary
const CLOUDINARY_URL = "https://api.cloudinary.com/v1_1/ddkyumyw3/image/upload";
const UPLOAD_PRESET = "unsigned_preset";

// Función para generar un slug limpio (sin timestamp ni random)
const generateCleanSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
};

// Componente para imagen arrastrable
function SortableImageItem({ id, url, onRemove, onMoveLeft, onMoveRight }: {
  id: string;
  url: string;
  onRemove: () => void;
  onMoveLeft: () => void;
  onMoveRight: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative cursor-move group" {...attributes} {...listeners}>
      <img src={url} alt="Vista previa" className="w-full h-40 object-cover rounded border" />
      <button
        type="button"
        onClick={onRemove}
        className="absolute top-1 right-1 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center hover:bg-red-600 transition"
      >
        ×
      </button>
      <div className="absolute bottom-1 left-1 right-1 flex justify-between opacity-0 group-hover:opacity-100 transition">
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveLeft(); }} className="bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/90">
          ←
        </button>
        <button type="button" onClick={(e) => { e.stopPropagation(); onMoveRight(); }} className="bg-black/70 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-black/90">
          →
        </button>
      </div>
    </div>
  );
}

// 🔥 ACA recién empieza el componente:
export default function CreateProductForm() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    category: "",
    subCategory: "",
    team: "",
    priceUSD: 0,
    priceUYU: 0,
    images: [],
    sizes: ["S", "M", "L", "XL"],
    stock: {
      S: 0,
      M: 0,
      L: 0,
      XL: 0,
    },
    active: true,
    customizable: true,
  });

  // Estado para mensaje de éxito visual
  const [successMessage, setSuccessMessage] = useState("");

  // Estados principales
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");
const [images, setImages] = useState<string[]>([]);
type Category = {
  id: number;
  name: string;
};

const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
const [subcategories, setSubcategories] = useState<{ id: string; name: string; categoryId: string }[]>([]);
const [uploadingImages, setUploadingImages] = useState(false);
const fileInputRef = useRef<HTMLInputElement>(null);
const [selectedCategory, setSelectedCategory] = useState("");
const [selectedSubcategory, setSelectedSubcategory] = useState("");
const [selectedTeam, setSelectedTeam] = useState("");
const [product, setProduct] = useState<Partial<Product>>({});
const [customizable, setCustomizable] = useState(true);

useEffect(() => {
  const loadAllData = async () => {
    try {
      const fetchedCategories = await fetchCategories();
      setCategories(fetchedCategories);

      if (fetchedCategories.length > 0) {
        const defaultCategoryId = fetchedCategories[0].id;
        const fetchedSubcategories = await fetchSubcategories(defaultCategoryId);
        setSubcategories(
          fetchedSubcategories.map((sub) => ({
            ...sub,
            categoryId: defaultCategoryId,
          }))
        );
      }

      console.log("[CreateProductForm] Categorías y subcategorías cargadas desde Firebase");
    } catch (error) {
      console.error("[CreateProductForm] Error cargando categorías:", error);
    }
  };

  loadAllData();
}, []);

// 🔥 Mantener formData sincronizado con las selecciones
useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    category: selectedCategory,
  }));
}, [selectedCategory]);

useEffect(() => {
  setSelectedSubcategory("");
}, [selectedCategory]);

useEffect(() => {
  setFormData((prev) => ({
    ...prev,
    subcategory: selectedSubcategory,
  }));
}, [selectedSubcategory]);

// 🧹 Luego sigue tu código normal
  // Configuración mejorada de sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // puedes ajustar esta distancia si quieres
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  // Función para subir imágenes a Cloudinary - Mejorada para múltiples imágenes
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", UPLOAD_PRESET);
    
    try {
      const response = await fetch(CLOUDINARY_URL, {
        method: "POST",
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error(`Error de Cloudinary: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.secure_url;
    } catch (error) {
      console.error("Error al subir la imagen a Cloudinary:", error);
      throw error;
    }
  };
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    control,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: {
      title: "",
      league: "",
      team: "",
      priceUSD: 80,
      cjProductId: "",
      defaultDescriptionType: "none", // 🔥 Nuevo
      extraDescriptionTop: "",        // 🔥 Nuevo
      extraDescriptionBottom: "",     // 🔥 Nuevo
      descriptionPosition: "bottom",
      active: true,
      customizable: true,
      stock: {
        S: 0,
        M: 0,
        L: 0,
        XL: 0,
      },
    },
  });

  // Observar cambios en el equipo seleccionado para actualizar la liga automáticamente

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      setImages((items) => {
        const oldIndex = items.findIndex((item) => item === active.id);
        const newIndex = items.findIndex((item) => item === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };


  // Mejorado: Manejo de carga de múltiples imágenes
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0) return;
    
    setUploadingImages(true);
    setError("");
    
    try {
      const files = Array.from(event.target.files);
      console.log(`[CreateProductForm] Subiendo ${files.length} imágenes...`);
      
      // Subir todas las imágenes en paralelo
      const uploadPromises = files.map(file => uploadToCloudinary(file));
      const uploadedUrls = await Promise.all(uploadPromises);
      
      // Agregar las URLs a las imágenes existentes
      setImages(prevImages => [...prevImages, ...uploadedUrls]);
      
      console.log(`[CreateProductForm] ${uploadedUrls.length} imágenes subidas con éxito`);
      
      // Limpiar el input para permitir subir los mismos archivos nuevamente si es necesario
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("[CreateProductForm] Error al subir imágenes:", error);
      setError("Error al subir imágenes. Intente nuevamente.");
    } finally {
      setUploadingImages(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };
  
  const handleMoveImage = (index: number, direction: "left" | "right") => {
    if (
      (direction === "left" && index === 0) ||
      (direction === "right" && index === images.length - 1)
    ) {
      return;
    }
    
    const newImages = [...images];
    const newIndex = direction === "left" ? index - 1 : index + 1;
    
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    
    setImages(newImages);
  };

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    if (images.length === 0) {
      setError("Debes subir al menos una imagen");
      return;
    }

    if (!selectedCategory || !selectedSubcategory) {
      setError("Debes seleccionar categoría y subcategoría");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const title = data.title.trim();
      const slug = generateCleanSlug(title);

      // Verificación de duplicidad de slug (ver comentarios anteriores para implementación)

      const categoryName = categories.find((cat) => cat.id === selectedCategory)?.name || "";
      const subcategoryName = subcategories.find((sub) => sub.id === selectedSubcategory)?.name || "";
      const newProduct: Partial<Product> = {
        title: title,
        slug: slug,
        category: { id: selectedCategory, name: categoryName },
        subCategory: { id: selectedSubcategory, name: subcategoryName },
        priceUSD: data.priceUSD,
        cjProductId: data.cjProductId,
        defaultDescriptionType: data.defaultDescriptionType || "none",
        extraDescriptionTop: data.extraDescriptionTop || "",
        extraDescriptionBottom: data.extraDescriptionBottom || "",
        descriptionPosition: data.descriptionPosition || "bottom",
        active: data.active,
        stock: data.stock,
        images: images,
        allowCustomization: data.customizable,
        customName: "",
        customNumber: "",
      };

      // 🔥 Verificación de nombres de categoría y subcategoría
      console.log("[Verificación]", categoryName, subcategoryName);
      console.log("[CreateProductForm] Producto listo para guardar:", newProduct);

      await createProduct(newProduct);
      setSuccessMessage("¡Producto creado correctamente!");
      setTimeout(() => {
        setSuccessMessage("");
        navigate("/admin/productos");
      }, 2000);
    } catch (error) {
      console.error("[CreateProductForm] Error al crear producto:", error);
      setError("Error al crear el producto. Intente nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const handleFormValidation = async (data: any) => {
  
    if (!selectedCategory) {
      alert("Por favor selecciona una categoría");
      return;
    }
  
    if (!selectedSubcategory) {
      alert("Por favor selecciona una subcategoría");
      return;
    }
  
    // ✅ Si pasa validaciones
    handleSubmit(data);
  };

  return (
    <>
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-md mb-4">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
    
        {/* Error general */}
        {error && (
          <div className="bg-red-100 text-red-700 p-4 rounded-md">{error}</div>
        )}
    
        {/* Título */}
        <div className="space-y-2">
          <label htmlFor="title" className="block font-medium">
            Título del producto <span className="text-red-500">*</span>
          </label>
          <input
            id="title"
            type="text"
            {...register("title", { required: "El título es obligatorio" })}
            className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            placeholder="Ej: Camiseta Uruguay 2023 Titular"
          />
          {errors.title && (
            <span className="text-red-500 text-sm">{errors.title.message}</span>
          )}
        </div>

        {/* CJ Product ID */}
<div className="space-y-2">
  <label htmlFor="cjProductId" className="block font-medium">
    CJ Product ID <span className="text-red-500">*</span>
  </label>
  <input
    id="cjProductId"
    type="text"
    {...register("cjProductId", {
      required: "El ID del producto en CJ Dropshipping es obligatorio",
    })}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="Ej: 100123456789"
  />
  {errors.cjProductId && (
    <span className="text-red-500 text-sm">{errors.cjProductId.message}</span>
  )}
</div>

      {/* CATEGORÍA */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Categoría:</label>
  <select
    className="w-full border p-2 rounded"
    value={selectedCategory}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedCategory(value);
      const categoryName = categories.find((cat) => cat.id === value)?.name || "";
      setProduct((prev) => ({ ...prev, category: { id: value, name: categoryName } }));
    }}
  >
    <option value="">Seleccionar categoría</option>
    {categories.map((cat) => (
      <option key={cat.id} value={cat.id}>
        {cat.name}
      </option>
    ))}
  </select>
</div>

{/* SUBCATEGORÍA */}
<div className="mb-4">
  <label className="block text-sm font-medium mb-1">Subcategoría:</label>
  <select
    className="w-full border p-2 rounded"
    value={selectedSubcategory}
    onChange={(e) => {
      const value = e.target.value;
      setSelectedSubcategory(value);
      const subcategoryName = subcategories.find((sub) => sub.id === value)?.name || "";
      setProduct((prev) => ({ ...prev, subCategory: { id: value, name: subcategoryName } }));
    }}
    disabled={!selectedCategory}
  >
    <option value="">Seleccionar subcategoría</option>
    {subcategories
      .filter((sub) => sub.categoryId === selectedCategory)
      .map((sub) => (
        <option key={sub.id} value={sub.id}>
          {sub.name}
        </option>
      ))}
  </select>
</div>

        {/* Precios */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label htmlFor="priceUSD" className="block font-medium">
              Precio en USD <span className="text-red-500">*</span>
            </label>
            <input
              id="priceUSD"
              type="number"
              step="0.01"
              min="0"
              {...register("priceUSD", {
                required: "El precio en USD es obligatorio",
                valueAsNumber: true,
                validate: (value) => value > 0 || "El precio debe ser mayor a 0",
              })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.priceUSD && (
              <span className="text-red-500 text-sm">{errors.priceUSD.message}</span>
            )}
          </div>
        </div>


        {/* Stock */}
        <div className="space-y-2">
          <label className="block font-medium">
            Stock disponible <span className="text-red-500">*</span>
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
    {SIZES.map((size) => (
      <div key={size} className="space-y-1">
        <label htmlFor={`stock.${size}`} className="block text-sm">
          Talle {size}
        </label>
        <input
          id={`stock.${size}`}
          type="number"
          min="0"
          {...register(`stock.${size}` as const, {
            valueAsNumber: true,
          })}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
        />
      </div>
    ))}
  </div>
        </div>

      {/* Descripción automática */}
<div className="space-y-2">
  <label htmlFor="defaultDescriptionType" className="block font-medium">
    Descripción automática
  </label>
  <select
    id="defaultDescriptionType"
    {...register("defaultDescriptionType")}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
  >
    <option value="">Sin descripción automática</option>
    <option value="camiseta">Camiseta</option>
    {/* Futuras opciones: campera, short, etc */}
  </select>
</div>

<div className="space-y-2 mt-4">
  <label className="flex items-center space-x-2">
    <input
      type="checkbox"
      checked={formData.customizable}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, customizable: e.target.checked }))
      }
      className="text-black rounded focus:ring-black h-5 w-5"
    />
    <span>Permitir personalización con nombre y número</span>
  </label>
</div>

{/* Texto arriba de la descripción */}
<div className="space-y-2">
  <label htmlFor="extraDescriptionTop" className="block font-medium">
    Texto adicional (arriba)
  </label>
  <textarea
    id="extraDescriptionTop"
    {...register("extraDescriptionTop")}
    rows={3}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="Texto opcional arriba de la descripción automática..."
  ></textarea>
</div>

{/* Texto abajo de la descripción */}
<div className="space-y-2">
  <label htmlFor="extraDescriptionBottom" className="block font-medium">
    Texto adicional (abajo)
  </label>
  <textarea
    id="extraDescriptionBottom"
    {...register("extraDescriptionBottom")}
    rows={3}
    className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
    placeholder="Texto opcional abajo de la descripción automática..."
  ></textarea>
</div>

      {/* Estado activo */}
      <div className="space-y-2">
        <label className="flex items-center space-x-2">
          <input
            type="checkbox"
            {...register("active")}
            className="text-black rounded focus:ring-black h-5 w-5"
          />
          <span>Producto activo (visible para clientes)</span>
        </label>
      </div>

      {/* Imágenes */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="block font-medium">
            Imágenes <span className="text-red-500">*</span>
          </label>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleImageUpload}
            className="hidden"
            id="image-upload"
          />
          
          <label
            htmlFor="image-upload"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md cursor-pointer transition-colors flex items-center justify-center disabled:opacity-50"
          >
            {uploadingImages ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Subiendo...
              </>
            ) : (
              <>Agregar imágenes</>
            )}
          </label>
        </div>

        {images.length > 0 && (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              <SortableContext
                items={images}
                strategy={verticalListSortingStrategy}
              >
                {images.map((url, index) => (
                  <SortableImageItem
                    key={url}
                    id={url}
                    url={url}
                    onRemove={() => handleRemoveImage(index)}
                    onMoveLeft={() => handleMoveImage(index, "left")}
                    onMoveRight={() => handleMoveImage(index, "right")}
                  />
                ))}
              </SortableContext>
            </div>
          </DndContext>
        )}
        
        {images.length === 0 && (
          <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center text-gray-500">
            No hay imágenes cargadas
          </div>
        )}
      </div>

        {/* Botón de envío */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || uploadingImages}
            className={`w-full py-3 px-4 rounded-md font-medium transition-colors ${
              loading || uploadingImages
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              </div>
            ) : (
              "Crear publicación"
            )}
          </button>
        </div>
      </form>
    </>
  );
}