import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { baseQueryWithReauth } from "./baseQueryWithReauth";

export const api = createApi({
  reducerPath: "api",

  baseQuery:baseQueryWithReauth,
    tagTypes: ['Workspaces','ProjectMembers','Tasks'],

  endpoints: () => ({}),
});