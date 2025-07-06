import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function EvaluationBar({
  evalScore,
  mateScore,
}: {
  evalScore: number | null;
  mateScore: number | null;
}) {
  const [percentage, setPercentage] = useState(50);

  function getWhitePercentage(
    evaluation: number | null,
    mate: number | null
  ): number {
    if (mate !== null) return mate > 0 ? 100 : 0;
    if (evaluation === null || typeof evaluation !== "number") return 50;
    const capped = Math.max(-10, Math.min(10, evaluation));
    return ((capped + 10) / 20) * 100;
  }

  useEffect(() => {
    const newPercent = getWhitePercentage(evalScore, mateScore);
    setPercentage(newPercent);
  }, [evalScore, mateScore]);

  return (
    <div className="w-[34px] h-[580px] relative rounded-sm overflow-hidden">
      <motion.div
        className="absolute top-0 left-0 w-full bg-[#3F3D38]"
        animate={{ height: `${100 - percentage}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />

      <motion.div
        className="absolute bottom-0 left-0 w-full bg-white"
        animate={{ height: `${percentage}%` }}
        transition={{ duration: 0.7, ease: "easeInOut" }}
      />
    </div>
  );
}
