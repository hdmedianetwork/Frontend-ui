// Mock interview data
export const mockInterviews = [
  {
    id: 1,
    date: "2024-03-15",
    score: 85,
    duration: "45 mins",
    topic: "React Frontend",
    report: "Interview_Report_15Mar.pdf",
  },
  {
    id: 2,
    date: "2024-03-20",
    score: 92,
    duration: "50 mins",
    topic: "System Design",
    report: "Interview_Report_20Mar.pdf",
  },
  {
    id: 3,
    date: "2024-03-25",
    score: 85,
    duration: "30 mins",
    topic: "Computer Networks",
    report: "Interview_Report_25Mar.pdf",
  },
];

export const mockQuestions = Array.from({ length: 25 }, (_, i) => ({
  id: i + 1,
  question: `Sample Question ${i + 1}`,
  userAnswer: `User's answer for question ${i + 1}...`,
  betterAnswer: `A more comprehensive answer would include...`,
  type: i % 2 === 0 ? "Technical" : "Behavioral",
  difficulty: i % 3 === 0 ? "Easy" : i % 3 === 1 ? "Medium" : "Hard",
}));
