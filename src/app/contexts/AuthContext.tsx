import React, { createContext, useContext, useState, useEffect } from "react";
import type { Enterprise, Product, Category, User } from "../types";
import * as api from "../api";

// Context provides data fetched from backend and CRUD helpers

interface AuthContextType {
  user: User | null;
  users: User[];
  enterprises: Enterprise[];
  categories: Category[];
  isAdmin: boolean;
  isOwner: boolean;
  myEnterprise: Enterprise | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  // Enterprise CRUD
  addEnterprise: (enterprise: Partial<Enterprise>) => Promise<Enterprise | null>;
  updateEnterprise: (id: string, data: Partial<Enterprise>) => Promise<Enterprise | null>;
  removeEnterprise: (id: string) => Promise<boolean>;
  // Product CRUD
  addProduct: (enterpriseId: string, product: Partial<Product>) => Promise<any>;
  updateProduct: (
    enterpriseId: string,
    productId: string,
    data: Partial<Product>
  ) => Promise<any>;
  removeProduct: (enterpriseId: string, productId: string) => Promise<any>;
  // User CRUD (admin only)
  addUser: (user: Partial<User>) => Promise<any>;
  updateUser: (id: string, data: Partial<User>) => Promise<any>;
  removeUser: (id: string) => Promise<any>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [enterprises, setEnterprises] = useState<Enterprise[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);

  // Load initial data
  useEffect(() => {
    (async () => {
      try {
        const [ents, cats, usrs] = await Promise.all([
          api.getEnterprises(),
          api.getCategories(),
          api.getUsers(),
        ]);
        setEnterprises(ents);
        setCategories(cats as Category[]);
        setUsers(usrs as User[]);
      } catch (err) {
        console.error("Failed to load initial data", err);
      }
    })();
  }, []);

  const isAdmin = user?.role === "admin";
  const isOwner = user?.role === "owner";
  const myEnterprise =
    isOwner && user?.enterpriseId
      ? enterprises.find((e) => e.id === user.enterpriseId) || null
      : null;

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login(email, password);
      if (res && res.email) {
        setUser(res as User);
        return true;
      }
    } catch (err) {
      return false;
    }
    return false;
  };

  const logout = () => setUser(null);

  // Enterprise CRUD
  const addEnterprise = async (enterprise: Partial<Enterprise>) => {
    try {
      const res = await api.createEnterprise(enterprise);
      setEnterprises((prev) => [...prev, res]);
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const updateEnterprise = async (id: string, data: Partial<Enterprise>) => {
    try {
      const res = await api.updateEnterprise(id, data);
      setEnterprises((prev) => prev.map((e) => (e.id === id ? res : e)));
      return res;
    } catch (err) {
      console.error(err);
      return null;
    }
  };

  const removeEnterprise = async (id: string) => {
    try {
      await api.deleteEnterprise(id);
      setEnterprises((prev) => prev.filter((e) => e.id !== id));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  };

  // Product CRUD
  const addProduct = async (enterpriseId: string, product: Partial<Product>) => {
    try {
      const res = await api.createProduct(enterpriseId, product);
      setEnterprises((prev) =>
        prev.map((e) => {
          if (e.id === enterpriseId) {
            return { ...e, products: [...e.products, res] };
          }
          return e;
        })
      );
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const updateProduct = async (enterpriseId: string, productId: string, data: Partial<Product>) => {
    try {
      const res = await api.updateProduct(enterpriseId, productId, data);
      setEnterprises((prev) =>
        prev.map((e) => {
          if (e.id === enterpriseId) {
            return {
              ...e,
              products: e.products.map((p) => (p.id === productId ? { ...p, ...res } : p)),
            };
          }
          return e;
        })
      );
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const removeProduct = async (enterpriseId: string, productId: string) => {
    try {
      await api.deleteProduct(enterpriseId, productId);
      setEnterprises((prev) =>
        prev.map((e) => {
          if (e.id === enterpriseId) {
            return { ...e, products: e.products.filter((p) => p.id !== productId) };
          }
          return e;
        })
      );
    } catch (err) {
      console.error(err);
    }
  };

  // User CRUD
  const addUser = async (userData: Partial<User>) => {
    try {
      const res = await api.createUser(userData as any);
      setUsers((prev) => [...prev, res]);
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const updateUser = async (id: string, data: Partial<User>) => {
    try {
      const res = await api.updateUser(id, data);
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...res } : u)));
      return res;
    } catch (err) {
      console.error(err);
    }
  };

  const removeUser = async (id: string) => {
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        enterprises,
        isAdmin,
        isOwner,
        myEnterprise,
        login,
        logout,
        addEnterprise,
        updateEnterprise,
        removeEnterprise,
        addProduct,
        updateProduct,
        removeProduct,
        addUser,
        updateUser,
        removeUser,
        categories,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
