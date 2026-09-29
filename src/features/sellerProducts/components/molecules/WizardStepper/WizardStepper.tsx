import { Check } from "lucide-react";

import { cn } from "@/lib/utils";
import type { WizardStep } from "../../../types";

const WizardStepper = ({
  steps,
  activeIndex,
  onStepClick,
}: {
  steps: WizardStep[];
  activeIndex: number;
  onStepClick: (index: number) => void;
}) => (
  <ol className="flex flex-wrap items-center gap-x-1 gap-y-3">
    {steps.map((step, index) => {
      const isActive = index === activeIndex;
      const isDone = index < activeIndex;
      const Icon = step.icon;
      return (
        <li key={step.key} className="flex items-center">
          <button
            type="button"
            onClick={() => onStepClick(index)}
            className={cn(
              "flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold transition-colors sm:text-sm",
              isActive
                ? "bg-(--orange) text-white"
                : isDone
                  ? "text-(--orange-dark) hover:bg-(--orange-light)"
                  : "text-muted-foreground hover:bg-muted",
            )}
          >
            <span
              className={cn(
                "flex size-5 items-center justify-center rounded-full text-[10px]",
                isActive ? "bg-white/20" : isDone ? "bg-(--orange-light)" : "bg-muted",
              )}
            >
              {isDone ? <Check size={12} /> : <Icon size={12} />}
            </span>
            <span className="hidden sm:inline">{step.label}</span>
          </button>
          {index < steps.length - 1 && <span className="mx-1 h-px w-4 bg-border sm:w-6" aria-hidden="true" />}
        </li>
      );
    })}
  </ol>
);

export default WizardStepper;
