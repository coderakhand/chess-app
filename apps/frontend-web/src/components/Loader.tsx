import { motion } from "framer-motion";

export default function Loader() {
  return (
    <>
      <motion.div
        className="absolute left-[35%] aspect-square w-[30%] rounded-full bg-[#8CA2AD] dark:bg-green-600"
        animate={{
          bottom: ["0%", "0.08%"],
        }}
        transition={{
          duration: 0.65,
          ease: [0, 800, 1, 800],
          repeat: Infinity,
        }}
        style={{ position: "absolute" }}
      />

      <motion.div
        className="absolute  inset-0 border-6 border-white"
        animate={{ rotate: [0, 0, 90, 90] }}
        transition={{
          duration: 0.65,
          ease: "linear",
          times: [0, 0.3, 0.7, 1],
          repeat: Infinity,
        }}
      />
    </>
  );
}
