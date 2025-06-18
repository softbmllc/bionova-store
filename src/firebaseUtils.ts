// src/firebaseUtils.ts
import { db } from "./firebase";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";

import { Product, League, Team, Client, Category } from "./data/types";

// 🔥 Función para traer un producto específico por ID
export async function fetchProductById(id: string): Promise<Product | null> {
  try {
    const ref = doc(db, "products", id);
    const snap = await getDoc(ref);
    if (!snap.exists()) return null;
    const data = snap.data();
    return mapProductData(snap.id, data);
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return null;
  }
}

export async function fetchLeagues(): Promise<{ id: string; name: string }[]> {
  const ref = collection(db, "categories");
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name?.es || "",
  }));
}

// 🔥 Función para traer todos los productos
export async function fetchProducts(): Promise<Product[]> {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection);

  const productsList = productsSnapshot.docs.map((doc) => {
    const data = doc.data() as any;
    // Defensive handling of title as string or { es, en }
    const rawTitle = data.title;
    const title = {
      es:
        typeof rawTitle === "object" && typeof rawTitle?.es === "string"
          ? rawTitle.es
          : typeof rawTitle === "string"
          ? rawTitle
          : typeof data.titleEs === "string"
          ? data.titleEs
          : "Producto",
      en:
        typeof rawTitle === "object" && typeof rawTitle?.en === "string"
          ? rawTitle.en
          : typeof data.titleEn === "string"
          ? data.titleEn
          : "",
    };

    return {
      id: doc.id,
      slug:
        data.slug ||
        `${doc.id}-${title.es.toLowerCase().replace(/\s+/g, "-")}`,
      name: title.es || data.name || "Producto sin nombre",
      title,
      images: data.images || [],
      priceUSD: data.priceUSD || 0,
      league: data.league || "Fútbol",
      category: data.category || { id: "", name: "" },
      subcategory: data.subCategory || { id: "", name: "" },
      team: data.team || { id: "", name: "" },
      subtitle: data.subtitle || "",
      description: data.description || "",
      defaultDescriptionType: data.defaultDescriptionType || "none",
      extraDescriptionTop: data.extraDescriptionTop || "",
      extraDescriptionBottom: data.extraDescriptionBottom || "",
      descriptionPosition: data.descriptionPosition || "bottom",
      active: data.active ?? true,
      stock: data.stock || { S: 0, M: 0, L: 0, XL: 0 },
      sizes: data.sizes || ["S", "M", "L", "XL"],
      customName: data.customName || "",
      customNumber: data.customNumber || "",
      allowCustomization: data.allowCustomization ?? false,
      stockTotal: data.stockTotal ?? 0,
      variants: Array.isArray(data.variants) ? data.variants : [],
    };
  }) as Product[];

  console.log("🔥 DEBUG desde firebaseUtils – productos cargados:", productsList);
  return productsList;
}

// 🔥 Función para traer un producto específico por Slug
export async function fetchProductBySlug(productId: string): Promise<Product | null> {
  try {
    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);

    for (const productDoc of productsSnapshot.docs) {
      const data = productDoc.data() as any;
      const rawTitle = typeof data.title === "string" ? data.title : data.title?.es || data.name || "producto";
      const slug = data.slug || `${productDoc.id}-${rawTitle.toLowerCase().replace(/\s+/g, "-")}`;
      if (slug === productId) {
        return mapProductData(productDoc.id, data);
      }
    }

    return null;
  } catch (error) {
    console.error("Error al obtener producto por Slug:", error);
    return null;
  }
}

