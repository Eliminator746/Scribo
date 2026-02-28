import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants";
import type {
  LoginRequest,
  User,
  UserProfile,
  RegisterRequest,
  AuthResponse,
  UserUpdateRequest,
  Blog,
  BlogListResponse,
  BlogCreateRequest,
  BlogUpdateRequest,
  BlogDetailResponse,
  FilterParams,
} from "./types";

// Helper function to get CSRF token from cookie - ditto from documentation
function getCookie(name: string): string | null {
  let cookieValue: string | null = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

// Helper: build FormData only when needed
const buildFormData = (data: Record<string, any>) => {
  const formData = new FormData();

  Object.entries(data).forEach(([key, value]) => {
    if (value === undefined || value === null) return;

    if (Array.isArray(value)) {
      formData.append(key, JSON.stringify(value));
    } else {
      formData.append(key, value);
    }
  });

  return formData;
};

const baseQuery = fetchBaseQuery({
  baseUrl: BASE_URL,
  credentials: "include",
  prepareHeaders: (headers) => {
    const csrftoken = getCookie("csrftoken");
    if (csrftoken) {
      headers.set("X-CSRFToken", csrftoken);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["User", "Blog"],
  endpoints: (builder) => ({
    // ======================================================
    // AUTH
    // ======================================================

    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (body) => ({
        url: "/accounts/auth/register/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (body) => ({
        url: "/accounts/login/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    logout: builder.mutation<void, void>({
      query: () => ({
        url: "/accounts/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User", "Blog"],
    }),

    // ======================================================
    // USERS
    // ======================================================

    getCurrentUser: builder.query<User, void>({
      query: () => "/accounts/users/me/",
      providesTags: ["User"],
    }),

    updateCurrentUser: builder.mutation<User, UserUpdateRequest>({
      query: (body) => ({
        url: "/accounts/users/me/",
        method: "PATCH",
        body,
      }),
      invalidatesTags: ["User"],
    }),

    getUserByEmail: builder.query<User, string>({
      query: (email) => ({
        url: "/accounts/users/",
        params: { email },
      }),
      providesTags: ["User"],
    }),

    getUserByUsername: builder.query<UserProfile, string>({
      query: (username) => `/accounts/users/${username}/`,
      providesTags: ["User"],
    }),

    // ======================================================
    // BLOGS
    // ======================================================

    getBlogs: builder.query<Blog[], FilterParams | void>({
      query: () => ({
        url: "/blogs/",
      }),
      providesTags: ["Blog"],
    }),

    getBlogDetail: builder.query<BlogDetailResponse, string>({
      query: (slug) => `/blogs/${slug}/`,
      providesTags: ["Blog"],
    }),

    createBlog: builder.mutation<Blog, BlogCreateRequest>({
      query: (data) => ({
        url: "/blogs/",
        method: "POST",
        body: data.featured_image instanceof File ? buildFormData(data) : data,
      }),
      invalidatesTags: ["Blog"],
    }),

    updateBlog: builder.mutation<Blog, { id: number; data: BlogUpdateRequest }>(
      {
        query: ({ id, data }) => ({
          url: `/blogs/${id}/manage/`,
          method: "PATCH",
          body:
            data.featured_image instanceof File ? buildFormData(data) : data,
        }),
        invalidatesTags: ["Blog"],
      },
    ),

    deleteBlog: builder.mutation<void, number>({
      query: (id) => ({
        url: `/blogs/${id}/manage/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Blog"],
    }),
  }),
});

export const {
  // Auth
  useRegisterMutation,
  useLoginMutation,
  useLogoutMutation,

  // Users
  useGetCurrentUserQuery,
  useUpdateCurrentUserMutation,
  useGetUserByEmailQuery,
  useGetUserByUsernameQuery,

  // Blogs
  useGetBlogsQuery,
  useCreateBlogMutation,
  useGetBlogDetailQuery,
  useUpdateBlogMutation,
  useDeleteBlogMutation,
} = apiSlice;
