import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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
});
