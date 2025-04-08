"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MathEditor } from "./math-editor";
import { useToast } from "@/hooks/use-toast";

// Question interface as provided
interface Question {
  id: number;
  collectionID: number;
  type: string | null;
  questionName: string | null;
  difficulty: number | null;
  questionCollectionTagName: string[];
  answerChoices: string[];
  correctAnswer: string[];
}

type QuestionType = "multipleChoice" | "freeResponse";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export function EditQuestionForm({
  questionInfo,
  onSave,
  onCancel,
}: {
  questionInfo: Question;
  onSave?: (updatedQuestion: Question) => void;
  onCancel?: () => void;
}) {
  const { toast } = useToast();
  const [questionType, setQuestionType] =
    useState<QuestionType>("multipleChoice");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "option-1", text: "", isCorrect: false },
    { id: "option-2", text: "", isCorrect: false },
  ]);
  const [nextOptionId, setNextOptionId] = useState(3);
  const [freeResponseAnswer, setFreeResponseAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to safely decode URL-encoded text
  const decodeText = (text: string): string => {
    if (!text) return "";
    try {
      return decodeURIComponent(text);
    } catch (error) {
      console.error("Error decoding text:", error);
      return text;
    }
  };

  // Function to extract actual text from option format
  const extractOptionText = (optionText: string): string => {
    // Check if the text starts with "text="
    if (optionText && optionText.startsWith("text=")) {
      return optionText.substring(5); // Remove "text=" prefix
    }
    return optionText;
  };

  // Initialize form with existing question data
  useEffect(() => {
    if (questionInfo) {
      // Set question text
      setQuestion(decodeText(questionInfo.questionName || ""));

      // Determine question type
      const type =
        questionInfo.type === "freeResponse"
          ? "freeResponse"
          : "multipleChoice";
      setQuestionType(type as QuestionType);

      if (type === "multipleChoice" && questionInfo.answerChoices.length > 0) {
        // Set up options for multiple choice
        const formattedOptions = questionInfo.answerChoices.map(
          (choice, index) => {
            const optionId = `option-${index + 1}`;

            // Safely extract and decode text from the choice, removing any "text=" prefix
            const optionText = extractOptionText(decodeText(choice || ""));

            // Check if this option is marked as correct in the correctAnswer array
            const isCorrect = questionInfo.correctAnswer.some((answer) => {
              // Parse the option number from strings like "option-1"
              if (answer && answer.includes("option-")) {
                const answerIndex =
                  Number.parseInt(answer.split("option-")[1]) - 1;
                return answerIndex === index;
              }
              return false;
            });

            return {
              id: optionId,
              text: optionText,
              isCorrect: isCorrect,
            };
          },
        );

        setOptions(formattedOptions);
        setNextOptionId(formattedOptions.length + 1);
      } else if (
        type === "freeResponse" &&
        questionInfo.correctAnswer.length > 0
      ) {
        // Set free response answer
        setFreeResponseAnswer(
          extractOptionText(decodeText(questionInfo.correctAnswer[0] || "")),
        );
      }
    }
  }, [questionInfo]);

  const handleAddOption = () => {
    const newOptionId = `option-${nextOptionId}`;
    setOptions([...options, { id: newOptionId, text: "", isCorrect: false }]);
    setNextOptionId(nextOptionId + 1);
  };

  const handleRemoveOption = (id: string) => {
    if (options.length <= 2) return; // Maintain at least 2 options
    setOptions(options.filter((option) => option.id !== id));
  };

  const handleOptionTextChange = (id: string, text: string) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, text } : option,
      ),
    );
  };

  const handleOptionCorrectChange = (id: string, isCorrect: boolean) => {
    setOptions(
      options.map((option) =>
        option.id === id ? { ...option, isCorrect } : option,
      ),
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare the updated question data
      const updatedQuestion: Question = {
        ...questionInfo,
        questionName: question,
        type: questionType,
        answerChoices:
          questionType === "multipleChoice"
            ? options.map((opt) => opt.text) // Don't add "text=" prefix when saving
            : [],
        correctAnswer:
          questionType === "multipleChoice"
            ? options.filter((opt) => opt.isCorrect).map((opt) => opt.id) // Use option.id instead of option.text
            : [freeResponseAnswer],
      };

      // Send data to the API
      const response = await fetch(
        `/api/community/questions/`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedQuestion),
        },
      );

      if (!response.ok) {
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          throw new Error(
            `Failed to update question: ${response.status} ${response.statusText}`,
          );
        }

        throw new Error(errorData.message || "Failed to update question");
      }

      const data = await response.json();

      // Show success
      toast({
        title: "Question updated",
        description: "Your question has been successfully updated.",
      });

      // Call the onSave callback if provided
      if (onSave) {
        onSave(updatedQuestion);
      }
    } catch (error) {
      console.error("Error updating question:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );
      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to update question",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid gap-4 py-4 max-h-[70vh] overflow-y-auto pr-2">
      {error && (
        <div className="bg-red-900/20 border border-red-800 text-red-300 px-3 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="question" className="text-zinc-300">
          Question
        </Label>
        <MathEditor
          id="question"
          value={question}
          onChange={setQuestion}
          placeholder="Enter your question here..."
          minHeight="120px"
        />
      </div>

      <div className="grid gap-2">
        <Label className="text-zinc-300">Answer Type</Label>
        <RadioGroup
          value={questionType}
          onValueChange={(value) => setQuestionType(value as QuestionType)}
          className="flex gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="multipleChoice"
              id="multipleChoice"
              className="text-white border-white"
            />
            <Label htmlFor="multipleChoice" className="text-zinc-300">
              Multiple Choice
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem
              value="freeResponse"
              id="freeResponse"
              className="text-white border-white"
            />
            <Label htmlFor="freeResponse" className="text-zinc-300">
              Free Response
            </Label>
          </div>
        </RadioGroup>
      </div>

      {questionType === "multipleChoice" ? (
        <div className="grid gap-3">
          <Label className="text-zinc-300">Options</Label>
          <div className="space-y-4">
            {options.map((option) => (
              <div key={option.id} className="flex items-start gap-2">
                <Checkbox
                  id={`correct-${option.id}`}
                  checked={option.isCorrect}
                  onCheckedChange={(checked) =>
                    handleOptionCorrectChange(option.id, checked === true)
                  }
                  className="mt-2.5 border-white text-white data-[state=checked]:bg-white data-[state=checked]:text-zinc-900"
                />
                <div className="flex-1">
                  <MathEditor
                    id={`option-${option.id}`}
                    value={option.text}
                    onChange={(text) => handleOptionTextChange(option.id, text)}
                    placeholder={`Option ${options.indexOf(option) + 1}...`}
                    minHeight="80px"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveOption(option.id)}
                  disabled={options.length <= 2}
                  className="h-9 w-9 text-zinc-400 hover:text-zinc-100 mt-1"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddOption}
            className="mt-2 w-full bg-zinc-800 hover:bg-zinc-700 border-zinc-700"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
          <p className="text-xs text-zinc-500 mt-1">
            Check the boxes next to correct answers. You can select multiple
            correct answers.
          </p>
        </div>
      ) : (
        <div className="grid gap-2">
          <Label htmlFor="answer" className="text-zinc-300">
            Correct Answer
          </Label>
          <MathEditor
            id="answer"
            value={freeResponseAnswer}
            onChange={setFreeResponseAnswer}
            placeholder="Enter the correct answer..."
            minHeight="100px"
          />
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          className="text-zinc-300 hover:text-zinc-100 hover:bg-zinc-800"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={handleSubmit}
          disabled={
            isSubmitting ||
            !question ||
            (questionType === "multipleChoice"
              ? options.some((opt) => !opt.text) ||
                !options.some((opt) => opt.isCorrect)
              : !freeResponseAnswer)
          }
          className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
        >
          {isSubmitting ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
