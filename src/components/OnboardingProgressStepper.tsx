import React from 'react';
import { cn } from '@/lib/utils'; // For conditional class names

interface OnboardingProgressStepperProps {
  currentStep: number; // 0-indexed
  totalSteps: number;
  stepLabels?: string[]; // Optional labels for each step
  className?: string;
}

const OnboardingProgressStepper: React.FC<OnboardingProgressStepperProps> = ({
  currentStep,
  totalSteps,
  stepLabels,
  className,
}) => {
  console.log(`Rendering OnboardingProgressStepper: currentStep=${currentStep}, totalSteps=${totalSteps}`);

  if (totalSteps <= 0) {
    console.warn("OnboardingProgressStepper: totalSteps must be positive.");
    return null;
  }
  if (currentStep < 0 || currentStep >= totalSteps) {
    console.warn(`OnboardingProgressStepper: currentStep ${currentStep} is out of bounds for ${totalSteps} steps.`);
    // Optionally clamp currentStep or return null/error
  }

  return (
    <div className={cn("flex items-center w-full space-x-2 md:space-x-4", className)}>
      {Array.from({ length: totalSteps }).map((_, index) => {
        const isActive = index === currentStep;
        const isCompleted = index < currentStep;
        const label = stepLabels && stepLabels[index] ? stepLabels[index] : `Step ${index + 1}`;

        return (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-medium transition-colors",
                  isActive ? "bg-blue-500 text-white" :
                  isCompleted ? "bg-green-500 text-white" :
                  "bg-gray-200 text-gray-500"
                )}
              >
                {isCompleted ? '✓' : index + 1}
              </div>
              {stepLabels && (
                <span className={cn(
                    "text-xs text-center mt-1 hidden sm:block",
                    isActive ? "text-blue-600 font-semibold" : "text-gray-500"
                )}>
                    {label}
                </span>
              )}
            </div>
            {index < totalSteps - 1 && (
              <div className={cn(
                "flex-1 h-1 rounded",
                isCompleted ? "bg-green-500" : "bg-gray-200"
              )} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default OnboardingProgressStepper;