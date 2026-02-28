/**
 * @file types.ts
 * @description Centralized types for apiSlice, authSlice, and navbarSlice
 */

// ============================================================================
// AUTH SLICE TYPES
// ============================================================================

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  token?: string;
  [key: string]: any;
}

export interface AuthState {
  userInfo: UserInfo | null;
}

// ============================================================================
// NAVBAR SLICE TYPES
// ============================================================================

export type Theme = "light" | "dark";

export interface NavbarState {
  isSidebarOpen: boolean;
  theme: Theme;
}

// ============================================================================
// API SLICE - USER TYPES
// ============================================================================

export interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  job_title?: string;
  profile_picture?: string;
  profile_picture_url?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
}

export interface UserProfile extends User {
  created_at?: string;
  updated_at?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  detail: string;
  token?: string;
}

export interface UserUpdateRequest {
  username?: string;
  email?: string;
  bio?: string;
  job_title?: string;
  profile_picture_url?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
}

// ============================================================================
// API SLICE - BLOG/POST TYPES
// ============================================================================

export interface Blog {
  id: number;
  slug: string;
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: string;
  category: string;
  tags?: string[];
  author: User;
  created_at: string;
  updated_at: string;
  published: boolean;
  read_time?: number;
}

export interface BlogListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Blog[];
}

export interface BlogCreateRequest {
  title: string;
  content: string;
  excerpt?: string;
  featured_image?: File;
  category?: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogUpdateRequest {
  title?: string;
  content?: string;
  excerpt?: string;
  featured_image?: File;
  category?: string;
  tags?: string[];
  published?: boolean;
}

export interface BlogDetailResponse extends Blog {
  comments_count?: number;
}

// ============================================================================
// API ERROR TYPES
// ============================================================================

export interface ApiErrorResponse {
  detail?: string;
  [key: string]: any;
}

// ============================================================================
// PAGINATION TYPES
// ============================================================================

export interface PaginationParams {
  page?: number;
  page_size?: number;
  limit?: number;
  start?: number;
}

export interface FilterParams extends PaginationParams {
  search?: string;
  category?: string;
  author?: string;
  published?: boolean;
}
