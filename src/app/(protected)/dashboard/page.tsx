import React from "react";
import DashboardPage from "./DashboardPage";
import { getCommits } from "@/lib/github";
import { summerizeCommits, pollcommits } from "@/lib/github";
import useProjects from "@/hooks/use-projects";
import Commitlogs from "./Commitlogs";

const page = async () => {
  return (
    <div>
      <div>
        <DashboardPage />
      </div>
      <div className="mt-8">
        <Commitlogs />
      </div>
    </div>
  );
};

export default page;
