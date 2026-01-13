import { baseApi } from "./baseAPI";

export type StockStatus = "IN_STOCK" | "LOW_STOCK" | "OUT_OF_STOCK";

export interface Product {
  id: string;
  name: string;
  productCode: string;
  quantity: number;
  status: StockStatus;
  departmentId: string;
  department?: {
    name: string;
  };
}

export interface PaginatedProducts {
  items: Product[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductPayload {
  name: string;
  productCode: string;
  quantity: number;
  departmentId: string;
}


export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<PaginatedProducts, { page?: number; status?: string }>({
      query: ({ page = 1, status }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        if (status) params.append("status", status);
        return `/products?${params.toString()}`;
      },
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation<Product, ProductPayload>({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),

    updateProduct: builder.mutation<Product, { id: string } & Partial<ProductPayload>>({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),

    deleteProduct: builder.mutation<{ success: boolean }, string>({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products", "Dashboard"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
