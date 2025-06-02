  // src/context/AuthContext.tsx
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { getLoggedInUser, loginUser as utilsLoginUser, logoutUser as utilsLogoutUser } from "../utils/userUtils";
import { User } from "../data/types";

interface AuthContextType {
  user: User | null;
  login: (user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Inicializar el estado directamente con lo que hay en localStorage
  // esto evita el flash inicial de "no autenticado"
  const storedUser = getLoggedInUser();
  const [user, setUser] = useState<User | null>(
    storedUser ? {
      id: String(storedUser.id),
      name: storedUser.name,
      email: storedUser.email,
      password: "", // Ajusta esto según cómo manejes la contraseña
    } : null
  );

  // Este useEffect es solo un seguro adicional
  useEffect(() => {
    const storedUser = getLoggedInUser();
    if (storedUser && !user) {
      setUser({
        id: String(storedUser.id),
        name: storedUser.name,
        email: storedUser.email,
        password: "", // Ajusta si tienes este dato
      });
    }
  }, [user]);

  const login = (user: User) => {
    setUser(user);
    utilsLoginUser({
      id: Number(user.id),
      name: user.name,
      email: user.email,
    });
  };

  const logout = () => {
    setUser(null);
    utilsLogoutUser();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}