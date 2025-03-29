"use client";

import type React from "react";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import Link from "next/link";
import {
  AlertCircle,
  CirclePlus,
  Sparkles,
  Check,
  Info,
  Loader2,
  CpuIcon,
  User,
} from "lucide-react";
import { TagsInput } from "@/components/ui/tags-input";
import { cn } from "@/lib/utils";

export function CreateSetButton({ name = "user" }: { name?: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<"info" | "preview">("info");

  const hasTitle = title.trim().length > 0;
  const hasDescription = description.trim().length > 0;
  const hasTags = tags.length > 0;
  const isFormValid = hasTitle && hasDescription && hasTags;

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setTags([]);
    setStep("info");
    setIsSubmitting(false);
  };

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      resetForm();
    }
  };

  async function submitHandler(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);
    console.log("🟠 Creating set...");

    try {
      const response = await fetch("/api/community", {
        method: "PATCH",
        body: JSON.stringify({
          operation: "CREATE_SET",
          setName: title,
          setDescription: description,
          setTags: tags.length ? tags : ["General"],
        }),
      });

      const data = await response.json();
      if (data.status === "success") {
        console.log("🟢 Set created!");
        window.location.href = `/set/${data.setID}`;
      } else {
        console.log("🔴 Set was not created.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error creating set:", error);
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="default"
          className="bg-zinc-800 hover:bg-zinc-700 text-zinc-100 shadow-md transition-all duration-300"
        >
          <CirclePlus className="mr-2 h-5 w-5" />
          Create question set
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[550px] p-0 overflow-hidden border-0 bg-zinc-900 border-zinc-800 rounded-xl shadow-xl">
        <div className="relative">
          {/* Header */}
          <div className="bg-zinc-800 p-6 flex flex-col gap-2">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-zinc-700 p-2 rounded-lg">
                <CpuIcon className="h-6 w-6 text-zinc-300" />
              </div>
              <DialogTitle asChild>
                <h2 className="text-2xl font-bold text-zinc-100">Create Set</h2>
              </DialogTitle>
            </div>
            <p className="text-zinc-400 text-sm">
              Create a set of questions for other users to practice with.
            </p>
          </div>

          {/* Steps */}
          <div className="flex border-b border-zinc-800">
            <button
              onClick={() => setStep("info")}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                step === "info"
                  ? "text-zinc-100 bg-zinc-700"
                  : "text-zinc-400 bg-zinc-800",
              )}
            >
              <Info className="h-4 w-4" />
              Set Information
            </button>
            <button
              onClick={() => isFormValid && setStep("preview")}
              className={cn(
                "flex-1 py-3 px-4 text-sm font-medium flex items-center justify-center gap-2 transition-colors",
                !isFormValid && "opacity-50 cursor-not-allowed",
                step === "preview"
                  ? "text-zinc-100 border-b-2 border-zinc-600 bg-zinc-700"
                  : "text-zinc-400 hover:text-zinc-300 bg-zinc-800",
              )}
              disabled={!isFormValid}
            >
              <Sparkles className="h-4 w-4" />
              Preview
            </button>
          </div>

          <div className="p-6">
            {step === "info" ? (
              <>
                <form
                  id="create-set-form"
                  onSubmit={submitHandler}
                  className="space-y-5 gap-3 flex flex-col"
                >
                  <Alert
                    variant="destructive"
                    className="mb-9 bg-zinc-800 border-0 text-zinc-300"
                  >
                    <AlertCircle className="h-4 w-4 mr-2" />
                    <div>
                      <p className="text-sm">
                        Please make sure to abide by our{" "}
                        <Link
                          href="/tos"
                          className="underline underline-offset-2 hover:text-zinc-100"
                        >
                          Terms of Service
                        </Link>
                        . Improper sets may result in deletion of said set and
                        your account being deleted.
                      </p>
                    </div>
                  </Alert>
                  {/* Set Name */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="setName"
                      className="text-zinc-300 flex items-center gap-1"
                    >
                      Set Name
                      <span className="text-zinc-500">*</span>
                    </Label>
                    <Input
                      id="setName"
                      name="setName"
                      placeholder="e.g., Ohm's Law Review"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="bg-zinc-800  border-0 text-zinc-100 placeholder:text-zinc-500"
                      required
                    />
                    <p className="text-xs text-zinc-500">
                      The name of your set. This will be visible to other users.
                    </p>
                  </div>

                  {/* Set Description */}
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <Label
                        htmlFor="textDescription"
                        className="text-zinc-300 flex items-center gap-1"
                      >
                        Description
                        <span className="text-zinc-500">*</span>
                      </Label>
                      <span className="text-xs text-zinc-500">
                        {description.length}/500
                      </span>
                    </div>
                    <Textarea
                      id="textDescription"
                      name="textDescription"
                      placeholder="Beautiful review of Ohm's Law"
                      value={description}
                      onChange={(e) =>
                        setDescription(e.target.value.slice(0, 500))
                      }
                      className="min-h-[100px] bg-zinc-800 border-0 text-zinc-100 placeholder:text-zinc-500"
                      required
                    />
                  </div>

                  {/* Set Tags */}
                  <div className="space-y-2">
                    <Label
                      htmlFor="setTags"
                      className="text-zinc-300 flex items-center gap-1"
                    >
                      Tags
                      <span className="text-zinc-500">*</span>
                    </Label>
                    <TagsInput
                      id="setTags"
                      name="setTags"
                      placeholder="Add tags (e.g., mechanics, thermodynamics)"
                      value={tags}
                      onChange={setTags}
                      className="bg-zinc-800 border-zinc-700 focus:border-zinc-600 focus:ring-zinc-700 text-zinc-100"
                      maxTags={5}
                    />
                    <p className="text-xs text-zinc-500">
                      Add up to 5 tags to help others find your set
                    </p>
                  </div>
                </form>
                <br />
                <div className="flex justify-end mt-8">
                  <Button
                    type="button"
                    onClick={() => isFormValid && setStep("preview")}
                    disabled={!isFormValid}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                  >
                    Continue to Preview
                  </Button>
                </div>
              </>
            ) : (
              <div className="space-y-6 gap-4 flex flex-col">
                <div className="bg-zinc-800 border-0 rounded-xl overflow-hidden shadow-lg">
                  <div className="p-6 -mt-6">
                    <div className="bg-zinc-800 rounded-lg p-4 border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-xl font-bold text-zinc-100">
                            {title || "Untitled Set"}
                          </h3>
                          <p className="text-zinc-400 text-sm mt-1">
                            by {name}
                          </p>
                        </div>
                      </div>

                      <p className="text-zinc-300 mt-4 text-sm line-clamp-3">
                        {description || "No description provided."}
                      </p>

                      <div className="flex flex-wrap gap-2 mt-4">
                        {tags.length > 0 ? (
                          tags.map((tag, index) => (
                            <span
                              key={index}
                              className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs"
                            >
                              {tag}
                            </span>
                          ))
                        ) : (
                          <span className="bg-zinc-700 text-zinc-300 px-2 py-1 rounded-md text-xs">
                            No tags
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-zinc-700">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1 text-zinc-400 text-xs">
                            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
                              <Check className="h-3 w-3" />
                            </span>
                            0 questions
                          </div>
                          <div className="flex items-center gap-1 text-zinc-400 text-xs">
                            <span className="bg-zinc-700 text-zinc-300 rounded-full p-1">
                              <User className="h-3 w-3" />
                            </span>
                            0 plays
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="default"
                          className="text-xs h-8 border-zinc-700 text-zinc-300 hover:bg-zinc-700"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    onClick={() => setStep("info")}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                  >
                    Back to Edit
                  </Button>

                  <Button
                    type="submit"
                    form="create-set-form"
                    disabled={isSubmitting || !isFormValid}
                    className="bg-zinc-700 hover:bg-zinc-600 text-zinc-100"
                    // @ts-expect-error Expecting since we have a several stage modal
                    onClick={submitHandler}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Create Set
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
