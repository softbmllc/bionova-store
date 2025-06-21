// src/components/admin/ImageUploader.tsx
import React, { useState, useEffect, useRef } from "react";
import { X } from "lucide-react";
import { handleImageUpload } from "../../utils/handleImageUpload";
import ImageKit from "imagekit-javascript";

interface ImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  onUpload?: (file: File) => Promise<string | null>;
}

export default function ImageUploader({ images, onChange, onUpload }: ImageUploaderProps) {
  const [localImages, setLocalImages] = useState<string[]>(images || []);
  const [error, setError] = useState("");

  useEffect(() => {
    setLocalImages(images || []);
  }, [images]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files ? Array.from(e.target.files) : [];

    console.log("Archivos seleccionados:", files);
    if (!files || files.length === 0) return;
    setError("");

    const uploadPromises = files.map(async (file) => {
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (fileExt === 'webp') {
        alert("⚠️ Atención: Las imágenes en formato .webp pueden causar problemas de navegación. Recomendamos usar formato .jpg o .png.");
      }

      if (file.size > 5000000) {
        setError("Una o más imágenes superan los 5MB");
        return null;
      }

      // Unsigned upload using fetch and public key
      try {
        const uploadEndpoint = "https://ik.imagekit.io/devrodri/upload";

        const formData = new FormData();
        formData.append("file", file);
        formData.append("fileName", file.name);
        formData.append("uploadPreset", "unsigned_preset");
        formData.append("useUniqueFileName", "true");

        const response = await fetch(uploadEndpoint, {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Error en la subida a ImageKit");
        }

        const data = await response.json();
        console.log("📤 Imagen subida:", data.url);
        return data.url;
      } catch (uploadError) {
        console.error("Error al subir imagen:", uploadError);
        setError("Error al subir una o más imágenes.");
        return null;
      }
    });

    const results = await Promise.all(uploadPromises);
    const successfulUploads = results.filter((url: string | null): url is string => !!url);

    const updatedImages = [...localImages, ...successfulUploads];
    setLocalImages(updatedImages);
    console.log("Imágenes subidas:", updatedImages);
    onChange(updatedImages);
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
        <div
          onClick={triggerFileInput}
          className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 transition"
        >
          <span className="block text-gray-500 mb-2">
            Hacé clic para subir imágenes
          </span>
          <span className="block text-sm text-gray-400">
            PNG, JPG o WEBP, máx. 5MB
          </span>
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
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