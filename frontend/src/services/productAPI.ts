import { baseApi } from "./baseAPI";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query({
      query: ({ page = 1, status }) => {
        const params = new URLSearchParams();
        params.append("page", String(page));
        if (status) params.append("status", status);

        return `/products?${params.toString()}`;
      },
      providesTags: ["Products"],
    }),

    createProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Products"],
    }),

    deleteProduct: builder.mutation({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Products"],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productApi;
