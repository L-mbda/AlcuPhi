// src/lib/questions/index.ts
import fs from "fs";
import path from "path";

export interface Question {
  id: string;
  type: string;
  difficulty: number;
  answerMethod: string;
  displayMethod: string;
  question: string;
  tags: string[];
  answerChoices?: any[];
}

const QUESTIONS_DIR = path.join(process.cwd(), "questions");

// In-memory storage
const questionMap: Record<string, Question> = {};
const questionsList: Question[] = [];

// Populate at startup
(function preloadQuestions() {
  const files = fs.readdirSync(QUESTIONS_DIR).filter((f) => f.endsWith(".json"));
  for (const file of files) {
    const fullPath = path.join(QUESTIONS_DIR, file);
    try {
      const { questions } = JSON.parse(fs.readFileSync(fullPath, "utf-8")) as {
        questions: Question[];
      };
      for (const q of questions) {
        questionMap[q.id] = q;
        questionsList.push(q);
      }
    } catch (err) {
      console.error(`⚠️ Failed to load questions from ${file}:`, err);
    }
  }
})();

/**
 * Fetch a single question by ID.
 * @param id  the question ID (e.g. "abc.123")
 */
export function fetchQuestion(id: string): Question | undefined {
  return questionMap[id];
}

export function generateQuestion(
  desiredType: string,
  setID: string,
  difficulty: "easy" | "medium" | "hard" | "random" = "random"
): {
  displayMethod: string;
  id: string;
  questionName: string;
  difficulty: number;
  tags: string[];
  type: string;
  answerChoices: any[];
} | undefined {
  // Difficulty predicate
  const matchesDifficulty = (q: Question) => {
    if (difficulty === "random") return true;
    if (difficulty === "easy")   return q.difficulty <= 4;
    if (difficulty === "medium") return q.difficulty >= 5 && q.difficulty <= 7;
    if (difficulty === "hard")   return q.difficulty >= 8;
    return true;
  };

  // Helper to filter by type, setID, and optional difficulty
  const filterPool = (useDifficulty: boolean) =>
    questionsList.filter((q) => {
      const [, fileSetID] = q.id.split(".");
      const typeMatches = desiredType === "*" || q.type === desiredType;
      const difficultyMatches = useDifficulty ? matchesDifficulty(q) : true;
      return fileSetID === setID && typeMatches && difficultyMatches;
    });

  // 1) Strict pool: type + setID + difficulty
  let pool = filterPool(true);

  // 2) Fallback to ignore difficulty
  if (pool.length === 0) {
    console.warn(
      `No questions for type=${desiredType}, setID=${setID}, difficulty=${difficulty}. ` +
      `Falling back to ignore difficulty.`
    );
    pool = filterPool(false);
  }

  // 3) Fallback to entire bank
  if (pool.length === 0) {
    console.warn(
      `No questions for type=${desiredType}, setID=${setID}. ` +
      `Falling back to entire question bank.`
    );
    pool = questionsList;
  }

  // Pick one at random
  const q = pool[Math.floor(Math.random() * pool.length)];

  // Return in the required format
  return {
    displayMethod: q.displayMethod,
    id: q.id,
    questionName: q.question,
    difficulty: q.difficulty,
    tags: q.tags,
    type: q.answerMethod,
    answerChoices: q.answerChoices || [],
  };
}
