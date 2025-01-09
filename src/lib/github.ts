import { db } from "@/server/db";
import { Octokit } from "octokit";
import { aisummeriseCommit } from "./gemini";
import axios from "axios";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

type Response = {
  commitHash: string;
  commitMessage: string;
  commitDate: Date;
  commitAutherName: string;
  commitAutherAvatar: string;
};


export const getCommits = async (githubUrl: string) => {
  const [owner, repo] = githubUrl.split("/").slice(-2);

  if (!owner || !repo) {
    throw new Error("Invalid GitHub URL");
  }

  const { data } = await octokit.rest.repos.listCommits({
    owner: owner,
    repo: repo,
  });

  const sortedData = data?.sort((a: any, b: any) => {
    return (
      new Date(b.commit.author.date).getTime() -
      new Date(a.commit.author.date).getTime()
    );
  });

  return sortedData.map((commit: any) => {
    return {
      commitHash: commit.sha as string,
      commitMessage: commit.commit.message ?? "",
      commitDate: commit.commit.author.date ?? "",
      commitAutherName: commit.author.login ?? "",
      commitAutherAvatar: commit.author.avatar_url ?? "",
    };
  });
};

export const pollcommits = async (projectId: string) => {
  const { githubUrl, project } = await fetchProjectGithubUrl(projectId);
  const commits = await getCommits(githubUrl);
  const unprocessedCommits = await filterProcessedCommits(projectId, commits);

  const summeriseResponse = await Promise.allSettled(
    unprocessedCommits.map((commit) => {
      return summerizeCommits(githubUrl, commit.commitHash);
    }),
  );

  const summery = summeriseResponse.map((response) => {
    if (response.status == "fulfilled") {
      return response.value as string;
    }
    return "";
  });

  const commit = await db.commits.createMany({
    data: summery.map((summery, index) => {
      return {
        projectId: projectId ?? "",
        commitHash: unprocessedCommits[index]?.commitHash ?? "",
        commitAutherName: unprocessedCommits[index]?.commitAutherName ?? "",
        commitAutherAvatar: unprocessedCommits[index]?.commitAutherAvatar ?? "",
        commitDate: unprocessedCommits[index]?.commitDate ?? new Date(),
        commitMessage: unprocessedCommits[index]?.commitMessage ?? "",
        summary: summery,
      };
    }),
  });

  return commit;
};

export const fetchProjectGithubUrl = async (projectId: string) => {
  const project = await db.project.findFirst({
    where: {
      id: projectId,
    },
  });

  if (!project) {
    throw new Error("Project not found");
  }

  return {
    githubUrl: project.githubUrl,
    project: project,
  };
};

export const summerizeCommits = async (
  githubUrl: string,
  commitHash: string,
) => {
  const { data } = await axios.get(`${githubUrl}/commit/${commitHash}.diff`, {
    headers: {
      Accept: "application/vnd.github.v3.diff",
    },
  });

  const summerisecommitData = ( aisummeriseCommit(data)) || "";
  console.log( "summary" , summerisecommitData);
  return summerisecommitData;
};

export const filterProcessedCommits = async (
  projectId: string,
  commits: Response[],
) => {
  const processedCommits = await db.commits.findMany({
    where: {
      projectId: projectId,
    },
  });

  const unprocessedCommits = commits
    .filter((commit) => {
      return !processedCommits.some((c) => c.commitHash === commit.commitHash);
    })
    .slice(0, 5);

  return unprocessedCommits;
};
