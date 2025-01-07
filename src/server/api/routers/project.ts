import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { pollcommits } from "@/lib/github";

export const projectRouter = createTRPCRouter({
  createProject: protectedProcedure
    .input(
      z.object({
        name: z.string().nonempty(),
        githubUrl: z.string().url(),
        githubToken: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.db.project.create({
        data: {
          name: input.name,
          githubUrl: input.githubUrl,
          gihubKey: input.githubToken,
          usertoProject: {
            create: {
              userId: ctx.user.userId!,
            },
          },
        },
      });
      await pollcommits(project?.id);
      return true;
    }),

  getProjects: protectedProcedure.query(async ({ ctx }) => {
    const projects = await ctx.db.project.findMany({
      where: {
        usertoProject: {
          some: {
            userId: ctx.user.userId!,
          },
        },
        deletedAt: null,
      },
    });

    return projects;
  }),
  getCommitsLogs: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      pollcommits(input.projectId).then().catch(console.error);
      const commitsLogs = await ctx.db.commits.findMany({
        where: {
          projectId: input.projectId,
        },
      });
      return commitsLogs;
    }),
});
