import { baseApi } from "./baseApi";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
} from "../../../types/user";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
        credentials: "include", // send httpOnly cookie
      }),
    }),
    register: builder.mutation<void, RegisterRequest>({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
        credentials: "include", // send httpOnly cookie
      }),
    }),
    getMe: builder.query<User, void>({
      query: () => ({
        url: `${import.meta.env.VITE_API_URL}/auth/me`,
        method: "GET",
        credentials: "include",
      }),
    }),
  }),
});

export const { useLoginMutation, useRegisterMutation, useGetMeQuery } = authApi;
