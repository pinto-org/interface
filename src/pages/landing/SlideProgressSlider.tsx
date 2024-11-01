import React from "react";

interface SlideProgressSliderProps {
  progress: number;
  onChange: (value: number) => void;
}

const SlideProgressSlider: React.FC<SlideProgressSliderProps> = ({
  progress,
  onChange,
}) => {
  return (
    <div
      className="slide-progress-slider"
      style={{
        position: "absolute",
        bottom: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        width: "100%",
        maxWidth: "300px",
      }}
    >
      <input
        type="range"
        min="0"
        max="2"
        step="0.001"
        value={progress}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "100%" }}
      />
    </div>
  );
};

export default SlideProgressSlider;
