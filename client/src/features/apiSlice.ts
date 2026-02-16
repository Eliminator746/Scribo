import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "@/constants";

interface LoginRequest {
  email: string;
  password: string;
}

interface User {
  id: string;
  username: string;
  email: string;
  bio?: string;
  job_title?: string;
  profile_picture_url?: string;
  linkedin?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  instagram?: string;
}

interface LoginResponse {
  detail: string;
}

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
  tagTypes: ["Product", "Order", "User"],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/accounts/login/",
        method: "POST",
        body: credentials,
      }),
    }),
    logout: builder.mutation<LoginResponse, void>({
      query: () => ({
        url: "/accounts/logout/",
        method: "POST",
      }),
      invalidatesTags: ["User"],
    }),
    getCurrentUser: builder.query<User, void>({
      query: () => "/accounts/users/me/",
      providesTags: ["User"],
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useGetCurrentUserQuery } =
  apiSlice;
