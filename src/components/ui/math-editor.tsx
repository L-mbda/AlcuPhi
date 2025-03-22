"use client";

import { useState, useEffect, useRef } from "react";
import { MathJax, MathJaxContext } from "better-react-mathjax";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";

// MathJax configuration
const config = {
  loader: { load: ["input/tex", "output/svg"] },
  tex: {
    inlineMath: [["$", "$"]],
    displayMath: [["$$", "$$"]],
    processEscapes: true,
  },
  svg: {
    fontCache: "global",
  },
  startup: {
    typeset: false, // Important: Let us control when typesetting happens
  },
};

export function MathEditor({
  id,
  value,
  onChange,
  placeholder,
  minHeight = "120px",
}: {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  minHeight?: string;
}) {
  const [activeTab, setActiveTab] = useState<string>("write");
  const [previewContent, setPreviewContent] = useState<string>("");
  const [previewError, setPreviewError] = useState<string | null>(null);
  const previewTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safely prepare content for preview with error handling
  const preparePreviewContent = (content: string) => {
    if (!content.trim()) {
      setPreviewContent("");
      setPreviewError(null);
      return;
    }

    try {
      // Simple validation to catch obvious syntax errors
      const openDollars = (content.match(/\$/g) || []).length;
      const openDoubleDollars = (content.match(/\$\$/g) || []).length;

      if (openDollars % 2 !== 0 || openDoubleDollars % 2 !== 0) {
        setPreviewError("Warning: You may have unclosed math delimiters ($)");
      } else {
        setPreviewError(null);
      }

      setPreviewContent(content);
    } catch (error) {
      console.error("Error preparing preview:", error);
      setPreviewError("Error preparing preview");
      setPreviewContent(content); // Still try to render what we can
    }
  };

  // Debounced update of preview content
  useEffect(() => {
    if (previewTimerRef.current) {
      clearTimeout(previewTimerRef.current);
    }

    previewTimerRef.current = setTimeout(() => {
      preparePreviewContent(value);
    }, 300);

    return () => {
      if (previewTimerRef.current) {
        clearTimeout(previewTimerRef.current);
      }
    };
  }, [value]);

  // Force update preview when switching to preview tab
  useEffect(() => {
    if (activeTab === "preview") {
      preparePreviewContent(value);
    }
  }, [activeTab, value]);

  return (
    <MathJaxContext config={config}>
      <Tabs
        defaultValue="write"
        value={activeTab}
        onValueChange={setActiveTab}
        className="w-full gap-2 flex flex-col"
      >
        <TabsList className="grid grid-cols-2 bg-zinc-800">
          <TabsTrigger
            value="write"
            className="data-[state=active]:bg-zinc-700"
          >
            Write
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-zinc-700"
          >
            Preview
          </TabsTrigger>
        </TabsList>
        <TabsContent value="write" className="mt-0">
          <Textarea
            id={id}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full bg-zinc-800 border-zinc-700 text-zinc-100 placeholder:text-zinc-500 resize-y`}
            style={{ minHeight }}
          />
          <div className="mt-1 text-xs text-zinc-500 flex flex-wrap gap-x-3">
            <span>Use $x^2$ for inline math</span>
            <span>Use $$\sum_{"{(i = 1)}"}^n i$$ for block math</span>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-0">
          <div
            className={`w-full bg-zinc-800 border border-zinc-700 rounded-md p-3 text-zinc-100 overflow-auto`}
            style={{ minHeight }}
          >
            {previewError && (
              <div className="text-amber-400 text-xs mb-2 p-1 bg-amber-950/30 rounded border border-amber-800/50">
                {previewError}
              </div>
            )}

            {previewContent ? (
              <div className="mathjax-preview">
                <MathJax dynamic>{previewContent}</MathJax>
              </div>
            ) : (
              <div className="text-zinc-500 italic">
                Preview will appear here...
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </MathJaxContext>
  );
}
