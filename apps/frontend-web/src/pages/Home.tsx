import { useUserInfoStore } from "../store/atoms";
import GuestUserHome from "../components/GuestUserHome";
import SignedInUserHome from "../components/SignedInUserHome";
import useAuth from "../hooks/useAuth";
import { motion } from "framer-motion";
import SideBar from "../components/SideBar";

export default function Home() {
  const { isUserLoading } = useAuth();
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  if (isUserLoading) {
    return (
      <div className="min-h-screen min-w-screen flex justify-center items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]">
        <SideBar />
        <div className="flex flex-col gap-3">
          <div className="relative h-[140px] aspect-square border-[3px] border-transparent">
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
          </div>
          <div className="text-white w-full flex justify-center h-10 items-center">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  if (isGuest) {
    return <GuestUserHome />;
  }

  return <SignedInUserHome />;
}
