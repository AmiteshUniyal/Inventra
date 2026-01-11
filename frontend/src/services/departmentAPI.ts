import { baseApi } from "./baseAPI";

export const departmentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({

    getDepartments: builder.query({
      query: () => "/departments",
      providesTags: ["Departments"],
    }),

    createDepartment: builder.mutation({
      query: (data) => ({
        url: "/departments",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    updateDepartment: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/departments/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Departments"],
    }),

    deleteDepartment: builder.mutation({
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
