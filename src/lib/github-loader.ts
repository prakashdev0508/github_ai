import { GithubRepoLoader } from "@langchain/community/document_loaders/web/github";
import { Document } from "@langchain/core/documents";
import { generateEmbedding, summeriseCode } from "./gemini";
import { db } from "@/server/db";

export const loadGithubRepo = async (
  githubUrl: string,
  githubToken?: string,
  branch?: string,
) => {
  const loader = new GithubRepoLoader(githubUrl, {
    accessToken: githubToken ?? process.env.GITHUB_TOKEN,
    branch: branch ?? "main",
    ignoreFiles: [
      ".gitignore",
      "package.json",
      "package-lock.json",
      "node_modules",
      "yarn.lock",
      "pnpm-lock.yml",
      "bun.lockb",
    ],
    recursive: true,
    unknown: "warn",
    maxConcurrency: 5,
  });

  const docs = await loader.load();
  return docs;
};

export const indexGithubRepo = async (
  projectId: string,
  githubUrl: string,
  githubToken?: string,
  branch?: string,
) => {
  const docs = await loadGithubRepo(githubUrl, githubToken, branch);
  console.log("docs", docs);
  const allEmbeddings = await generateEmbeddings(docs);

  await Promise.allSettled(
    allEmbeddings.map(async (embedding, index) => {

      if (!embedding) return;

      const sourceCodeEmbedding = await db.sourceCodeEmbedding.create({
        data: {
          summary: embedding.summeryCode,
          sourceCode: embedding.sourceCode,
          fileName: embedding.fileName,
          projectId: projectId,
        },
      });

      await db.$executeRaw`
      UPDATE "SourceCodeEmbedding" SET "summaryEmbedding" = ${embedding.embedding} :: vector
      WHERE "id" = ${sourceCodeEmbedding.id}
      `;
    }),
  );
};

export const generateEmbeddings = async (docs: Document[]) => {
  const embeddings = await Promise.all(
    docs.map(async (doc) => {
      const summeryCode = await summeriseCode(doc);
      const embedding = await generateEmbedding(summeryCode);
      return {
        summeryCode,
        embedding,
        sourceCode: JSON.stringify(doc.pageContent),
        fileName: doc.metadata.source,
      };
    }),
  );
  return embeddings;
};
