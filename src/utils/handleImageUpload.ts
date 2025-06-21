// src/utils/handleImageUpload.ts
export const uploadImageToImageKit = async (file: File): Promise<string | null> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("fileName", file.name);
  formData.append("publicKey", "public_V7IJIzd4BjNYOQRVUw50wb/R9nk=");
  formData.append("folder", "/bionova");
  formData.append("useUniqueFileName", "true");

  try {
    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();
    if (response.ok) {
      return data.url; // Retorna la URL pública de la imagen subida
    } else {
      console.error("Error al subir imagen a ImageKit:", data);
      return null;
    }
  } catch (error) {
    console.error("Error de red al subir imagen:", error);
    return null;
  }
};

export const handleImageUpload = uploadImageToImageKit;