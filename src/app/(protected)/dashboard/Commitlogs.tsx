"use client";
import useProjects from "@/hooks/use-projects";
import { cn } from "@/lib/utils";
import { api } from "@/trpc/react";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import React from "react";

const Commitlogs = () => {
  const { projectId, selectedProject } = useProjects();

  const { data: commitDataLogs } = api.project.getCommitsLogs.useQuery({
    projectId,
  });

  return (
    <div>
      <ul className="space-y-6">
        {commitDataLogs &&
          commitDataLogs.map((commit, commitIndex) => (
            <li key={commit.id} className="relative flex gap-x-4">
              <div
                className={cn(
                  commitIndex === commitDataLogs.length - 1
                    ? "h-6"
                    : "-bottom-6",
                  "absolute left-0 top-0 flex w-6 justify-center",
                )}
              >
                <div className="w-px translate-x-1 bg-gray-200"></div>
              </div>
              <>
                <img
                  src={commit.commitAutherAvatar}
                  alt=" commit avatar "
                  className="relative mt-4 size-8 flex-none rounded-full bg-gray-50"
                />
                <div className="flex-auto rounded-md bg-white p-3 ring-1 ring-inset ring-gray-200">
                  <div className="flex justify-between gap-x-4">
                    <Link
                      target="_blank"
                      href={`${selectedProject?.githubUrl}/commits/${commit.commitHash}`}
                      className="py-0.5 text-sm leading-5"
                    >
                      <span className="font-medium text-gray-900">
                        {" "}
                        {commit.commitAutherName}{" "}
                      </span>
                      <span className="inline-flex items-center">
                        Commited
                        <ExternalLink className="ml-1 size-4" />
                      </span>
                    </Link>
                  </div>
                  <span className="font-semibold">
                    {" "}
                    {commit.commitMessage}{" "}
                  </span>
                  <pre className="mt-2 whitespace-pre-wrap text-sm leading-6 text-gray-500">
                    {""}
                    {commit.summary}{" "}
                  </pre>
                </div>
              </>
            </li>
          ))}
      </ul>
    </div>
  );
};

export default Commitlogs;
