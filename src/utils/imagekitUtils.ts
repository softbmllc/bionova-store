// src/utils/imagekitUtils.ts
export async function uploadImageToImageKit(file: File): Promise<string | null> {
  try {
    const authResponse = await fetch('/api/imagekit-signature');
    if (!authResponse.ok) {
      throw new Error(`Error al obtener autenticación de ImageKit: ${authResponse.status}`);
    }
    const authParams = await authResponse.json();

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);
    formData.append("publicKey", import.meta.env.VITE_IMAGEKIT_PUBLIC_KEY);
    formData.append("signature", authParams.signature);
    formData.append("expire", authParams.expire.toString());
    formData.append("token", authParams.token);
    formData.append("useUniqueFileName", "true");

    const response = await fetch("https://upload.imagekit.io/api/v1/files/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Error al subir imagen a ImageKit: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    if (!data.url) {
      throw new Error("La respuesta de ImageKit no contiene URL");
    }

    return data.url;
  } catch (error) {
    console.error("Error uploading to ImageKit", error);
    return null;
  }
}