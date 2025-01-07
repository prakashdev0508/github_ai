"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useRefetch from "@/hooks/use-refetch";
import { api } from "@/trpc/react";
import { on } from "events";
import Image from "next/image";
import React, { useState } from "react";
import { toast } from "sonner";

const CreateProject = () => {
  const [githubUrl, setGithubUrl] = useState("");
  const [githubToken, setGithubToken] = useState("");
  const [name, setName] = useState("");

  const refetch = useRefetch();

  const clearForm = () => {
    setGithubUrl("");
    setGithubToken("");
    setName("");
  };

  const createProjects = api.project.createProject.useMutation();

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    createProjects.mutate(
      {
        name,
        githubUrl,
        githubToken,
      },
      {
        onSuccess: () => {
          toast.success("Project created successfully");
          refetch();
          clearForm();
        },
        onError: (error) => {
          toast.error(
            error.data?.zodError?.fieldErrors
              ? JSON.stringify(error.data?.zodError?.fieldErrors)
              : error.message,
          );
        },
      },
    );
  };

  return (
    <div className="flex h-[80vh] items-center justify-center">
      <Image
        src={"/images/gihub_undraw.png"}
        height={80}
        width={220}
        alt="github_img"
      />
      <div className="ml-12 w-96">
        <div>
          <h1 className="text-2xl font-semibold">
            {" "}
            <b>Link your GitHub Repository</b>{" "}
          </h1>
          <p className="text-sm text-muted-foreground">
            Enter the URL of your GitHub repository
          </p>
        </div>
        <div className="mb-2"></div>
        <form onSubmit={handleSubmit}>
          <div>
            <Input
              type="text"
              placeholder="Project Name"
              className="mb-2"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="GitHub URL"
              className="mb-2"
              value={githubUrl}
              required
              onChange={(e) => setGithubUrl(e.target.value)}
            />
          </div>
          <div>
            <Input
              type="text"
              placeholder="GitHub Token (for private repo)"
              className="mb-2"
              value={githubToken}
              onChange={(e) => setGithubToken(e.target.value)}
            />
          </div>
          <div>
            <Button
              type="submit"
              className={`mt-2 w-96 ${createProjects.isPending ? "cursor-not-allowed bg-blue-500" : "cursor-pointer bg-blue-600"} text-white hover:bg-blue-700`}
              variant={"default"}
              disabled={createProjects.isPending}
            >
              {createProjects.isPending
                ? "Creating Project..."
                : "Create Project"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateProject;
