import CryptoJS from "crypto-js";

// ⚠️ Este User es solo para manejo interno de login, no para productos ni cliente final
export interface AuthUser {
  id: number;
  name: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode: string;
  email: string;
  password: string; // almacenada encriptada
}

const STORAGE_KEY = "usuarios";
const ADMIN_EMAIL = "fefo157@gmail.com";

// 🔐 Función para encriptar contraseña
const hashPassword = (password: string): string => {
  return CryptoJS.SHA256(password).toString();
};

export const saveUser = (user: AuthUser): boolean => {
  const usuarios = getUsers();
  const emailExists = usuarios.some((u) => u.email === user.email);
  if (emailExists) return false;

  const id = Date.now();
  const userToSave = {
    ...user,
    id,
    password: hashPassword(user.password),
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([...usuarios, userToSave]));
  return true;
};

export const getUsers = (): AuthUser[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const authenticateUser = (
  email: string,
  password: string
): Pick<AuthUser, "id" | "name" | "email"> | null => {
  const usuarios = getUsers();
  const hashed = hashPassword(password);
  const match = usuarios.find(
    (u) => u.email === email && u.password === hashed
  );

  if (match && match.email === ADMIN_EMAIL) {
    return {
      id: match.id,
      name: match.name,
      email: match.email,
    };
  }

  return null;
};

export const getLoggedInUser = (): Pick<AuthUser, "id" | "name" | "email"> | null => {
  const data = localStorage.getItem("loggedInUser");
  return data ? JSON.parse(data) : null;
};

export const loginUser = (user: Pick<AuthUser, "id" | "name" | "email">) => {
  localStorage.setItem("loggedInUser", JSON.stringify(user));
};

export const logoutUser = () => {
  localStorage.removeItem("loggedInUser");
};

// ✅ Crear admin solo si no hay ningún usuario
const existingUsers = getUsers();
if (existingUsers.length === 0) {
  const password = "admin123";
  const hashed = hashPassword(password);

  const admin: AuthUser = {
    id: 9999,
    name: "Admin Fefo",
    phone: "099999999",
    address: "Oficina",
    city: "Montevideo",
    department: "Montevideo",
    postalCode: "11900",
    email: ADMIN_EMAIL,
    password: hashed,
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify([admin]));
  console.log("✅ Usuario admin creado automáticamente");
  console.log("🔐 Hash de 'admin123':", hashed);
}