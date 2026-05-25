import axios, { AxiosRequestConfig } from "axios";
import type { Enterprise, Product, User, Category, CategoryItem } from "../types";

const API_BASE = import.meta.env.VITE_API_URL;

const client = axios.create({ baseURL: API_BASE + "/api" });

// Queue for requests that receive 401 and should be replayed after login
type QueuedRequest = {
  config: AxiosRequestConfig;
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
};

let failedQueue: QueuedRequest[] = [];

client.interceptors.response.use(
  (res) => res,
  (err) => {
    const { response, config } = err || {};
    if (response && response.status === 401 && config) {
      return new Promise((resolve, reject) => {
        failedQueue.push({ config, resolve, reject });
      });
    }
    return Promise.reject(err);
  }
);

export function replayFailedRequests() {
  const queue = failedQueue.slice();
  failedQueue = [];
  queue.forEach(({ config, resolve, reject }) => {
    client
      .request(config)
      .then((r) => resolve(r.data))
      .catch((e) => reject(e));
  });
}

export async function getCategories(): Promise<Category[]> {
  const res = await client.get("/categories");
  return res.data;
}

export async function getCategoryObjects(): Promise<CategoryItem[]> {
  const res = await client.get("/categories", { params: { format: "objects" } });
  return res.data;
}

export async function createCategory(payload: {
  name: string;
  color?: string | null;
  emoji?: string | null;
}): Promise<CategoryItem> {
  const res = await client.post("/categories", payload);
  return res.data;
}

export async function updateCategory(
  id: string,
  payload: { name: string; color?: string | null; emoji?: string | null },
): Promise<CategoryItem> {
  const res = await client.put(`/categories/${id}`, payload);
  return res.data;
}

export async function deleteCategory(id: string): Promise<{ ok: true }> {
  const res = await client.delete(`/categories/${id}`);
  return res.data;
}

export async function getEnterprises(): Promise<Enterprise[]> {
  const res = await client.get("/enterprises");
  return res.data;
}

export async function getEnterprise(id: string): Promise<Enterprise> {
  const res = await client.get(`/enterprises/${id}`);
  return res.data;
}

export async function createEnterprise(payload: Partial<Enterprise>) {
  const res = await client.post(`/enterprises`, payload);
  return res.data;
}

export async function updateEnterprise(id: string, payload: Partial<Enterprise>) {
  const res = await client.put(`/enterprises/${id}`, payload);
  return res.data;
}

export async function deleteEnterprise(id: string) {
  const res = await client.delete(`/enterprises/${id}`);
  return res.data;
}

export async function createProduct(entId: string, payload: Partial<Product>) {
  const res = await client.post(`/enterprises/${entId}/products`, payload);
  return res.data;
}

export async function updateProduct(entId: string, prodId: string, payload: Partial<Product>) {
  const res = await client.put(`/enterprises/${entId}/products/${prodId}`, payload);
  return res.data;
}

export async function deleteProduct(entId: string, prodId: string) {
  const res = await client.delete(`/enterprises/${entId}/products/${prodId}`);
  return res.data;
}

export async function getUsers(): Promise<User[]> {
  const res = await client.get(`/users`);
  return res.data;
}

export async function createUser(payload: Partial<User>) {
  const res = await client.post(`/users`, payload);
  return res.data;
}

export async function updateUser(id: string, payload: Partial<User>) {
  const res = await client.put(`/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: string) {
  const res = await client.delete(`/users/${id}`);
  return res.data;
}

export async function login(email: string, password: string) {
  const res = await client.post(`/login`, { email, password });
  return res.data;
}
