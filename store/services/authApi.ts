import { url } from "inspector";
import { api } from "../api";

export const authApi = api.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (credentials: { email: string; password: string }) => ({
        url: "token/",
        method: "POST",
        body: credentials,
      }),
    }),
   getProfile: builder.query({
  query: () => ({
    url: "profile/",
    method: "GET",
  }),
}),
  }),
});

export const { useLoginMutation,useGetProfileQuery,useLazyGetProfileQuery } = authApi;