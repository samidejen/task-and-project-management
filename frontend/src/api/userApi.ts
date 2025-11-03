import { baseApi } from "./baseApi";
import type { User } from "../../types/user";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["User"],
    }),

    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      providesTags: ["User"],
    }),

    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),
  }),
});

export const { useGetUsersQuery, useGetUserByIdQuery, useDeleteUserMutation } =
  userApi;
