import { baseApi } from "./baseAPI";

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    getDepartmentUsers: builder.query({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    createUsers: builder.mutation({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    updateUser: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users"],
    }),

    deleteUser: builder.mutation({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users"],
    }),
  }),
});

export const {
  useGetUsersQuery,
  useGetDepartmentUsersQuery,
  useCreateUsersMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userApi;
