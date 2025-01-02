import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const QuestionsTable = ({ qna }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const questionsPerPage = 5;

  // Mock questions data
  const mockQuestions = Array.from({ length: 25 }, (_, i) => ({
    id: i + 1,
    question: `Sample Question ${i + 1}`,
    userAnswer: `User's answer for question ${i + 1}...`,

    score: Math.floor(Math.random() * 10),
  }));

  const totalPages = Math.ceil(qna.length / questionsPerPage);
  const paginatedQuestions = qna.slice(
    currentPage * questionsPerPage,
    (currentPage + 1) * questionsPerPage
  );

  return (
    <div className="w-full">
      <div className="overflow-x-auto -mx-4 sm:mx-0">
        <div className="inline-block min-w-full align-middle">
          <div className="overflow-hidden border border-gray-200 sm:rounded-lg">
            {/* Mobile View */}
            <div className="block sm:hidden">
              {paginatedQuestions.map((q) => (
                <div key={q.qna_id} className="p-4 border-b border-gray-200">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      {q.qna_id}
                    </span>
                  </div>
                  <div className="space-y-3">
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">
                        {q.question_asked}
                      </h4>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Your Answer:
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {q.answer_given || "No answer given"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">
                        Score:
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {q.score !== null ? q.score : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop View */}
            <table className="hidden sm:table min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question Asked
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Answer
                  </th>
                  <th className="px-3 md:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedQuestions.map((q) => (
                  <tr key={q.qna_id} className="hover:bg-gray-50">
                    <td className="px-3 md:px-6 py-4 whitespace-normal text-sm text-gray-500 break-words">
                      {q.question_asked}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                      {q.answer_given || "No answer given"}
                    </td>
                    <td className="px-3 md:px-6 py-4 text-sm text-gray-900">
                      {q.score !== null ? q.score : "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* pagenation */}
      <div className="flex flex-col sm:flex-row justify-between items-center mt-4 px-4 sm:px-6 py-3 bg-gray-50 gap-4 sm:gap-0">
        <button
          onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
          disabled={currentPage === 0}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={20} />
          Previous
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage + 1} of {totalPages}
        </span>
        <button
          onClick={() =>
            setCurrentPage(Math.min(totalPages - 1, currentPage + 1))
          }
          disabled={currentPage === totalPages - 1}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 text-gray-600 disabled:text-gray-400 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default QuestionsTable;
