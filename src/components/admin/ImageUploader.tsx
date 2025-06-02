// src/components/admin/ImageUploader.tsx
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export default function ImageUploader({ images, onChange }: ImageUploaderProps) {
  const [localImages, setLocalImages] = useState<string[]>(images || []);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError("");
    const files = e.target.files;
    if (!files || files.length === 0) return;

    // Verificar si la imagen es un formato webp y mostrar advertencia
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      
      if (fileExt === 'webp') {
        // En lugar de prohibir, vamos a convertir el nombre para evitar problemas
        alert("⚠️ Atención: Las imágenes en formato .webp pueden causar problemas de navegación. Recomendamos usar formato .jpg o .png.");
      }
    }

    const newImages: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5000000) {
        setError("Una o más imágenes superan los 5MB");
        return;
      }

      // Renombrar el archivo para evitar problemas con nombres especiales
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          // Generar un nombre seguro para la imagen
          const timestamp = Date.now();
          const fileExt = file.name.split('.').pop();
          const safeFilename = `image_${timestamp}.${fileExt}`;
          
          // Agregar a las imágenes locales para visualización
          newImages.push(e.target.result as string);
          
          // Si todas las imágenes están listas, actualizar
          if (newImages.length === files.length) {
            const updatedImages = [...localImages, ...newImages];
            setLocalImages(updatedImages);
            onChange(updatedImages);
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = [...localImages];
    updatedImages.splice(index, 1);
    setLocalImages(updatedImages);
    onChange(updatedImages);
  };

  return (
    <div>
      <div className="mb-3">
        <label
          htmlFor="image-upload"
          className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
        >
          <span className="block text-gray-500 mb-2">
            Hacé clic para subir imágenes
          </span>
          <span className="block text-sm text-gray-400">
            PNG, JPG o WEBP, máx. 5MB
          </span>
          <input
            id="image-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </label>
      </div>

      {error && (
        <p className="text-red-500 text-sm mb-3">{error}</p>
      )}

      {localImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {localImages.map((image, index) => (
            <div
              key={index}
              className="relative border rounded-lg overflow-hidden"
            >
              <img
                src={image}
                alt={`Imagen ${index + 1}`}
                className="w-full h-24 object-cover"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-black bg-opacity-60 text-white rounded-full p-1 hover:bg-opacity-80 transition"
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}