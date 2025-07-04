import { useUserInfoStore } from "../store/atoms";
import GuestUserHome from "../components/GuestUserHome";
import SignedInUserHome from "../components/SignedInUserHome";
import useAuth from "../hooks/useAuth";

export default function Home() {
  useAuth();
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  if (isGuest) {
    return <GuestUserHome />;
  }

  return <SignedInUserHome />;
}
