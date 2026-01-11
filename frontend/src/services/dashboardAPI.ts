import { baseApi } from "./baseAPI";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query({
      query: () => "/dashboard/overview",
      providesTags: ["Dashboard"],
    }),

    getDepartmentDashboard: builder.query({
      query: (departmentId: string) => `/dashboard/department/${departmentId}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetOverviewQuery, useGetDepartmentDashboardQuery } = dashboardApi;
