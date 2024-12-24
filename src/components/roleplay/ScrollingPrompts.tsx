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
    <div className="min-h-[3rem] relative w-full max-w-2xl mx-auto">
      {prompts.map((prompt, index) => (
        <div
          key={index}
          className={`absolute w-full transition-all duration-500 text-center ${
            index === currentPrompt
              ? "translate-y-0 opacity-70"
              : "-translate-y-8 opacity-0"
          }`}
        >
          <p className="text-white text-xl font-medium">{prompt}</p>
        </div>
      ))}
    </div>
  );
};