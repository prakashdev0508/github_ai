"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useProjects from "@/hooks/use-projects";
import React from "react";
import { askQuestion } from "./action";
import { readStreamableValue } from "ai/rsc";
import MDeditor from "@uiw/react-md-editor";
import CodeRefercnce from "./CodeRefercnce";

const QuestionCard = () => {
  const [question, setQuestion] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const { selectedProject, projectId } = useProjects();
  const [loading, setLoading] = React.useState(false);
  const [fileReference, setFileReference] = React.useState<
    {
      fileName: string;
      sourceCode: string;
      summery: string;
      similarity: number;
    }[]
  >([]);
  const [answer, setAnswer] = React.useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    setAnswer("");
    setFileReference([]);

    event.preventDefault();
    if (!selectedProject) return;
    setLoading(true);

    const { output, fileName } = await askQuestion(question, projectId);
    setOpen(true);
    setFileReference(fileName);
    for await (const delta of readStreamableValue(output)) {
      if (delta) {
        setAnswer((prev) => prev + delta);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <Dialog
        open={open}
        onOpenChange={() => {
          setOpen(false);
          setAnswer("");
          setFileReference([]);
          setLoading(false);
        }}
      >
        <DialogContent className="bg-white sm:max-w-[70vw] max-h-[90vh]">
          <DialogTitle> Github ai </DialogTitle>
          <div>

          <MDeditor.Markdown
            source={answer}
            className="no-scrollbar !h-full  max-h-[60vh] max-w-[90vw] overflow-scroll bg-white"
            style={{
              whiteSpace: "pre-wrap",
              backgroundColor: "white",
              color: "black",
            }}
            />
            </div>
          <div className="h-4 ">
            <CodeRefercnce fileReference={fileReference} />
          </div>
          <Button
            onClick={() => {
              setOpen(false);
              setAnswer("");
              setFileReference([]);
              setLoading(false);
            }}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
      <Card className="relative col-span-3">
        <CardHeader>
          <CardTitle>Ask a question</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Textarea
              placeholder="Ask about your project ?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className=""
              required
            />
            <div className="h-4"></div>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              Ask Githubai {"   "}!
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
};

export default QuestionCard;
