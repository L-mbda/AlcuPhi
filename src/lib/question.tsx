"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Button, TextInput } from "@mantine/core";
import React, { useEffect, useState, useRef } from "react";

// Interface
// interface Question {
//   id: number;
//   questionContent: string;
//   answer: string;
//   timestamp: string;
//   correct: boolean;
// }

const POLL_INTERVAL = 10000; // Polling interval

// Renderer for Question Bank Questions
// ©2025 AlcuPhi. All Rights Reserved.
export function QuestionRenderer() {
  // Get question
  const [question, setQuestion] = useState();
  // Use Effect
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch("/api/question", {
        method: "POST",
        body: JSON.stringify({
          type: "REQUEST",
        }),
      });
      const data = await response.json();
      console.log(data);
      setQuestion(data);
    };
    fetchData();
  }, []);
  console.log(question);
  // Answer handling
  //
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const answer = formData.get("response");
    fetch("/api/question", {
      method: "POST",
      body: JSON.stringify({
        type: "ANSWER",
        // @ts-expect-error because it doesn't recognize type
        questionID: question.question.id,
        response: answer,
      }),
    }).then((res) => {
      res.json().then((data) => {
        if (data.correct) {
          // Get the next question and render it
          fetch("/api/question", {
            method: "POST",
            body: JSON.stringify({
              type: "REQUEST",
            }),
          }).then((res) =>
            res.json().then((data) => {
              setQuestion(data);
            }),
          );
          // Seperation
        } else {
          fetch("/api/question", {
            method: "POST",
            body: JSON.stringify({
              type: "REQUEST",
            }),
          }).then((res) =>
            res.json().then((data) => {
              setQuestion(data);
            }),
          );
          // Return incorrect and render same question with correct answer
          return alert(
            "Incorrect! The correct answer is " + data.correctAnswer,
          );
        }
      });
    });
  };

  /*
    Beyond this point, the code is rendering the problem
  */
  // Render
  if (question !== undefined) {
    return (
      // Math context!!
      <MathJaxContext>
        <div className="w-full bg-zinc-800 flex flex-col items-center min-h-[30vh] gap-6">
          {/* Question block */}
          {/* @ts-expect-error because it doesn't recognize type */}
          {question.question.displayMethod == "text" ? (
            <>
              <div className="w-full text-center">
                {/* @ts-expect-error because it doesn't recognize type */}
                <MathJax>{question.question.question}</MathJax>
              </div>
              {/* @ts-expect-error because it doesn't recognize type */}
              {question.question.answerMethod == "freeResponse" ? (
                // @eslint-disable-next-line
                <form className="flex flex-row gap-5" onSubmit={handleSubmit}>
                  <TextInput name="response" placeholder="Enter your answer" />
                  <Button type="submit">Submit</Button>
                </form>
              ) : null}
            </>
          ) : (
            <h1>Error occured</h1>
          )}
        </div>
      </MathJaxContext>
    );
  }
  return (
    <div className="w-full bg-zinc-800 flex justify-center min-h-[30vh]">
      <h1>Loading...</h1>
    </div>
  );
}

export function QuestionLog() {
  const [questionLog, setQuestionLog] = useState<[]>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null); // To store the interval reference

  useEffect(() => {
    // Fetch questions from the API
    const fetchData = async () => {
      const response = await fetch("/api/question", {
        method: "GET",
      });
      const data = await response.json();
      console.log(data);
      // Update only if new data differs from the current data to prevent unnecessary rerenders
      if (JSON.stringify(data) !== JSON.stringify(questionLog)) {
        setQuestionLog(data.questionLog);
      }
    };

    // Polling function that runs fetchData at intervals
    const startPolling = () => {
      fetchData(); // Fetch immediately
      intervalRef.current = setInterval(fetchData, POLL_INTERVAL);
    };

    startPolling(); // Start polling when the component mounts

    // Cleanup the interval on component unmount to prevent memory leaks
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [questionLog]); // questionLog as a dependency for comparison

  // Question Log
  return (
    <div className="bg-zinc-700 rounded-lg p-4 flex items-center flex-col">
      <h1 className="font-medium">Question Log</h1>
      <div>
        {questionLog && questionLog.length > 0 ? (
          questionLog.map((question, index) => (
            <>
              <div key={index} className="flex flex-col">
                <p>
                  {/* @ts-expect-error yes it works */}
                  {question.correct ? "✅" : "❌"} {question.questionID}
                </p>
              </div>
            </>
          ))
        ) : (
          <p>No questions available.</p>
        )}
      </div>
    </div>
  );
}
