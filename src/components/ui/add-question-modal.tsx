"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Plus, Trash2 } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { MathEditor } from "./math-editor";
import { useToast } from "@/hooks/use-toast";

type QuestionType = "multipleChoice" | "freeResponse";

interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export function AddQuestionModal({
  collectionId,
  buttonText = "Add Question",
}: {
  collectionId: number | string;
  buttonText?: string;
}) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [questionType, setQuestionType] =
    useState<QuestionType>("multipleChoice");
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<Option[]>([
    { id: "option-1", text: "", isCorrect: false },
    { id: "option-2", text: "", isCorrect: false },
  ]);
  const [nextOptionId, setNextOptionId] = useState(3); // Track the next ID to use
  const [freeResponseAnswer, setFreeResponseAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddOption = () => {
    const newOptionId = `option-${nextOptionId}`;
    setOptions([...options, { id: newOptionId, text: "", isCorrect: false }]);
    setNextOptionId(nextOptionId + 1); // Increment for next use
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
      // Prepare the data based on question type
      const formData = {
        collectionId,
        question,
        type: questionType,
        answer:
          questionType === "multipleChoice"
            ? {
                options: options.map((opt) => ({ text: opt.text })),
                correctAnswers: options
                  .filter((opt) => opt.isCorrect)
                  .map((opt) => opt.id),
              }
            : { text: freeResponseAnswer },
      };

      // Send the data to the API
      const response = await fetch("/api/community/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        // Try to get error message from response
        let errorData;
        try {
          errorData = await response.json();
        } catch (e) {
          // If we can't parse the error, use status text
          throw new Error(
            `Failed to create question: ${response.status} ${response.statusText}`,
          );
        }

        throw new Error(errorData.message || "Failed to create question");
      }

      const data = await response.json();

      // Show success toast
      toast({
        title: "Question created",
        description: "Your question has been added to the collection.",
      });

      // Reset form and close modal on success
      resetForm();
      setOpen(false);
    } catch (error) {
      console.error("Error submitting question:", error);
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred",
      );

      toast({
        variant: "destructive",
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to create question",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setQuestion("");
    setQuestionType("multipleChoice");
    setOptions([
      { id: "option-1", text: "", isCorrect: false },
      { id: "option-2", text: "", isCorrect: false },
    ]);
    setNextOptionId(3); // Reset the counter
    setFreeResponseAnswer("");
    setError(null);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> {buttonText}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[650px] bg-zinc-900 border-zinc-800 text-zinc-100">
        <DialogHeader>
          <DialogTitle>Add New Question</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Create a new question for your collection. You can use LaTeX for
            mathematical expressions.
          </DialogDescription>
        </DialogHeader>

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
                <RadioGroupItem value="multipleChoice" id="multipleChoice" />
                <Label htmlFor="multipleChoice" className="text-zinc-300">
                  Multiple Choice
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="freeResponse" id="freeResponse" />
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
                      className="mt-2.5"
                    />
                    <div className="flex-1">
                      <MathEditor
                        id={`option-${option.id}`}
                        value={option.text}
                        onChange={(text) =>
                          handleOptionTextChange(option.id, text)
                        }
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
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() => setOpen(false)}
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
            {isSubmitting ? "Saving..." : "Save Question"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
