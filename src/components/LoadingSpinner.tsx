import { useEffect, useState } from "react";

const svgs = Object.values(import.meta.glob<{ default: string }>("@/assets/misc/Spinner-*.svg", { eager: true })).map(
  (module) => module.default,
);

const FrameAnimator = ({ size = 40, duration = 100, repeat = true, className = "", onComplete = () => {} }) => {
  const [currentFrame, setCurrentFrame] = useState(0);
  const [nextFrame, setNextFrame] = useState(1);
  const [blendAmount, setBlendAmount] = useState(0);

  const frames = Array.from({ length: 8 }, (_, i) => ({
    src: svgs[i],
    duration,
  }));

  useEffect(() => {
    const frameInterval = setInterval(() => {
      setBlendAmount((prev) => {
        const next = prev + 0.1;
        if (next >= 1) {
          // Update frames when blend is complete
          setCurrentFrame(nextFrame);
          setNextFrame(nextFrame < frames.length - 1 ? nextFrame + 1 : 0);

          if (!repeat && nextFrame === 0) {
            onComplete();
          }
          return 0;
        }
        return next;
      });
    }, duration / 10);

    return () => clearInterval(frameInterval);
  }, [nextFrame, frames.length, duration, repeat, onComplete]);

  return (
    <div className={`relative inline-block ${className}`} style={{ width: size, height: size }}>
      {/* Preload all SVGs */}
      <div className="hidden">
        {frames.map((frame, index) => (
          <img key={`preload-${index}`} src={frame.src} alt={`preload ${index}`} />
        ))}
      </div>

      <div className="relative w-full h-full">
        {/* Current frame */}
        <img
          src={frames[currentFrame].src}
          alt={`spinner frame ${currentFrame + 1}`}
          className="w-full h-full object-contain absolute inset-0"
          style={{ opacity: 1 - blendAmount }}
        />

        {/* Next frame */}
        <img
          src={frames[nextFrame].src}
          alt={`spinner frame ${nextFrame + 1}`}
          className="w-full h-full object-contain absolute inset-0 mix-blend-multiply"
          style={{ opacity: blendAmount }}
        />
      </div>
    </div>
  );
};

export default FrameAnimator;
