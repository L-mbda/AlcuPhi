/*
  Question Library
  ©2025 AlcuPhi. Open source under the CC0 license.
*/
import * as fs from "fs";
import * as path from "path"

/*
  Generate the question with an algorithm based on type and user score, will work on that later
*/
export function generateQuestion(type: string, setID: string, difficulty = "random") {
  const questionDir = "questions";
  
  // Check all question sets
  for (const file of fs.readdirSync(path.join(process.cwd(),"questions"))) {
    const questions = [];
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(path.join(process.cwd(),`${questionDir}`,`${file}`), "utf-8"),
    );
    // Random matching
    for (const question of questionSet.questions) {
      if (((question.id.split('.')[1] == setID) && ((question.type == type || type == "*")))) {
        if (difficulty == 'easy' && question.difficulty <= 4) {
          questions.push({
            displayMethod: question.displayMethod,
            id: question.id,
            questionName: question.question,
            difficulty: question.difficulty,
            tags: question.tags,
            type: question.answerMethod,
            answerChoices: question.answerChoices || [],
          });
        } else if (difficulty == 'medium' && question.difficulty > 4 && question.difficulty <= 7) {
          questions.push({
            displayMethod: question.displayMethod,
            id: question.id,
            questionName: question.question,
            difficulty: question.difficulty,
            tags: question.tags,
            type: question.answerMethod,
            answerChoices: question.answerChoices || [],
          });
        } else if (difficulty == 'hard' && question.difficulty > 7) {
          questions.push({
            displayMethod: question.displayMethod,
            id: question.id,
            questionName: question.question,
            difficulty: question.difficulty,
            tags: question.tags,
            type: question.answerMethod,
            answerChoices: question.answerChoices || [],
          });
        } else {
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
    }
    return questions[Math.trunc(Math.random() * questions.length)];
  }
}

/*
  Fetch the question by ID
*/
export function fetchQuestion(id: string) {
  const questionDir = "questions";

  // Check all question sets
  for (const file of fs.readdirSync(path.join(process.cwd(),"questions"))) {
    // Reading all question sets
    const questionSet = JSON.parse(
      fs.readFileSync(path.join(process.cwd(),`${questionDir}`,`${file}`), "utf-8"),
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
