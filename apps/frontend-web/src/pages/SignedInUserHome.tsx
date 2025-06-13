import SideBar from "../components/SideBar";
import { useBgImageStore } from "../store/atoms";

export default function SignedInUserHome() {
  const bgImage = useBgImageStore((state) => state.bgImage);
  return (
    <div className={`flex min-h-screen ${bgImage} bg-fixed bg-cover bg-center`}>
      <SideBar position="fixed" />
      <div className="py-[50px] flex flex-col gap-3 items-center w-full">
        <div className="bg-black bg-cover bg-center bg-no-repeat w-[950px] h-[150px] rounded-2xl" />
        <div className="flex h-[100px] w-[950px]">
          <div className="h-full">Rank</div>
          <div>Rapid</div>
          <div>Blitz</div>
          <div>Bullet</div>
        </div>
        <div className="flex">
          <div className="h-[400px] w-[300px] bg-amber-100">
            <div>New Game</div>
            <div>Play a Friend</div>
            <div>Analyze your Games</div>
          </div>
          <div className="h-[400px] w-[650px] bg-red-400">chart shadcn</div>
        </div>
        <div className="flex">
          <div className="h-[400px] w-[650px] bg-red-400">Game History</div>
          <div className="h-[400px] w-[300px] bg-amber-100">
            <div>New Game</div>
            <div>Play a Friend</div>
            <div>Analyze your Games</div>
          </div>
        </div>
      </div>
    </div>
  );
}
