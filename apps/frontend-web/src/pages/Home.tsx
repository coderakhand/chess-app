import { useBgImageStore, useUserInfoStore } from "../store/atoms";
import GuestUserHome from "../components/GuestUserHome";
import SignedInUserHome from "../components/SignedInUserHome";
import useAuth from "../hooks/useAuth";
import SideBar from "../components/SideBar";

export default function Home() {
  const { userInfoLoading } = useAuth();
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);
  const bgImage = useBgImageStore((state) => state.bgImage);

  if (userInfoLoading) {
    return (
      <div
        className={`flex min-h-screen ${bgImage} bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B]`}
      >
        <SideBar position="fixed" />
        <div className="flex items-center justify-center min-w-screen min-h-screen">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
        </div>
      </div>
    );
  }

  if (isGuest) {
    return <GuestUserHome />;
  }

  return <SignedInUserHome />;
}
