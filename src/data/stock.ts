// src/data/stock.ts
import { Product } from "./types";

export const stockProducts: Partial<Product>[] = [
  {
    id: "6001",
    name: "Real Madrid Visitante 24/25 – Mbappé",
    priceUSD: 62,
    priceUYU: 2690,
    slug: "rma-away-ucl-24-25-mbappe",
    subtitle: "Edición Champions League",
    images: [
      "/images/laliga/rma-away-ucl-24-25-1.jpg",
      "/images/laliga/rma-away-ucl-24-25-2.jpg",
      "/images/laliga/rma-away-ucl-24-25-3.jpg",
      "/images/laliga/rma-away-ucl-24-25-4.jpg",
      "/images/laliga/rma-away-ucl-24-25-mbappe.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 1, M: 2, L: 2, XL: 2 },
    league: "La Liga",
    team: { id: "real-madrid", name: "Real Madrid" },
    customName: "Mbappé",
    customNumber: "7",
  },
  {
    id: "6002",
    name: "Real Madrid Visitante 24/25 – Valverde",
    priceUSD: 62,
    priceUYU: 2690,
    slug: "rma-away-ucl-24-25-valverde",
    subtitle: "Edición Champions League",
    images: [
      "/images/laliga/rma-away-ucl-24-25-1.jpg",
      "/images/laliga/rma-away-ucl-24-25-2.jpg",
      "/images/laliga/rma-away-ucl-24-25-3.jpg",
      "/images/laliga/rma-away-ucl-24-25-4.jpg",
      "/images/laliga/rma-away-ucl-24-25-valverde.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 0, M: 1, L: 1, XL: 0 },
    league: "La Liga",
    team: { id: "real-madrid", name: "Real Madrid" },
    customName: "Valverde",
    customNumber: "8",
  },
  {
    id: "6003",
    name: "Real Madrid Visitante 24/25 – Modric",
    priceUSD: 62,
    priceUYU: 2690,
    slug: "rma-away-ucl-24-25-modric",
    subtitle: "Edición Champions League",
    images: [
      "/images/laliga/rma-away-ucl-24-25-1.jpg",
      "/images/laliga/rma-away-ucl-24-25-2.jpg",
      "/images/laliga/rma-away-ucl-24-25-3.jpg",
      "/images/laliga/rma-away-ucl-24-25-4.jpg",
      "/images/laliga/rma-away-ucl-24-25-modric.jpg"
    ],
    sizes: ["S", "M", "L", "XL"],
    stock: { S: 1, M: 1, L: 1, XL: 0 },
    league: "La Liga",
    team: { id: "real-madrid", name: "Real Madrid" },
    customName: "Modric",
    customNumber: "10",
  },
  {
    id: "6004",
    name: "Argentina Final Copa América 2024 – Messi",
    priceUSD: 62,
    priceUYU: 2690,
    slug: "arg-final-ca-24-messi",
    subtitle: "Edición Final Copa América",
    images: ["/images/argentina/argentina-local-final-ca-24.jpg"],
    sizes: ["M", "L", "XL"],
    stock: { M: 3, L: 3, XL: 2 },
    league: "Selecciones Nacionales",
    team: { id: "argentina", name: "Argentina" },
    customName: "Messi",
    customNumber: "10",
  },
];

export default stockProducts;