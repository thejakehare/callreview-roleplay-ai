import { useEffect, useState } from "react";

const prompts = [
  "I'd like to roleplay financial objections",
  "Let's practice handling price concerns",
  "Help me with negotiation scenarios",
  "Can we roleplay difficult customer conversations",
  "I want to practice overcoming sales objections",
  "Let's simulate a complex sales situation",
];

export const ScrollingPrompts = () => {
  const [currentPrompt, setCurrentPrompt] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentPrompt((prev) => (prev + 1) % prompts.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="h-8 overflow-hidden relative mt-4">
      {prompts.map((prompt, index) => (
        <div
          key={index}
          className={`absolute w-full transition-all duration-500 ${
            index === currentPrompt
              ? "translate-y-0 opacity-100"
              : "-translate-y-8 opacity-0"
          }`}
        >
          <p className="text-muted-foreground text-sm italic">{prompt}</p>
        </div>
      ))}
    </div>
  );
};