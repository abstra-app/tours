import { renderStep, type Step } from "./render";

const startedTours: string[] = [];

export async function runTour(
  tourKey: string,
  steps: Step[],
  fetchViewedSteps: (tourKey: string) => Promise<string[]>,
  recordStepViewed: (tourKey: string, stepKey: string) => Promise<void>
) {
  if (startedTours.includes(tourKey)) return;
  startedTours.push(tourKey);

  const viewedStepsKeys = await fetchViewedSteps(tourKey);

  const lastStepViewedIndex = viewedStepsKeys.reduce(
    (result: number, viewedStepKey) => {
      const currentMatch = steps.findIndex(
        (step) => step.key === viewedStepKey
      );
      if (currentMatch > -1) {
        return currentMatch;
      }
      return result;
    },
    -1
  );

  const remainingSteps = steps.slice(lastStepViewedIndex + 1);

  for (const step of remainingSteps) {
    const shouldShowCurrentPosition = remainingSteps.length !== steps.length;
    const currentPosition = shouldShowCurrentPosition
      ? steps.indexOf(step)
      : null;
    const totalSteps = steps.length;
    await renderStep(step, currentPosition, totalSteps);
    recordStepViewed(tourKey, step.key);
  }
}
