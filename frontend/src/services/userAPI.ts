import { baseApi } from "./baseAPI";

export type UserRole = "ADMIN" | "MANAGER" | "STAFF";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  departmentId?: string;
  department?: {
    name: string;
  };
}
export interface GroupedUsers {
  [deptName: string]: User[];
}

export const userApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    getDepartmentUsers: builder.query<User[], void>({
      query: () => "/users",
      providesTags: ["Users"],
    }),

    createUsers: builder.mutation<User, Partial<User>>({
      query: (data) => ({
        url: "/users",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Users", "Departments"],
    }),

    updateUser: builder.mutation<User, { id: string } & Partial<User>>({
      query: ({ id, ...data }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Users", "Departments", "Dashboard"],
    }),

    deleteUser: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Users", "Departments"],
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
