"use client";
import React, { useState } from "react";

const QnASection = ({ questionsData }) => {
    const [questions, setQuestions] = useState(questionsData);
    const [newAnswerText, setNewAnswerText] = useState({});
    const [replyText, setReplyText] = useState({});
    const [newQuestionText, setNewQuestionText] = useState("");

    const handleLike = (questionId, answerId) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) =>
                            answer.id === answerId
                                ? { ...answer, likes: answer.likes + 1 }
                                : answer
                        ),
                    }
                    : question
            )
        );
    };

    const handleDislike = (questionId, answerId) => {
        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) =>
                            answer.id === answerId
                                ? { ...answer, dislikes: answer.dislikes + 1 }
                                : answer
                        ),
                    }
                    : question
            )
        );
    };

    const handleReplySubmit = (questionId, answerId) => {
        const replyTextValue = replyText[`${questionId}_${answerId}`];
        if (!replyTextValue) return;
        const newReply = {
            id: `r${Math.random().toString(36).substring(7)}`,
            replyText: replyTextValue,
            repliedBy: { userId: "uNew", username: "current_user" },
            timestamp: new Date().toISOString(),
        };

        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: question.answers.map((answer) =>
                            answer.id === answerId
                                ? {
                                    ...answer,
                                    replies: [...answer.replies, newReply],
                                }
                                : answer
                        ),
                    }
                    : question
            )
        );

        setReplyText((prev) => ({ ...prev, [`${questionId}_${answerId}`]: "" }));
    };

    const handleNewAnswerSubmit = (questionId) => {
        const answerText = newAnswerText[questionId];
        if (!answerText) return;

        const newAnswer = {
            id: `a${Math.random().toString(36).substring(7)}`,
            answerText,
            answeredBy: {
                userId: "uNew",
                username: "current_user",
                profileImage: "https://example.com/user-images/uNew.jpg",
            },
            timestamp: new Date().toISOString(),
            likes: 0,
            dislikes: 0,
            replies: [],
        };

        setQuestions((prevQuestions) =>
            prevQuestions.map((question) =>
                question.id === questionId
                    ? {
                        ...question,
                        answers: [...question.answers, newAnswer],
                    }
                    : question
            )
        );

        setNewAnswerText((prev) => ({ ...prev, [questionId]: "" }));
    };

    const handleNewQuestionSubmit = () => {
        if (!newQuestionText.trim()) return;

        const newQuestion = {
            id: `q${Math.random().toString(36).substring(7)}`,
            questionText: newQuestionText,
            askedBy: {
                userId: "uNew",
                username: "current_user",
                profileImage: "https://example.com/user-images/uNew.jpg",
            },
            timestamp: new Date().toISOString(),
            answers: [],
        };

        setQuestions((prevQuestions) => [...prevQuestions, newQuestion]);
        setNewQuestionText("");
    };

    // New function to get recommended questions
    const getRecommendedQuestions = () => {
        return questions
            .map((question) => ({
                ...question,
                answerCount: question.answers.length,
                totalLikes: question.answers.reduce((sum, answer) => sum + answer.likes, 0),
            }))
            .sort((a, b) => b.totalLikes - a.totalLikes || b.answerCount - a.answerCount)
            .slice(0, 3); // Get top 3 recommended questions
    };

    const recommendedQuestions = getRecommendedQuestions();

    return (
        <div className="space-y-8 p-6">
            {/* Recommended Questions Section */}
            <div className="mb-6">
                <h2 className="text-xl font-bold">Recommended Questions</h2>
                {recommendedQuestions.length > 0 ? (
                    <ul className="space-y-4">
                        {recommendedQuestions.map((question) => (
                            <li key={question.id} className="border border-gray-300 rounded-lg p-4">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={question.askedBy.profileImage}
                                        alt={question.askedBy.username}
                                        className="w-10 h-10 rounded-full"
                                    />
                                    <div>
                                        <h3 className="text-lg font-semibold">{question.questionText}</h3>
                                        <p className="text-sm text-gray-500">
                                            Asked by {question.askedBy.username} on {new Date(question.timestamp).toLocaleString()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Likes: {question.totalLikes} | Answers: {question.answerCount}
                                        </p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>No recommended questions available.</p>
                )}
            </div>

            {/* New Question Input */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Ask a new question..."
                    className="border rounded p-2 w-full"
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleNewQuestionSubmit();
                        }
                    }}
                />
            </div>

            {questions.map((question) => (
                <div key={question.id} className="border border-gray-300 rounded-lg p-4">
                    <div className="pb-4">
                        <div className="flex items-center space-x-4">
                            <img
                                src={question.askedBy.profileImage}
                                alt={question.askedBy.username}
                                className="w-10 h-10 rounded-full"
                            />
                            <div>
                                <h2 className="text-xl font-semibold">{question.questionText}</h2>
                                <p className="text-sm text-gray-500">
                                    Asked by {question.askedBy.username} on {new Date(question.timestamp).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6 pt-4 border-t border-gray-200">
                        {question.answers.map((answer) => (
                            <div key={answer.id} className="p-4 border border-gray-200 rounded-lg">
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={answer.answeredBy.profileImage}
                                        alt={answer.answeredBy.username}
                                        className="w-8 h-8 rounded-full"
                                    />
                                    <div>
                                        <p className="text-base font-semibold">{answer.answeredBy.username}</p>
                                        <p className="text-sm text-gray-500">{new Date(answer.timestamp).toLocaleString()}</p>
                                    </div>
                                </div>
                                <p className="pt-4 text-gray-800">{answer.answerText}</p>
                                <div className="flex items-center space-x-6 pt-2 text-sm text-gray-600">
                                    <button onClick={() => handleLike(question.id, answer.id)} className="text-blue-600">
                                        👍 {answer.likes}
                                    </button>

                                    <button onClick={() => handleDislike(question.id, answer.id)} className="text-blue-600">
                                        👎 {answer.dislikes}
                                    </button>
                                    <button
                                        onClick={() => setReplyText((prev) => ({ ...prev, [`${question.id}_${answer.id}`]: '' }))}
                                        className="text-blue-600"
                                    >
                                        Reply
                                    </button>
                                </div>
                                <div className="mt-4 space-y-2 pl-4 border-l-2 border-gray-300">
                                    {answer.replies.map((reply) => (
                                        <div key={reply.id} className="flex items-start space-x-2">
                                            <p className="text-sm font-semibold">{reply.repliedBy.username}</p>
                                            <p className="text-sm text-gray-800">{reply.replyText}</p>
                                            <p className="text-xs text-gray-500">{new Date(reply.timestamp).toLocaleString()}</p>
                                        </div>
                                    ))}
                                    <div className="flex items-center mt-2">
                                        <input
                                            type="text"
                                            placeholder="Write a reply..."
                                            className="border rounded p-1 w-full"
                                            value={replyText[`${question.id}_${answer.id}`] || ''}
                                            onChange={(e) => setReplyText((prev) => ({ ...prev, [`${question.id}_${answer.id}`]: e.target.value }))}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    handleReplySubmit(question.id, answer.id);
                                                }
                                            }}
                                        />
                                        {/* <button
                      onClick={() => handleReplySubmit(question.id, answer.id)}
                      className="ml-2 bg-blue-600 text-white rounded px-2 py-1"
                    >
                      Submit
                    </button> */}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="flex items-center">
                            <input
                                type="text"
                                placeholder="Write an answer..."
                                className="border rounded p-1 w-full"
                                value={newAnswerText[question.id] || ""}
                                onChange={(e) => setNewAnswerText((prev) => ({ ...prev, [question.id]: e.target.value }))}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleNewAnswerSubmit(question.id);
                                    }
                                }}
                            />
                            {/* <button
                onClick={() => handleNewAnswerSubmit(question.id)}
                className="ml-2 bg-blue-600 text-white rounded px-2 py-1"
              >
                Submit
              </button> */}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

// Sample data to simulate the questions and answers
const data = {
    questions: [
        {
            id: "q1",
            questionText: "What is the difference between React and Angular?",
            askedBy: {
                userId: "u123",
                username: "user_01",
                profileImage: "https://example.com/user-images/u123.jpg",
            },
            timestamp: "2024-10-25T09:00:00Z",
            answers: [
                {
                    id: "a1",
                    answerText: "React is a library for building user interfaces, while Angular is a framework.",
                    answeredBy: {
                        userId: "u456",
                        username: "developer_01",
                        profileImage: "https://example.com/user-images/u456.jpg",
                    },
                    timestamp: "2024-10-25T09:05:00Z",
                    likes: 5,
                    dislikes: 1,
                    replies: [
                        {
                            id: "r1",
                            replyText: "Thanks for the clarification!",
                            repliedBy: { userId: "u789", username: "student_01" },
                            timestamp: "2024-10-25T09:10:30Z",
                        },
                    ],
                },
                {
                    id: "a2",
                    answerText: "Angular is more opinionated, while React gives you more flexibility.",
                    answeredBy: {
                        userId: "u789",
                        username: "student_02",
                        profileImage: "https://example.com/user-images/u789.jpg",
                    },
                    timestamp: "2024-10-25T09:20:00Z",
                    likes: 3,
                    dislikes: 0,
                    replies: [],
                },
            ],
        },
        // Add more questions as needed
    ],
};

export default function App() {
    return <QnASection questionsData={data.questions} />;
}
