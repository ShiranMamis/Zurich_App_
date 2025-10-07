import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "@/public/zurich_dollar.json";
function MoneyAnimation() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;

    if (!container) return;

    const anim = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData, // Pass your animation data here
    });

    return () => {
      // Clean up animation when component unmounts
      anim.destroy();
    };
  }, []);

  return <div ref={containerRef} />;
}

export default MoneyAnimation;