function mapProductData(id: string, data: any): Product {
  return {
    id,
    slug:
      data.slug ||
      `${id}-${(typeof data.title === "string" ? data.title : data.title?.es || "producto").toLowerCase().replace(/\s+/g, "-")}`,
    name: data.name || (typeof data.title === "string" ? data.title : data.title?.es) || "Producto sin nombre",
    title: {
      es:
        typeof data.title === "object" && typeof data.title?.es === "string"
          ? data.title.es
          : typeof data.title === "string"
          ? data.title
          : typeof data.titleEs === "string"
          ? data.titleEs
          : "Producto",
      en:
        typeof data.title === "object" && typeof data.title?.en === "string"
          ? data.title.en
          : typeof data.titleEn === "string"
          ? data.titleEn
          : "",
    },
    images: data.images || [],
    priceUSD: data.priceUSD || 0,
    league: data.league || "Fútbol",
    category: data.category || { id: "", name: "" },
    subcategory: data.subCategory || { id: "", name: "" },
    team: data.team || { id: "", name: "" },
    subtitle: data.subtitle || "",
    description: data.description || "",
    defaultDescriptionType: data.defaultDescriptionType || "none",
    extraDescriptionTop: data.extraDescriptionTop || "",
    extraDescriptionBottom: data.extraDescriptionBottom || "",
    descriptionPosition: data.descriptionPosition || "bottom",
    active: data.active ?? true,
    stock: data.stock || { S: 0, M: 0, L: 0, XL: 0 },
    sizes: data.sizes || ["S", "M", "L", "XL"],
    customName: data.customName || "",
    customNumber: data.customNumber || "",
    allowCustomization: data.allowCustomization ?? false,
    stockTotal: data.stockTotal ?? 0,
    variants: Array.isArray(data.variants) ? data.variants : [],
  };
}

// Las demás funciones (createProduct, updateProduct, etc.) se mantienen igual

export async function createProduct(product: Partial<Product>) {
  try {
    const productsCollection = collection(db, "products");
    const docRef = await addDoc(productsCollection, product);
    console.log("Producto creado con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error creando producto:", error);
    throw error;
  }
}

export async function updateProduct(productId: string, updatedData: Partial<Product>) {
  try {
    const productRef = doc(db, "products", productId);
    if (updatedData.variants && Array.isArray(updatedData.variants)) {
      updatedData.variants = updatedData.variants.map((variant) => ({
        ...variant,
        options: variant.options.map((option) => ({
          ...option,
          priceUSD: parseFloat(String(option.priceUSD || 0)),
        })),
      }));
    }
    await updateDoc(productRef, updatedData);
    console.log("Producto actualizado:", productId);
  } catch (error) {
    console.error("Error actualizando producto:", error);
    throw error;
  }
}

export async function deleteProduct(productId: string) {
  try {
    const productRef = doc(db, "products", productId);
    await deleteDoc(productRef);
    console.log("Producto eliminado:", productId);
  } catch (error) {
    console.error("Error eliminando producto:", error);
    throw error;
  }
}


export async function fetchCategoriesWithSubcategories(): Promise<
  {
    id: string;
    name: string;
    subcategories: { id: string; name: string }[];
  }[]
> {
  const ref = collection(db, "categories");
  const snap = await getDocs(ref);

  const categories = await Promise.all(
    snap.docs.map(async (doc) => {
      const subRef = collection(db, `categories/${doc.id}/subcategories`);
      const subSnap = await getDocs(subRef);
      const subcategories = subSnap.docs.map((subDoc) => ({
        id: subDoc.id,
        name: subDoc.data().name,
      }));
      return {
        id: doc.id,
        name: doc.data().name || "",
        subcategories,
      };
    })
  );

  return categories;
}


export async function createCategory(name: { es: string; en: string }) {
  try {
    const ref = collection(db, "categories");
    await addDoc(ref, { name });
  } catch (error) {
    console.error("Error creando categoría:", error);
    throw error;
  }
}


