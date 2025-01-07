import { api } from "@/trpc/react";
import { useLocalStorage } from "usehooks-ts";

const useProjects = () => {
  const { data: projects } =  api.project.getProjects.useQuery();

  const [projectId, setProjectId] = useLocalStorage("githubai_projectId", "");
  const selectedProject = projects?.find((project) => project.id === projectId);

  return {
    projects,
    selectedProject,
    projectId,
    setProjectId,
  };
};

export default useProjects;
