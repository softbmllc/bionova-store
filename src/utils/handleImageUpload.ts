// src/utils/handleImageUpload.ts
export const handleImageUpload = async (file: File): Promise<string | null> => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", "public_V7IJIzd4BjNYOQRVUw50wb/R9nk=");
    formData.append("folder", "/bionova");
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      console.error("Image upload failed", await response.text());
      return null;
    }

    const data = await response.json();
    return data.url; // Esta es la URL pública de la imagen subida
  } catch (error) {
    console.error("Upload error:", error);
    return null;
  }
};