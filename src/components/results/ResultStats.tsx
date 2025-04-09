
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { formatTime, formatDate } from "@/utils/format";

interface ResultStatsProps {
  percentage: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
  date: string;
  avgAnswerTime: number;
  avgCorrectTime: number;
  avgIncorrectTime: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: any[];
  totalQuestions: number;
}

const CustomTooltip = ({ active, payload, totalQuestions }: TooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white px-3 py-2 border rounded shadow text-sm">
        <p>{`${payload[0].name}: ${payload[0].value} questions (${Math.round((payload[0].value / totalQuestions) * 100)}%)`}</p>
      </div>
    );
  }
  return null;
};

const ResultStats = ({ 
  percentage, 
  totalQuestions, 
  correctAnswers, 
  timeSpent, 
  date, 
  avgAnswerTime, 
  avgCorrectTime, 
  avgIncorrectTime 
}: ResultStatsProps) => {
  
  const pieData = [
    { name: "Correct", value: correctAnswers, color: "#4caf50" },
    { name: "Incorrect", value: totalQuestions - correctAnswers, color: "#f44336" }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      <Card className="col-span-1 md:col-span-2 lg:col-span-1">
        <CardContent className="p-6">
          <div className="flex flex-col items-center">
            <div className="text-6xl font-bold text-center mb-4">{percentage}%</div>
            <div className="text-center mb-2">Correct</div>
            
            <div className="w-full h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    innerRadius={40}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <RechartsTooltip content={<CustomTooltip totalQuestions={totalQuestions} />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            
            <div className="flex justify-center gap-6 mt-2">
              {pieData.map((entry, index) => (
                <div key={`legend-${index}`} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-sm mr-2" 
                    style={{ backgroundColor: entry.color }}
                  />
                  <span>{entry.name} ({entry.value})</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-medium">{totalQuestions} of {totalQuestions}</div>
              <div className="text-sm text-gray-500">Questions Taken</div>
            </div>
            <div>
              <div className="text-lg font-medium">{formatTime(timeSpent)}</div>
              <div className="text-sm text-gray-500">Time Elapsed</div>
            </div>
            <div>
              <div className="text-lg font-medium">{formatTime(Math.round(avgAnswerTime))}</div>
              <div className="text-sm text-gray-500">Avg. Answer Time</div>
            </div>
            <div>
              <div className="text-lg font-medium">{formatDate(date)}</div>
              <div className="text-sm text-gray-500">Attempt Date</div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-lg font-medium">{formatTime(Math.round(avgCorrectTime))}</div>
              <div className="text-sm text-gray-500">Avg. Correct Answer</div>
            </div>
            <div>
              <div className="text-lg font-medium">{formatTime(Math.round(avgIncorrectTime))}</div>
              <div className="text-sm text-gray-500">Avg. Incorrect Answer</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResultStats;
