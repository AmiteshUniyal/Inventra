import { baseApi } from "./baseAPI";
interface DepartmentStats {
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
}

interface Department {
  departmentId: string;
  departmentName: string;
  stats: DepartmentStats;
}

interface OverviewData {
  summary: {
    totalProducts: number;
  };
  departments: Department[];
}

export interface DepartmentDetail {
  departmentId: string;
  departmentName: string;
  inStock: number;
  lowStock: number;
  outOfStock: number;
  totalProducts: number;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOverview: builder.query<OverviewData, void>({
      query: () => "/dashboard/overview",
      providesTags: ["Dashboard"],
    }),

    
    getDepartmentDashboard: builder.query<DepartmentDetail, string>({
      query: (departmentId: string) => `/dashboard/department/${departmentId}`,
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetOverviewQuery, useGetDepartmentDashboardQuery } = dashboardApi;