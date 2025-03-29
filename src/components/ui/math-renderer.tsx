"use client";

import { MathJax, MathJaxContext } from "better-react-mathjax";
import { useEffect, useState } from "react";

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

// Function to decode URL-encoded text
const decodeText = (text: string): string => {
  try {
    // Replace URL-encoded characters with their actual values
    // %24 -> $, %20 -> space, etc.
    return decodeURIComponent(text);
  } catch (error) {
    console.error("Error decoding text:", error);
    return text; // Return original text if decoding fails
  }
};

// Text to Render
export function MathRender({ text }: { text: string }) {
  const [isClient, setIsClient] = useState(false);
  const [decodedText, setDecodedText] = useState("");

  // Decode the text when it changes
  useEffect(() => {
    if (text) {
      setDecodedText(decodeText(text));
    }
  }, [text]);

  // Ensure component only renders on client-side to avoid hydration issues
  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) {
    return <div className="p-4 text-gray-400">Loading math renderer...</div>;
  }

  return (
    <MathJaxContext config={config}>
      <div className="math-content">
        <MathJax>{decodedText}</MathJax>
      </div>
    </MathJaxContext>
  );
}
