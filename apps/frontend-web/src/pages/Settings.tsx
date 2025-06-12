import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import SideBar from "../components/SideBar";

export default function Settings() {
  return (
    <div className="min-w-screen flex">
      <SideBar position={"static"}></SideBar>
      <div className="w-full flex justify-center pt-[60px]">
        <div className="flex h-[600px] w-[1000px] bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 p-[20px]">
          <Tabs defaultValue="background" className="h-full w-full">
            <div className="h-full w-full flex">
              <TabsList className="h-[250px] w-[160px] bg-transparent flex flex-col justify-start items-start">
                <SettingsTab name="Background" value="background" />
                <SettingsTab name="Board" value="board" />
                <SettingsTab name="Pieces" value="pieces" />
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
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                      <div className="snap-start w-[300px] h-[160px] bg-[url(/bg_image.jpg)] bg-cover rounded-xl shrink-0" />
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="board" className="bg-green-200 p-4">
                joinre
              </TabsContent>
              <TabsContent value="pieces" className="bg-red-200 p-4 ">
                nrroieiorneornie
              </TabsContent>
              <TabsContent
                value="profile"
                className="bg-purple-200 p-4 rounded-md"
              >
                nrroieiorneornie
              </TabsContent>
              <TabsContent
                value="deleteAccount"
                className="bg-pink-200 p-4 rounded-md"
              >
                nrroieiorneornie
              </TabsContent>
              <TabsContent
                value="logout"
                className="bg-orange-200 p-4 rounded-md"
              >
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
