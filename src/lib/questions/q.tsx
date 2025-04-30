/*
  Question Library
  ©2025 AlcuPhi. Open source under the CC0 license.
*/
import * as fs from "fs";

/*
  Generate the question with an algorithm based on type and user score, will work on that later
*/
export function generateQuestion(type: string, setID: string) {
  // Get working directory
  // const cwd = process.cwd();
  // // Find all files in the working directory
  // for (const file of fs.readdirSync(cwd)) {
  //   console.log(file);
  // }
  // console.log(cwd);
  // Read each type of question
  // Check all question sets
  for (const file of fs.readdirSync("./questions")) {
    const questions = []
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(`./questions/${file}`, "utf-8"),
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
  // Read each type of question
  // Check all question sets
  for (const file of fs.readdirSync("./questions")) {
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(`./questions/${file}`, "utf-8"),
    );
    // Random matching
    for (const question of questionSet.questions) {
      if (id == question.id) {
        console.log(question)
        return question;
      }
    }
  }
}