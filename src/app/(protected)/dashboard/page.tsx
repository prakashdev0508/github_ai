import React from "react";
import DashboardPage from "./DashboardPage";
import Commitlogs from "./Commitlogs";
import QuestionCard from "./QuestionCard";


const page = async () => {
  return (
    <div>
      <div>
        <DashboardPage />
      </div>
      <div className=" grid grid-cols-5 mt-6 ">
          <QuestionCard />
      </div>
      <div className="mt-8">
        <Commitlogs />
      </div>
    </div>
  );
};

export default page;