export async function deleteCategory(id: string) {
  try {
    const ref = doc(db, "categories", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error eliminando categoría:", error);
    throw error;
  }
}

export async function createSubcategory(categoryId: string, subcategoryName: string) {
  try {
    const ref = collection(db, `categories/${categoryId}/subcategories`);
    await addDoc(ref, { name: subcategoryName });
  } catch (error) {
    console.error("Error creando subcategoría:", error);
    throw error;
  }
}

export async function deleteSubcategory(categoryId: string, subcategoryId: string) {
  try {
    const ref = doc(db, `categories/${categoryId}/subcategories/${subcategoryId}`);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error eliminando subcategoría:", error);
    throw error;
  }
}


export async function fetchClientsFromFirebase(): Promise<Client[]> {
  const clientsRef = collection(db, "clients");
  const snap = await getDocs(clientsRef);
  return snap.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      name: data.name || "",
      email: data.email || "",
      phone: data.phone || "",
      address: data.address || "",
      country: data.country || "",
    };
  });
}

export async function deleteClientFromFirebase(clientId: string) {
  try {
    const clientRef = doc(db, "clients", clientId);
    await deleteDoc(clientRef);
    console.log("Cliente eliminado:", clientId);
  } catch (error) {
    console.error("Error eliminando cliente:", error);
    throw error;
  }
}

// 🔥 Función para traer subcategorías de una categoría específica
export async function fetchSubcategories(categoryId: string): Promise<{ id: string; name: string; categoryId: string }[]> {
  const ref = collection(db, `categories/${categoryId}/subcategories`);
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => {
    const rawName = doc.data().name;
    const name =
      typeof rawName === "string"
        ? rawName
        : typeof rawName?.es === "string"
        ? rawName.es
        : typeof rawName?.en === "string"
        ? rawName.en
        : "";

    return {
      id: doc.id,
      name,
      categoryId,
    };
  });
}
// 🔥 Función para importar un producto desde CJ Dropshipping por su ID
export async function importProductFromCJ(cjProductId: string) {
  try {
    const response = await fetch(`https://developers.cjdropshipping.com/api2.0/v1/product/getProductInfo`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "CJ-ACCESS-TOKEN": "AQUI_TU_TOKEN_CJ" // Reemplazar por tu token real
      },
      body: JSON.stringify({
        productSkuId: cjProductId
      })
    });

    const result = await response.json();
    if (!result || !result.data) throw new Error("Producto no encontrado en CJ");

    const data = result.data;

    const newProduct = {
      title: data.name,
      name: data.name,
      images: data.productImageInfoList?.map((img: any) => img.imageUrl) || [],
      priceUSD: parseFloat(data.productInfo?.sellPrice || "0"),
      slug: `${cjProductId}-${data.name.toLowerCase().replace(/\s+/g, "-")}`,
      description: data.productInfo?.description || "",
      category: { id: "", name: "Dropshipping" },
      subCategory: { id: "", name: "CJ" },
      active: true,
      variants: data.productVariantInfoList?.map((variant: any) => ({
        id: variant.variantSku,
        name: variant.variantKey, // ejemplo: "Red / XL"
        image: variant.imageUrl,
        price: parseFloat(variant.sellPrice),
      })) || [],
    };

    const productsCollection = collection(db, "products");
    const docRef = await addDoc(productsCollection, newProduct);
    console.log("Producto importado desde CJ con ID:", docRef.id);
    return docRef.id;
  } catch (error) {
    console.error("Error importando producto desde CJ:", error);
    throw error;
  }
}

// Nueva implementación de fetchCategories que devuelve subcategorías embebidas
export async function fetchCategories(): Promise<Category[]> {
  const ref = collection(db, "categories");
  const snap = await getDocs(ref);

  const categories = await Promise.all(
    snap.docs.map(async (doc) => {
      const rawName = doc.data().name;
      const name =
        typeof rawName === "string"
          ? rawName
          : typeof rawName?.es === "string"
          ? rawName.es
          : typeof rawName?.en === "string"
          ? rawName.en
          : "";

      const subRef = collection(db, `categories/${doc.id}/subcategories`);
      const subSnap = await getDocs(subRef);
      const subcategories = subSnap.docs.map((subDoc) => {
        const subName = subDoc.data().name;
        return {
          id: subDoc.id,
          name: subName,
          categoryId: doc.id,
        };
      });

      return {
        id: doc.id,
        name,
        categoryId: doc.id,
        subcategories,
      };
    })
  );

  return categories;
}