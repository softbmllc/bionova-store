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
import { Product, League, Team, Client } from "./data/types";

// 🔥 Función para traer todos los productos
export async function fetchProducts(): Promise<Product[]> {
  const productsCollection = collection(db, "products");
  const productsSnapshot = await getDocs(productsCollection);

  const productsList = productsSnapshot.docs.map((doc) => {
    const data = doc.data() as any;
    return {
      id: doc.id,
      slug:
        data.slug ||
        `${doc.id}-${(data.title || "producto")
          .toLowerCase()
          .replace(/\s+/g, "-")}`,
      name: data.name || data.title || "Producto sin nombre",
      title: data.title || data.name || "Producto sin título",
      images: data.images || [],
      priceUSD: data.priceUSD || 0,
      priceUYU: data.priceUYU || 0,
      league: data.league || "Fútbol",
      category: data.category || { id: "", name: "" },
      subCategory: data.subCategory || { id: "", name: "" },
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
    };
  }) as Product[];

  return productsList;
}

// 🔥 Función para traer un producto específico por ID o Slug
export async function fetchProductById(productId: string): Promise<Product | null> {
  try {
    const productRef = doc(db, "products", productId);
    const productSnap = await getDoc(productRef);

    if (productSnap.exists()) {
      const data = productSnap.data() as any;
      return mapProductData(productSnap.id, data);
    }

    const productsCollection = collection(db, "products");
    const productsSnapshot = await getDocs(productsCollection);

    for (const productDoc of productsSnapshot.docs) {
      const data = productDoc.data() as any;
      const generatedSlug =
        data.slug ||
        `${productDoc.id}-${(data.title || "producto")
          .toLowerCase()
          .replace(/\s+/g, "-")}`;
      if (generatedSlug === productId) {
        return mapProductData(productDoc.id, data);
      }
    }

    return null;
  } catch (error) {
    console.error("Error al obtener producto por ID o Slug:", error);
    return null;
  }
}

function mapProductData(id: string, data: any): Product {
  return {
    id,
    slug:
      data.slug ||
      `${id}-${(data.title || "producto").toLowerCase().replace(/\s+/g, "-")}`,
    name: data.name || data.title || "Producto sin nombre",
    title: data.title || data.name || "Producto sin título",
    images: data.images || [],
    priceUSD: data.priceUSD || 0,
    priceUYU: data.priceUYU || 0,
    league: data.league || "Fútbol",
    category: data.category || { id: "", name: "" },
    subCategory: data.subCategory || { id: "", name: "" },
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

export async function fetchLeagues(): Promise<League[]> {
  const ref = collection(db, "categories");
  const snap = await getDocs(ref);

  const leaguesWithTeams: League[] = [];

  for (const docSnap of snap.docs) {
    const leagueId = docSnap.id;
    const leagueName = docSnap.data().name || "";

    const teamsRef = collection(db, `categories/${leagueId}/teams`);
    const teamsSnap = await getDocs(teamsRef);
    const teams = teamsSnap.docs.map(teamDoc => teamDoc.data().name || "");

    leaguesWithTeams.push({
      id: leagueId,
      name: leagueName,
      teams,
    });
  }

  return leaguesWithTeams;
}

export async function fetchCategories(): Promise<{ id: string; name: string }[]> {
  const ref = collection(db, "categories");
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
  }));
}

export async function createLeague(name: string) {
  try {
    const ref = collection(db, "categories");
    await addDoc(ref, { name });
  } catch (error) {
    console.error("Error creando liga:", error);
    throw error;
  }
}

export async function createCategory(name: string) {
  try {
    const ref = collection(db, "categories");
    await addDoc(ref, { name });
  } catch (error) {
    console.error("Error creando categoría:", error);
    throw error;
  }
}

export async function deleteLeague(id: string) {
  try {
    const ref = doc(db, "categories", id);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error eliminando liga:", error);
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

export async function createTeam(categoryId: string, subcategoryId: string, teamName: string) {
  try {
    const ref = collection(db, `categories/${categoryId}/subcategories/${subcategoryId}/teams`);
    await addDoc(ref, { name: teamName });
  } catch (error) {
    console.error("Error creando equipo/marca:", error);
    throw error;
  }
}

export async function deleteTeam(categoryId: string, subcategoryId: string, teamId: string) {
  try {
    const ref = doc(db, `categories/${categoryId}/subcategories/${subcategoryId}/teams/${teamId}`);
    await deleteDoc(ref);
  } catch (error) {
    console.error("Error eliminando equipo/marca:", error);
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
export async function fetchSubcategories(categoryId: string): Promise<{ id: string; name: string }[]> {
  const ref = collection(db, `categories/${categoryId}/subcategories`);
  const snap = await getDocs(ref);
  return snap.docs.map((doc) => ({
    id: doc.id,
    name: doc.data().name || "",
  }));
}