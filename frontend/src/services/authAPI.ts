import { baseApi } from "./baseAPI";

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    me: builder.query({
        query: () => "/auth/me",
    }),

    login: builder.mutation({
        query: (data) => ({
            url: "/auth/login",
            method: "POST",
            body: data,
        })
    }),

    logout: builder.mutation({
        query: () =>({
            url: "/auth/logout",
            method: "POST",
        }),
    }),

    createStore: builder.mutation({
        query: (data) =>({
            url: "/auth/create-store",
            method: "POST",
            body: data,
        })
    })
  })
});

export const { useMeQuery, useLazyMeQuery, useLoginMutation, useLogoutMutation, useCreateStoreMutation } = authApi;