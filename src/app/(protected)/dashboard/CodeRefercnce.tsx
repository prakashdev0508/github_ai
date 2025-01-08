"use client";

import { Tabs, TabsContent } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import React from "react";
import { Prism as SyntexHighlighter } from "react-syntax-highlighter";
import { lucario , dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

type Props = {
  fileReference: {
    fileName: string;
    sourceCode: string;
    summery: string;
  }[];
};

const CodeRefercnce = ({ fileReference }: Props) => {
  const [tabs, setTabs] = React.useState(fileReference[0]?.fileName);
  if (fileReference.length == 0) return <div></div>;

  return (
    <div className="max-w-[60vw]">
      <Tabs value={tabs} onValueChange={setTabs} className="">
        <div className="flex gap-2 overflow-scroll no-scrollbar  rounded-md bg-gray-200 p-1">
          {fileReference.map((item, index) => (
            <button
              key={index}
              className={cn(
                "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors duration-300 ease-in-out hover:bg-muted-foreground",
                {
                  "bg-blue-600 text-white": tabs === item.fileName,
                  "text-gray-600 hover:text-gray-800": tabs !== item.fileName,
                },
              )}
              onClick={() => setTabs(item.fileName)}
            >
              {item.fileName}
            </button>
          ))}
        </div>
        {fileReference.map((item, index) => (
          <TabsContent
            value={item.fileName}
            key={index}
            className="mt-4 max-w-7xl overflow-scroll no-scrollbar "
          >
            <pre>
              <code>
            {item.sourceCode.slice(0, item.sourceCode.length - 1)}

              </code>
            </pre>
            {/* <SyntexHighlighter language="typescript" style={dracula} customStyle={{ whiteSpace: "pre-wrap" , height : "70vh" }}>
              {item.sourceCode.slice(0, item.sourceCode.length - 1)}
            </SyntexHighlighter> */}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default CodeRefercnce;
