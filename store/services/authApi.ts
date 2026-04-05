import { api } from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({

    /* 🔐 LOGIN */
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "token/",
        method: "POST",
        body: credentials,
      }),
    }),

    /* 👤 REGISTER */
    register: builder.mutation({
      query: (data: {
        first_name: string;
        last_name: string;
        username: string;
        email: string;
        password: string;
      }) => ({
        url: "auth/register/",
        method: "POST",
        body: data,
      }),
    }),

    /* 👤 PROFILE */
    getProfile: builder.query({
      query: () => ({
        url: "profile/",
        method: "GET",
      }),
    }),

  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,   // ✅ ADD THIS
  useGetProfileQuery,
  useLazyGetProfileQuery
} = authApi;