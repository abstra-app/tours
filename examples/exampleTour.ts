import { runTour } from "../src";

async function recordStepViewed(tourKey: string, stepKey: string) {
  const viewedSteps = fetchViewedSteps(tourKey);
  viewedSteps.push(stepKey);

  localStorage.setItem("abstra-tour", JSON.stringify(viewedSteps));
}

function fetchViewedSteps(tourKey: string) {
  return JSON.parse(localStorage.getItem(`abstra-tour-${tourKey}`) || "[]");
}

export const initExampleTour = () =>
  runTour(
    "example-tour",
    [
      {
        hint: "Click here!",
        key: "first-step",
        type: "beacon",
        targetElementXpath: "//*[contains(@class, 'first-element')]",
        position: {
          top: "0px",
          left: "0px",
        },
        hintPosition: "right",
      },
    ],
    fetchViewedSteps,
    recordStepViewed
  );
