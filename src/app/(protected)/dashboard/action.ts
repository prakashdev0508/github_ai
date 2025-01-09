"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "@/lib/gemini";
import { db } from "@/server/db";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();

  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  const result = await db.$queryRaw`
        SElECT "fileName" , "sourceCode" , "summary"  , 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector ) as "similarity"
        FROM "SourceCodeEmbedding" 
        WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector ) > 0.5
        AND "projectId" = ${projectId}
        ORDER BY "similarity" DESC
        LIMIT 10
    ` as {
    fileName: string;
    sourceCode: string;
    summery: string;
    similarity: number;
  }[];

  let context = "";

  for (const doc of result) {
    context += `source : ${doc.fileName} \ncode context : ${doc.sourceCode} \n summary : ${doc.summery} \n\n`;
  }

  (async () => {
    const { textStream } = await  streamText({
      model: google("gemini-1.5-pro"),
      prompt: `You are a code assistant who answers questions about the codebase. Your target audience is a technical intern who is looking to understand the codebase.

AI assistant is a brand new, powerful, human-like artificial intelligence. The traits of AI include expert knowledge, helpfulness, cleverness, and articulateness.

AI is a well-behaved and well-mannered individual. AI is always friendly, kind, and inspiring, and he is eager to provide vivid and thoughtful responses to the user.

AI has the sum of all knowledge in their brain, and is able to accurately answer nearly any question about any topic in conversation.

If the question is asking about code or a specific file, AI will provide the detailed answer, giving step-by-step instructions, including code snippets.

START CONTEXT BLOCK
${context}
END OF CONTEXT BLOCK.

START QUESTION
${question}
END OF QUESTION
`,
    });
 
    for await (const dalta of textStream) {
      stream.update(dalta);
    }
    stream.done()

  })();



  return { output: stream.value, fileName: result };
}
