/**
 * SCA Smart Laundry - API Client Utility
 * Terkonfigurasi dengan Base URL dari NEXT_PUBLIC_API_URL
 */

export const API_BASE_URL =
  (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/+$/, "");

const TOKEN_KEY = "sca_auth_token";
const USER_KEY = "sca_auth_user";

export function normalizeBackendError(message?: string | null): string {
  const rawMessage = message?.trim();
  if (!rawMessage) return "Backend belum dapat memproses permintaan.";
  if (/ECONNREFUSED|Failed to fetch|fetch failed|NetworkError|TypeError/i.test(rawMessage)) {
    return `Tidak dapat terhubung ke backend di ${API_BASE_URL}. Pastikan API aktif dan CORS mengizinkan frontend.`;
  }
  if (/doesn't exist|unknown table|no such table/i.test(rawMessage)) {
    return "Tabel database belum tersedia. Jalankan migrasi database backend terlebih dahulu.";
  }
  return rawMessage;
}

// Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data: T;
  errors?: unknown;
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  email: string;
  role: string;
  phone?: string;
  branch?: string;
  avatar?: string;
}

export interface LoginResponseData {
  token: string;
  user: UserProfile;
}

export interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly data: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Token & Session Storage Helpers (Client-side safe)
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(TOKEN_KEY);
};

export const getAuthUser = (): UserProfile | null => {
  if (typeof window === "undefined") return null;
  const userJson = localStorage.getItem(USER_KEY);
  if (!userJson) return null;
  try {
    return JSON.parse(userJson) as UserProfile;
  } catch {
    return null;
  }
};

export const setAuthSession = (token: string, user: UserProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const setAuthUser = (user: UserProfile): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const clearAuthSession = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};

export const isAuthenticated = (): boolean => {
  return Boolean(getAuthToken());
};

/**
 * Core HTTP Request Wrapper using native fetch
 */
export async function apiRequest<T = unknown>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  // Build full URL
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = new URL(`${API_BASE_URL}${normalizedEndpoint}`);

  if (params) {
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        url.searchParams.set(key, String(val));
      }
    });
  }

  // Build headers
  const token = getAuthToken();
  const requestHeaders = new Headers(headers);
  requestHeaders.set("Accept", "application/json");
  if (token) requestHeaders.set("Authorization", `Bearer ${token}`);

  if (
    restOptions.body &&
    typeof FormData !== "undefined" &&
    !(restOptions.body instanceof FormData)
  ) {
    requestHeaders.set("Content-Type", "application/json");
  }

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: requestHeaders,
    });

    const contentType = response.headers.get("content-type");
    const result: unknown = contentType?.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const apiResult = result && typeof result === "object"
        ? result as { message?: unknown }
        : null;
      throw new ApiError(
        typeof apiResult?.message === "string"
          ? apiResult.message
          : `HTTP Error ${response.status}: ${response.statusText}`,
        response.status,
        result,
      );
    }

    if (!result || typeof result !== "object" || !("success" in result)) {
      throw new Error("Respons backend tidak sesuai format API.");
    }

    return result as ApiResponse<T>;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof TypeError) {
      throw new Error(
        `Gagal terhubung ke backend di ${API_BASE_URL}. Pastikan backend aktif dan CORS mengizinkan origin frontend.`,
      );
    }
    throw error;
  }
}

// REST methods helpers
export const api = {
  get: <T = unknown>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = unknown>(endpoint: string, body?: unknown, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  delete: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "DELETE" }),
};

// Specialized Auth Service
export const authApi = {
  login: async (credentials: {
    identifier?: string;
    username?: string;
    email?: string;
    password: string;
  }) => {
    const response = await api.post<LoginResponseData>("/auth/login", credentials);
    if (response.data?.token && response.data?.user) {
      setAuthSession(response.data.token, response.data.user);
    }
    return response;
  },

  register: async (payload: {
    name: string;
    email: string;
    username: string;
    password: string;
    phone?: string;
    role?: string;
  }) => {
    const response = await api.post<LoginResponseData>("/auth/register", payload);
    if (response.data?.token && response.data?.user) {
      setAuthSession(response.data.token, response.data.user);
    }
    return response;
  },

  getMe: async () => {
    return api.get<UserProfile>("/auth/me");
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      clearAuthSession();
    }
  },

  checkHealth: async () => {
    return api.get<{ status: string }>("/health");
  },
};

export default api;
