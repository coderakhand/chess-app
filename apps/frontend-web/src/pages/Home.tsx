import { useUserInfoStore } from "../store/atoms";
import GuestUserHome from "../components/GuestUserHome";
import SignedInUserHome from "../components/SignedInUserHome";
import useAuth from "../hooks/useAuth";
import SideBar from "../components/SideBar";
import Loader from "../components/Loader";

export default function Home() {
  const { isUserLoading } = useAuth();
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  if (isUserLoading) {
    return (
      <div className="min-h-screen min-w-screen items-center bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]">
        <SideBar />
        <div className="min-h-screen bg-black/20 flex-grow flex justify-center items-center">
          <div className="flex flex-col gap-3">
            <div className="relative h-[140px] aspect-square border-[3px] border-transparent">
              <Loader />
            </div>
            <div className="text-white w-full flex justify-center h-10 items-center">
              Loading...
            </div>
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
