
import React from "react";

interface DomainData {
  name: string;
  correct: number;
  incorrect: number;
}

interface DomainPerformanceProps {
  domainPerformance?: DomainData[];
}

const DomainPerformance = ({ domainPerformance }: DomainPerformanceProps) => {
  if (!domainPerformance?.length) {
    return (
      <div className="text-center py-8">
        <p>No domain performance data available</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <h3 className="text-lg font-medium mb-4">Domain Performance</h3>
      <div className="space-y-4">
        {domainPerformance.map((domain) => (
          <div key={domain.name}>
            <div className="flex justify-between mb-1">
              <span>{domain.name}</span>
              <span>
                {Math.round((domain.correct / (domain.correct + domain.incorrect)) * 100)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 h-2 rounded-full">
              <div 
                className="bg-indigo-600 h-2 rounded-full" 
                style={{
                  width: `${Math.round((domain.correct / (domain.correct + domain.incorrect)) * 100)}%`
                }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DomainPerformance;
