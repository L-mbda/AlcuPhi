"use client"

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

// Text to Render
export function MathRender({ text }: { text: string }) {
  const [isClient, setIsClient] = useState(false);

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
        <MathJax>{text}</MathJax>
      </div>
    </MathJaxContext>
  );
}
