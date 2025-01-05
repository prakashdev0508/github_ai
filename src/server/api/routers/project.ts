import { z } from "zod";
import { createTRPCRouter  , protectedProcedure ,  } from "../trpc";

export const projectRouter = createTRPCRouter({
    createProject : protectedProcedure.input(z.object({
        name : z.string().nonempty(),
        githubUrl: z.string(),
        githubToken  : z.string().optional()

    })).mutation(async({  ctx , input })=>{
        ctx.user.userId
    })  
})