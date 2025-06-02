// src/data/products.ts

import { Product } from "./types";

// Función dummy para compatibilidad (por ahora)
function createProduct(p: any, index: number): Product {
  return {
    id: typeof p.id === "number" ? p.id : 10000 + index,
    name: p.name || "",
    title: p.title || "",
    priceUSD: p.priceUSD ?? 0,
    priceUYU: p.priceUYU ?? 0,
    slug: p.slug || `producto-${10000 + index}`,
    subtitle: p.subtitle || "",
    extraDescription: p.extraDescription || "",
    images: p.images || [],
    sizes: p.sizes || ["S", "M", "L", "XL"],
    league: p.league || "FÚTBOL",
    team: p.team || "",
    description: p.description || "",
    descriptionPosition: p.descriptionPosition || "bottom",
    active: p.active ?? true,
    stock: p.stock || { S: 0, M: 0, L: 0, XL: 0 },
    customName: p.customName,
    customNumber: p.customNumber,
    category: p.category || "",
    subCategory: p.subCategory || "",
  };
}

// No hay productos hardcodeados ahora
const mergedProducts: Product[] = [];

export default mergedProducts;