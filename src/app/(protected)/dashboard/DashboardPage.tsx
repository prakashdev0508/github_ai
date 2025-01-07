"use client";

import useProjects from "@/hooks/use-projects";
import { useUser } from "@clerk/nextjs";
import { ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";

const DashboardPage = () => {
  const { user } = useUser();
  const { selectedProject, projectId } = useProjects();

  return (
    <div>
      {selectedProject && (
        <div className="flex flex-wrap items-center justify-between gap-y-4">
          <div className="flex w-fit items-center rounded bg-blue-600 px-4 py-3">
            <Github className="size-5 text-white" />
            <div className="ml-2 text-white">
              This project is link to{" "}
              <Link
                href={`${selectedProject?.githubUrl}`}
                className="inline-flex items-center text-white/80 hover:text-white/90 hover:underline"
                target="_blank"
              >
                {" "}
                {selectedProject?.githubUrl}{" "}
                <ExternalLink className="ml-1 size-4" />
              </Link>
            </div>
          </div>
          <div>
            <div className="flex items-center">
              Team member Invite butoon Archive button
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
