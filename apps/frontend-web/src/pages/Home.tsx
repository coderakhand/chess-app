import { useUserInfoStore } from "../store/atoms";
import GuestUserHome from "../components/GuestUserHome";
import SignedInUserHome from "../components/SignedInUserHome";


export default function Home() {
  const isGuest = useUserInfoStore((state) => state.userInfo.isGuest);

  if (isGuest) {
    return <GuestUserHome />;
  }

  return <SignedInUserHome />;
}
