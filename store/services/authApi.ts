import { api } from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    login: builder.mutation({
      query: (credentials) => ({
        url: "token/",
        method: "POST",
        body: credentials,
      }),
    }),

    register: builder.mutation({
      query: (data) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
      }),
    }),

    getProfile: builder.query({
      query: () => ({
        url: "profile/",
        method: "GET",
      }),
    }),

    // ✅ LOGOUT ADD
    logout: builder.mutation({
      query: () => ({
        url: "auth/logout/",
        method: "POST",
        credentials: "include",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useLazyGetProfileQuery,
  useLogoutMutation // ✅ ADD THIS
} = authApi;