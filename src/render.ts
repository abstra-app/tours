import { findElement, sleep } from "./utils";

export type Step = {
  hint: string;
  key: string;
  type: "beacon";
  targetElementXpath: string;
  position: Position;
  hintPosition?: "left" | "right";
};

type Position = {
  top?: string;
  left?: string;
  bottom?: string;
  right?: string;
};

const ANIMATION_STYLE = {
  position: "absolute",
  backgroundColor: "transparent",
  border: "1px solid #f22a18",
  borderRadius: "50%",
  top: "0",
  left: "0",
  right: "0",
  bottom: "0",
};

const ANIMATION_TRANSITION = [
  { transform: "scale(1)", opacity: 1 },
  { transform: "scale(2)", opacity: 0 },
];

const HINT_FOOTER_STYLE = {
  fontSize: "12px",
  width: "20px",
  alignSelf: "flex-end",
};

const hintStyle = (hintPosition: "left" | "right" = "left") => ({
  position: "absolute",
  padding: "10px 12px",
  backgroundColor: "#4E596A",
  color: "#FFFFFF",
  maxWidth: "200px",
  minWidth: "100px",
  fontSize: "14px",
  top: "0px",
  [hintPosition]: "20px",
  borderRadius: "4px",
  alignItems: "right",
  boxShadow: "0px 0px 10px rgba(0, 0, 0, 0.5)",
  display: "flex",
  flexDirection: "column",
  gap: "8px",
});

function beaconStyle(position: Position) {
  return {
    position: "absolute",
    backgroundColor: "#f22a18",
    width: "15px",
    height: "15px",
    borderRadius: "50%",
    pointerEvents: "initial",
    animation: "party 2.5s infinite linear",
    ...position,
  };
}

function highlightStyle(targetElement: HTMLElement | null) {
  if (!targetElement)
    return {
      display: "none",
    };

  const { x, y, width, height } = targetElement.getBoundingClientRect();

  return {
    position: "fixed",
    left: `${x}px`,
    top: `${y}px`,
    width: `${width}px`,
    height: `${height}px`,
    pointerEvents: "none",
    zIndex: 9000,
  };
}

export async function renderStep(
  step: Step,
  currentPosition: number | null,
  totalSteps: number
) {
  const renderers = {
    beacon: renderBeacon,
  };

  const render = renderers[step.type];
  if (!render) {
    throw new Error(`Unsupported step type: ${step.type}`);
  }

  let completed = false;

  while (!completed) {
    try {
      await render(step, currentPosition, totalSteps);
      completed = true;
      return;
    } catch (e) {
      completed = false;
      await sleep(1000);
    }
  }
}

async function renderBeacon(
  step: Step,
  currentPosition: number | null,
  totalSteps: number
) {
  let targetElement = findElement(step.targetElementXpath);
  if (!targetElement) return Promise.reject();

  return new Promise((resolve: (value: void) => void) => {
    const highlight = document.createElement("div");
    const beacon = document.createElement("div");
    const animation = document.createElement("div");

    document.body.appendChild(highlight);
    highlight.appendChild(beacon);
    beacon.appendChild(animation);

    Object.assign(animation.style, ANIMATION_STYLE);
    Object.assign(beacon.style, beaconStyle(step.position));

    animation.animate(ANIMATION_TRANSITION, {
      duration: 1000,
      iterations: Infinity,
      easing: "ease-in-out",
    });

    beacon.onmouseenter = () => {
      const hint = document.createElement("div");
      const hintFooter = document.createElement("div");

      if (currentPosition) {
        hintFooter.innerText = `${currentPosition + 1}/${totalSteps}`;
      }

      Object.assign(hint.style, hintStyle(step.hintPosition));
      Object.assign(hintFooter.style, HINT_FOOTER_STYLE);

      hint.innerText = step.hint;
      beacon.appendChild(hint);
      hint.appendChild(hintFooter);
    };

    beacon.onmouseleave = () => {
      if (beacon.lastChild) beacon.removeChild(beacon.lastChild);
    };

    const visibilityObserver = new IntersectionObserver(
      function (entries) {
        if (entries[entries.length - 1].intersectionRatio > 0) {
          highlight.style.display = "block";
          return;
        }

        highlight.style.display = "none";
        return;
      },
      { threshold: [0] }
    );
    if (targetElement) visibilityObserver.observe(targetElement);

    const updateInterval = setInterval(async () => {
      const newTargetElement = findElement(step.targetElementXpath);

      if (!targetElement || !newTargetElement) return;

      if (newTargetElement !== targetElement) {
        targetElement = newTargetElement;
        visibilityObserver.observe(targetElement);
        targetElement.addEventListener("click", next);
      }

      Object.assign(highlight.style, highlightStyle(targetElement));
    }, 1000 / 60);

    function next() {
      highlight.remove();
      animation.remove();
      visibilityObserver.disconnect();
      clearInterval(updateInterval);
      resolve();
    }
    if (targetElement) targetElement.addEventListener("click", next);
  });
}
