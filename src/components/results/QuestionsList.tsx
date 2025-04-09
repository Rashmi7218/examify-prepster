
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHeader, TableHead, TableRow } from "@/components/ui/table";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { CheckCircle, XCircle } from "lucide-react";
import { formatTime } from "@/utils/format";

interface Question {
  id: string;
  text: string;
  correctOption: string | string[];
  userAnswer: string | string[] | Record<string, string> | null;
  isCorrect: boolean;
  timeTaken?: number;
  type?: string;
}

interface QuestionsListProps {
  questions: Question[];
}

const QuestionsList = ({ questions }: QuestionsListProps) => {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 5;

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = questions.slice(indexOfFirstQuestion, indexOfLastQuestion);
  const totalPages = Math.ceil(questions.length / questionsPerPage);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center p-3 border-b">
        <Button variant="ghost" size="sm">
          <span className="text-sm">Filter</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="ml-1">
            <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
          </svg>
        </Button>
        <div className="text-sm text-gray-600">Review All</div>
      </div>
      
      <Table>
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead className="w-1/2">Preview</TableHead>
            <TableHead className="text-right">Time</TableHead>
            <TableHead className="w-24 text-right"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {currentQuestions.map((question) => (
            <TableRow key={question.id}>
              <TableCell className="py-4">
                <div className="flex items-start">
                  <div className="mt-1 mr-2">
                    {question.isCorrect ? (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </div>
                  <div className="line-clamp-2">{question.text}</div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                {question.timeTaken ? formatTime(question.timeTaken) : 'N/A'}
              </TableCell>
              <TableCell className="text-right">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-indigo-800"
                  onClick={() => navigate(`/question-review/${question.id}`)}
                >
                  Review
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      
      <div className="p-3 border-t">
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage > 1) handlePageChange(currentPage - 1);
                }}
              />
            </PaginationItem>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <PaginationItem key={i}>
                <PaginationLink 
                  href="#" 
                  isActive={currentPage === i + 1}
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(i + 1);
                  }}
                >
                  {i + 1}
                </PaginationLink>
              </PaginationItem>
            ))}
            
            <PaginationItem>
              <PaginationNext 
                href="#" 
                onClick={(e) => {
                  e.preventDefault();
                  if (currentPage < totalPages) handlePageChange(currentPage + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
  );
};

export default QuestionsList;
