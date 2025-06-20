import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SideBar from "../components/SideBar";
import { useBgImageStore, useBoardStore } from "../store/atoms";
import { useState } from "react";
import { boardColorsList } from "../config";
import SampleSelectBoard, {
  SmallBoard,
} from "../components/settings/SampleSelectBoard";

export default function Settings() {
  const bgImage = useBgImageStore((state) => state.bgImage);
  const setBgImage = useBgImageStore((state) => state.setBgImage);
  const [sampleBoardColor, setSampleBoardColor] = useState({
    id: 0,
    darkSquare: boardColorsList[0].darkSquare,
    lightSquare: boardColorsList[0].lightSquare,
  });
  const setDarkSquareBoardColor = useBoardStore((state) => state.setDarkSquare);
  const setLightSquareBoardColor = useBoardStore(
    (state) => state.setLightSquare
  );

  return (
    <div className={`min-w-screen flex ${bgImage} bg-fixed bg-cover bg-center`}>
      <SideBar position="static" />
      <div className="w-full flex justify-center pt-[60px]">
        <div className="flex h-[600px] w-[1000px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 p-[20px]">
          <Tabs defaultValue="background" className="h-full w-full">
            <div className="h-full w-full flex">
              <TabsList className="h-[250px] w-[160px] bg-transparent flex flex-col justify-start items-start">
                <SettingsTab name="Background" value="background" />
                <SettingsTab name="Board & Pieces" value="board" />
                <SettingsTab name="Game Settings" value="gameSettings" />
                <SettingsTab name="Profile" value="profile" />
                <SettingsTab name="Delete Account" value="deleteAccount" />
                <SettingsTab name="Log Out" value="logout" />
              </TabsList>

              <div className="h-full w-[0.8px] bg-black ml-[10px] mr-[20px]" />

              <TabsContent
                value="background"
                className="w-full p-4 overflow-hidden"
              >
                <div className="flex flex-col gap-2">
                  <label className="px-[10px] text-xl">Images</label>
                  <div className="w-full overflow-x-auto">
                    <div className="flex w-max gap-3 snap-x snap-mandatory">
                      {[
                        "bg-[url(/background/bg-1.jpg)]",
                        "bg-[url(/background/bg-2.jpg)]",
                        "bg-[url(/background/bg-3.jpg)]",
                        "bg-[url(/background/bg-4.jpg)]",
                      ].map((bg, i) => (
                        <div
                          key={i}
                          className={`snap-start w-[300px] h-[160px] ${bg} bg-cover rounded-xl shrink-0 cursor-pointer`}
                          onClick={() => setBgImage(`${bg}`)}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="board" className="p-4">
                <div className="flex">
                  <div className="flex flex-col gap-10">
                    <div>
                      <label htmlFor="board" className="px-[4px] text-lg">
                        Board
                      </label>
                      <div className="mt-[10px] flex gap-3">
                        {boardColorsList.map((item, idx) => (
                          <SampleSelectBoard
                            id={idx}
                            darkSquare={item.darkSquare}
                            lightSquare={item.lightSquare}
                            sampleBoardColor={sampleBoardColor}
                            setSampleBoardColor={setSampleBoardColor}
                            key={idx}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <label htmlFor="pieces" className="text-lg">
                        Pieces
                      </label>
                      <div>{/* piece styles */}</div>
                    </div>
                  </div>
                  <div className="flex-grow flex justify-end">
                    <SmallBoard
                      darkSquare={sampleBoardColor.darkSquare}
                      lightSquare={sampleBoardColor.lightSquare}
                      size="200"
                    />
                  </div>
                </div>
                <div className="pr-[240px] flex justify-end w-full">
                  <button
                    onClick={() => {
                      setDarkSquareBoardColor(sampleBoardColor.darkSquare);
                      setLightSquareBoardColor(sampleBoardColor.lightSquare);
                    }}
                    className="cursor-pointer bg-white/30 backdrop-blur-md shadow-md border border-white/40 text-2xl w-[80px] h-[40px] rounded-xl"
                  >
                    Save
                  </button>
                </div>
              </TabsContent>

              <TabsContent value="gameSettings" className="p-4">
                nrroieiorneornie
              </TabsContent>

              <TabsContent value="profile" className="p-4">
                nrroieiorneornie
              </TabsContent>

              <TabsContent value="deleteAccount" className="p-4">
                nrroieiorneornie
              </TabsContent>

              <TabsContent value="logout" className="p-4">
                nrroieiorneornie
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function SettingsTab({ value, name }: { value: string; name: string }) {
  return (
    <TabsTrigger
      value={value}
      className="h-[20px] text-lg w-full flex justify-start"
    >
      {name}
    </TabsTrigger>
  );
}

// function SettingsTabContent({ value }: { value: string }) {
//   return (
//     <TabsContent value={value} className="bg-orange-200 p-4 rounded-md">
//       {/* content */}
//     </TabsContent>
//   );
// }
