/*
  Question Library
  ©2025 AlcuPhi. Open source under the CC0 license.
*/
import * as fs from "fs";

/*
  Generate the question with an algorithm based on type and user score, will work on that later
*/
export function generateQuestion(type: string, setID: string, difficulty = "random") {
  console.log(difficulty);

  // Get working directory and log it
  const cwd = process.cwd();
  console.log("Current Working Directory:", cwd);

  // Log the directory location where questions are stored
  const questionDir = "./questions";
  console.log("Questions Directory Location:", questionDir);

  // Check all question sets
  for (const file of fs.readdirSync(questionDir)) {
    const questions = [];
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(`${questionDir}/${file}`, "utf-8"),
    );
    // Random matching
    for (const question of questionSet.questions) {
      if ((question.id.split('.')[1] == setID) && (question.type == type || type == "*")) {
        questions.push({
          displayMethod: question.displayMethod,
          id: question.id,
          questionName: question.question,
          difficulty: question.difficulty,
          tags: question.tags,
          type: question.answerMethod,
          answerChoices: question.answerChoices || [],
        });
      }
    }
    return questions[Math.trunc(Math.random() * questions.length)];
  }
}

/*
  Fetch the question by ID
*/
export function fetchQuestion(id: string) {
  // Get working directory and log it
  const cwd = process.cwd();
  console.log("Current Working Directory:", cwd);

  // Log the directory location where questions are stored
  const questionDir = "./questions";
  console.log("Questions Directory Location:", questionDir);

  // Check all question sets
  for (const file of fs.readdirSync(questionDir)) {
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(`${questionDir}/${file}`, "utf-8"),
    );
    // Random matching
    for (const question of questionSet.questions) {
      if (id == question.id) {
        console.log(question);
        return question;
      }
    }
  }
}
