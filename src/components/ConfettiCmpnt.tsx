import CanvasConfettiRealistic from "react-canvas-confetti/dist/presets/realistic";
import { type Options } from "canvas-confetti";

const ConfettiCmpnt = () => {
  const handleConfettiRun = (params: {
    confetti: (options?: Options) => void;
    // conductor: TConductorInstance;
  }) => {
    // onInit should be of type: (params: { confetti: TCanvasConfettiInstance; conductor: TConductorInstance }) => void
    params.confetti({
      particleCount: 300,
      angle: 220, //0 is right
      spread: 200, // angle width of confetti spread
      ticks: 300,
      origin: { x: 1.2, y: -0.25 }, //x is left, y is top
    });

    params.confetti({
      particleCount: 300,
      angle: -40, //0 is right
      spread: 200, // angle width of confetti spread
      ticks: 300,
      origin: { x: -0.2, y: -0.25 }, //x is left, y is top
    });
  };

  return (
    <>
      <CanvasConfettiRealistic onInit={handleConfettiRun} />
    </>
  );
};

export default ConfettiCmpnt;
