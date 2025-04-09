
import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

interface ResultsHeaderProps {
  examName: string;
  percentage: number;
}

const ResultsHeader = ({ examName, percentage }: ResultsHeaderProps) => {
  const navigate = useNavigate();

  return (
    <>
      <div className="flex items-center mb-4">
        <Button 
          variant="ghost" 
          className="p-1" 
          onClick={() => navigate("/dashboard")}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-xl font-medium flex-1">{examName}</h1>
        <Button 
          variant="outline" 
          className="text-red-500 border-red-500 hover:bg-red-50"
          onClick={() => navigate("/exam")}
        >
          Reset Product
        </Button>
      </div>

      <div className="w-full bg-indigo-100 h-2 rounded-full mb-1">
        <div 
          className="bg-indigo-800 h-2 rounded-full" 
          style={{width: `${percentage}%`}}
        ></div>
      </div>
      <div className="text-center text-sm text-gray-600 mb-8">
        {percentage}% Complete
      </div>
    </>
  );
};

export default ResultsHeader;
