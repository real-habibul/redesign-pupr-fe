"use client";
import * as React from "react";
import clsx from "clsx";

type StepperProps = {
  currentStep: number;
  numberOfSteps: number;
  labels?: string[];
  className?: string;
};

export default function Stepper({
  currentStep,
  numberOfSteps,
  labels = [],
  className,
}: StepperProps) {
  const steps = Math.max(1, numberOfSteps);

  const outerClass = (index: number) => {
    if (currentStep > index) return "bg-solid_basic_blue_500";
    if (currentStep === index) return "border-4 bg-solid_basic_blue_50";
    return "border-4 bg-solid_basic_neutral_200";
  };

  const outerStyle = (index: number): React.CSSProperties | undefined => {
    if (currentStep === index) {
      return { borderColor: "var(--color-solid-basic-blue-500)" };
    }
    if (currentStep < index) {
      return { borderColor: "var(--color-solid-basic-neutral-200)" };
    }
    return {};
  };

  const innerClass = (index: number) => {
    if (currentStep > index)
      return "bg-solid_basic_blue_500 text-solid_basic_blue_50 text-B1 items-center";
    if (currentStep === index)
      return "bg-solid_basic_blue_500 text-solid_basic_blue_50";
    return "bg-solid_basic_neutral_200 text-solid_basic_blue_50 text-B1 items-center";
  };

  const isFinalStep = (i: number) => i === steps - 1;

  return (
    <div
      className={clsx("flex justify-center items-start", className)}
      role="group"
      aria-label="Step progress">
      {Array.from({ length: steps }).map((_, index) => (
        <React.Fragment key={index}>
          <div
            className="flex flex-col items-center"
            aria-current={currentStep === index ? "step" : undefined}>
            {/* Outer circle */}
            <div
              className={clsx(
                "w-10 h-10 rounded-full flex items-center justify-center",
                outerClass(index)
              )}
              style={outerStyle(index)}
              aria-label={`Step ${index + 1}`}>
              {/* Inner circle */}
              <div
                className={clsx(
                  "w-6 h-6 rounded-full flex items-center justify-center",
                  innerClass(index)
                )}>
                {index + 1}
              </div>
            </div>

            {/* Label */}
            <div className="mt-2 w-40 h-auto flex justify-center items-center">
              <div className="text-emphasis_light_on_surface_medium text-center">
                {labels[index] || `Step ${index + 1}`}
              </div>
            </div>
          </div>

          {/* Connector */}
          {!isFinalStep(index) && (
            <div
              className={clsx(
                "h-1 w-full max-w-[242px] rounded-full mt-5",
                currentStep > index
                  ? "bg-solid_basic_blue_500"
                  : "bg-solid_basic_neutral_200"
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );
}
