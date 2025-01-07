import { db } from "@/server/db";
import { Octokit } from "octokit";

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

const githubUrl = " https://github.com/joschan21/pingpanda";

type Response = {
  commitHash: String;
  commitMessage: String;
  commitDate: Date;
  commitAutherName: String;
  commitAutherAvatar: String;
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

  return sortedData.slice(0, 5).map((commit: any) => {
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

export const summerizeCommits = async (githubUrl: string, commitHash: string) => {


}

export const filterProcessedCommits = async (
  projectId: string,
  commits: Response[],
) => {
  const processedCommits = await db.commits.findMany({
    where: {
      projectId: projectId,
    },
  });

  const unprocessedCommits = commits.filter((commit) => {
    return !processedCommits.some((c) => c.commitHash === commit.commitHash);
  });

  return unprocessedCommits;
};
