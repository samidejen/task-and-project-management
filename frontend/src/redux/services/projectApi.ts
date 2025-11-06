import { baseApi } from "./baseApi";
import type { Project, CreateProjectDto } from "../../../types/project";

export const projectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProjects: builder.query<Project[], void>({
      query: () => "/projects",
      providesTags: ["Project"],
    }),
    createProject: builder.mutation<Project, CreateProjectDto>({
      query: (body) => ({
        url: "/projects",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Project"],
    }),
  }),
});

export const { useGetProjectsQuery, useCreateProjectMutation } = projectApi;
