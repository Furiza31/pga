import { useAuthStore } from "@/stores/auth";

const API_BASE_URL = "/api";

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = "ApiError";
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const authStore = useAuthStore();

  const headers = new Headers(options.headers);

  if (authStore.token) {
    headers.set("Authorization", `Bearer ${authStore.token}`);
  }

  headers.set("Content-Type", "application/json");

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(
      response.status,
      data.message || "Unknown error occurred"
    );
  }

  return data;
}
