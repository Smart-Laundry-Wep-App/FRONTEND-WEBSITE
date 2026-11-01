/**
 * SCA Smart Laundry - API Client Utility
 * Terkonfigurasi dengan Base URL dari NEXT_PUBLIC_API_URL
 */

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const TOKEN_KEY = "sca_auth_token";
const USER_KEY = "sca_auth_user";

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta?: any;
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
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestOptions = {}
): Promise<ApiResponse<T>> {
  const { params, headers, ...restOptions } = options;

  // Build full URL
  const normalizedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  let url = `${API_BASE_URL}${normalizedEndpoint}`;

  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, val]) => {
      if (val !== undefined && val !== null && val !== "") {
        searchParams.append(key, String(val));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += (url.includes("?") ? "&" : "?") + queryString;
    }
  }

  // Build headers
  const token = getAuthToken();
  const requestHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  // If body is not FormData, default to application/json
  if (restOptions.body && !(restOptions.body instanceof FormData)) {
    requestHeaders["Content-Type"] = "application/json";
  }

  // Merge headers
  const mergedHeaders = {
    ...requestHeaders,
    ...(headers as Record<string, string> || {}),
  };

  try {
    const response = await fetch(url, {
      ...restOptions,
      headers: mergedHeaders,
    });

    const contentType = response.headers.get("content-type");
    let result: any = null;

    if (contentType && contentType.includes("application/json")) {
      result = await response.json();
    } else {
      const text = await response.text();
      result = { success: response.ok, message: text, data: null };
    }

    if (!response.ok) {
      const errorMessage =
        result?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const error: any = new Error(errorMessage);
      error.status = response.status;
      error.data = result;
      throw error;
    }

    return result as ApiResponse<T>;
  } catch (err: any) {
    // If it's network/CORS error
    if (err.name === "TypeError" && err.message.includes("fetch")) {
      throw new Error(
        "Gagal terhubung ke server backend. Pastikan server backend sedang berjalan di http://localhost:5000"
      );
    }
    throw err;
  }
}

// REST methods helpers
export const api = {
  get: <T = any>(endpoint: string, options?: RequestOptions) =>
    apiRequest<T>(endpoint, { ...options, method: "GET" }),

  post: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  put: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
    apiRequest<T>(endpoint, {
      ...options,
      method: "PUT",
      body: body instanceof FormData ? body : JSON.stringify(body),
    }),

  patch: <T = any>(endpoint: string, body?: any, options?: RequestOptions) =>
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
    return api.get("/health");
  },
};

export default api;
