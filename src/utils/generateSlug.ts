//src/utils/generateSlug.ts
export function generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize("NFD") // Elimina acentos
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9\s-]/g, "")
      .trim()
      .replace(/\s+/g, "-");
  }