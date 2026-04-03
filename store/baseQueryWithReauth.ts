import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
} from "@reduxjs/toolkit/query";
import { setCredentials, logout } from "./slices/authSlice/authSlice";

const isFetchBaseQueryError = (
  error: unknown
): error is FetchBaseQueryError =>
  !!error &&
  typeof error === "object" &&
  "status" in error &&
  typeof (error as FetchBaseQueryError).status === "number";

const baseQuery = fetchBaseQuery({
  baseUrl:process.env.NEXT_PUBLIC_API_URL,
  credentials: "include",
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as any).auth.token;

    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    return headers;
  },
});

export const baseQueryWithReauth: BaseQueryFn<
  string | FetchArgs,
  unknown,
  FetchBaseQueryError
> = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

 
 if (
  isFetchBaseQueryError(result.error) &&
  (result.error.status === 401 || result.error.status === 403)
) {
    const refreshResult = await baseQuery(
      {
        url: "token/refresh/",
        method: "POST",
      },
      api,
      extraOptions
    );

    if (refreshResult.data) {
      const access = (refreshResult.data as { access: string }).access;

      api.dispatch(
        setCredentials({
          user: null,
          token: access,
        })
      );

      result = await baseQuery(
        typeof args === "string"
          ? {
              url: args,
              headers: {
                Authorization: `Bearer ${access}`,
              },
            }
          : {
              ...args,
              headers: {
                ...(args.headers || {}),
                Authorization: `Bearer ${access}`,
              },
            },
        api,
        extraOptions
      );
    } else {
      api.dispatch(logout());
    }
  }

  return result;
};