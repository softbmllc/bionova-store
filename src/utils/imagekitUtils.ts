export async function uploadImageToImageKit(file: File): Promise<string | null> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "unsigned_preset");
  
    try {
      const response = await fetch("https://upload.imagekit.io/api/public/upload", {
        method: "POST",
        body: formData,
      });
  
      const data = await response.json();
      return data.url || null;
    } catch (error) {
      console.error("Error uploading to ImageKit", error);
      return null;
    }
  }