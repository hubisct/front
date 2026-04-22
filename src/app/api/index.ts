import axios from "axios";
import type { Enterprise, Product, User, Category } from "../types";

const API_BASE = "https://api-vitrine.brizzigui.com";

const client = axios.create({ baseURL: API_BASE + "/api" });

export async function getCategories(): Promise<Category[]> {
  const res = await client.get("/categories");
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

export async function login(email: string, password: string) {
  const res = await client.post(`/login`, { email, password });
  return res.data;
}
