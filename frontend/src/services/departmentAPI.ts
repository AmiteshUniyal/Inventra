import { baseApi } from "./baseAPI";

export interface Department {
  id: string;
  name: string;
  managerId: string;
  manager?: {
    name: string;
  };
  _count?: {
    products: number;
  };
}

export interface CreateDepartmentPayload {
  name: string;
  managerId: string;
}

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDepartments: builder.query<Department[], void>({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),

    createDepartment: builder.mutation<Department, CreateDepartmentPayload>({
      query: (data) => ({
        url: "/departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    updateDepartment: builder.mutation<Department, { id: string } & CreateDepartmentPayload>({
      query: ({ id, ...data }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    deleteDepartment: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/departments/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Departments"],
    }),
  }),
});

export const {
  useGetDepartmentsQuery,
  useCreateDepartmentMutation,
  useUpdateDepartmentMutation,
  useDeleteDepartmentMutation,
} = departmentApi;
