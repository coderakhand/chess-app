import { useState } from "react";
import { useTheme } from "../components/ThemeProvider";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../components/ui/tabs";
import { Palette, Bell, Shield, User, Monitor } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";
import { Button } from "../components/ui/button";
import { Separator } from "../components/ui/separator";
import ChessBoard from "../components/ChessBoard";
import SideBar from "../components/SideBar";

export default function Settings() {
  const { theme, setTheme } = useTheme();
  const [boardTheme, setBoardTheme] = useState("classic");
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const boardThemes = [
    {
      id: "classic",
      name: "Classic Green",
      preview: "bg-green-100 border-green-600",
    },
    { id: "wood", name: "Wood", preview: "bg-amber-100 border-amber-800" },
    { id: "marble", name: "Marble", preview: "bg-gray-100 border-gray-600" },
    { id: "blue", name: "Ocean Blue", preview: "bg-blue-100 border-blue-600" },
    {
      id: "purple",
      name: "Royal Purple",
      preview: "bg-purple-100 border-purple-600",
    },
  ];
  return (
    <div
      className={`min-h-screen min-w-screen bg-[url(/background/bg-1.jpg)] bg-fixed bg-cover bg-center dark:bg-gradient-to-br dark:from-[#09090B] dark:via-[#0B0B0E] dark:to-[#09090B] font-dream`}
    >
      <SideBar />
      <div
        className={` max-sm:pt-[80px] sm:pl-[60px] min-w-screen min-h-screen p-4`}
      >
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 dark:text-white">
            <h1 className="text-3xl font-bold mb-2">Settings</h1>
            <p className="dark:text-[#A1A1AA] font-proza">
              Customize your chess experience
            </p>
          </div>

          <Tabs defaultValue="appearance" className="space-y-6">
            <TabsList className="h-[40px] py-[3px] px-[20px] grid w-full grid-cols-4 bg-white/30 backdrop-blur-md rounded-xl shadow-xl border border-white/40 dark:bg-[#27272A] dark:border-none">
              <TabsTrigger
                value="appearance"
                className="flex items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
              >
                <Palette className="w-4 h-4" />
                <p className="max-smd:hidden">Appearance</p>
              </TabsTrigger>
              <TabsTrigger
                value="game"
                className="flex items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
              >
                <Monitor className="w-4 h-4 " />
                <p className="max-smd:hidden">Game</p>
              </TabsTrigger>
              <TabsTrigger
                value="notifications"
                className="flex items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
              >
                <Bell className="w-2 h-2 smd:w-4 smd:h-4" />
                <p className="max-smd:hidden">Notifications</p>
              </TabsTrigger>
              <TabsTrigger
                value="account"
                className="flex items-center gap-2 data-[state=active]:bg-white/40 dark:text-[#A1A1AA] dark:data-[state=active]:bg-black dark:data-[state=active]:text-white dark:data-[state=active]:border-none"
              >
                <User className="w-4 h-4" />
                <p className="max-smd:hidden">Account</p>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appearance" className="space-y-6 ">
              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle>Theme</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Choose your preferred color scheme
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="theme-mode">Theme Mode</Label>
                    <Select value={theme} onValueChange={setTheme}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle>Chess Board Theme</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Select your preferred board appearance
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {boardThemes.map((themeItem) => (
                      <div
                        key={themeItem.id}
                        className={`cursor-pointer rounded-lg border-2 p-4 transition-colors dark:text-[#A1A1AA] ${
                          boardTheme === themeItem.id
                            ? "border-green-600 bg-green-50 dark:bg-green-950"
                            : "border-border hover:border-muted-foreground"
                        }`}
                        onClick={() => setBoardTheme(themeItem.id)}
                      >
                        <div
                          className={`w-full h-16 rounded mb-2 ${themeItem.preview}`}
                        />
                        <p className="text-sm font-medium text-center">
                          {themeItem.name}
                        </p>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div>
                    <Label className="text-base font-medium mb-4 block">
                      Preview
                    </Label>
                    <div className="flex justify-center">
                      <div className="scale-75">
                        <ChessBoard socket={null} />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="game" className="space-y-6">
              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle>Game Preferences</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Configure your gameplay settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sound" className="font-semibold">
                        Show Valid Moves
                      </Label>
                      <p className="text-sm text-muted-foreground dark:text-[#A1A1AA]">
                        Show valid moves for a piece on click
                      </p>
                    </div>
                    <Switch
                      id="sound"
                      checked={soundEnabled}
                      onCheckedChange={setSoundEnabled}
                    />
                  </div>

                  <Separator className="dark:bg-[#27272A]" />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="auto-queen" className="font-medium">
                      Auto-promote to Queen
                    </Label>
                    <Switch id="auto-queen" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="enable-premoves" className="font-medium">
                      Enable Premoves
                    </Label>
                    <Switch id="enable-moves" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-coordinates" className="font-medium">
                      Show Board Coordinates
                    </Label>
                    <Switch id="show-coordinates" defaultChecked />
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white ">
                <CardHeader>
                  <CardTitle>Time Controls</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Set your preferred time controls
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="default-time" className="font-semibold">
                      Default Time Control
                    </Label>
                    <Select defaultValue="10+0">
                      <SelectTrigger className="w-32">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                        <SelectItem value="3|0">3 | 0</SelectItem>
                        <SelectItem value="3|2">3 | 2</SelectItem>
                        <SelectItem value="5+0">5 | 0</SelectItem>
                        <SelectItem value="10+0">10 | 0</SelectItem>
                        <SelectItem value="15+10">15 | 10</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle>Notification Settings</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Manage how you receive notifications
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="notifications" className="font-semibold">
                        Enable Notifications
                      </Label>
                      <p className="text-sm text-muted-foreground dark:text-[#A1A1AA]">
                        Receive notifications for game invites and messages
                      </p>
                    </div>
                    <Switch
                      id="notifications"
                      checked={notificationsEnabled}
                      onCheckedChange={setNotificationsEnabled}
                    />
                  </div>

                  <Separator className="dark:bg-[#27272A]" />

                  <div className="flex items-center justify-between">
                    <Label htmlFor="game-invites" className="font-medium">
                      Game Invitations
                    </Label>
                    <Switch id="game-invites" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="friend-requests" className="font-medium">
                      Friend Requests
                    </Label>
                    <Switch id="friend-requests" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="tournament-updates" className="font-medium">
                      Tournament Updates
                    </Label>
                    <Switch id="tournament-updates" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label
                      htmlFor="email-notifications"
                      className="font-medium"
                    >
                      Email Notifications
                    </Label>
                    <Switch id="email-notifications" />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account" className="space-y-6">
              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white">
                <CardHeader>
                  <CardTitle>Account Information</CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Manage your account details
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Username</Label>
                      <p className="text-sm text-muted-foreground mt-1 dark:text-[#A1A1AA]">
                        ChessPlayer
                      </p>
                    </div>
                    <div>
                      <Label>Email</Label>
                      <p className="text-sm text-muted-foreground mt-1 dark:text-[#A1A1AA]">
                        player@example.com
                      </p>
                    </div>
                    <div>
                      <Label>Rating</Label>
                      <p className="text-sm text-muted-foreground mt-1 dark:text-[#A1A1AA]">
                        1200
                      </p>
                    </div>
                    <div>
                      <Label>Member Since</Label>
                      <p className="text-sm text-muted-foreground mt-1 dark:text-[#A1A1AA]">
                        January 2024
                      </p>
                    </div>
                  </div>

                  <Separator className="dark:bg-[#27272A]" />

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      className="dark:hover:bg-[#27272A] dark:border-[#27272A] cursor-pointer"
                    >
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="dark:hover:bg-[#27272A] dark:border-[#27272A] cursor-pointer"
                    >
                      Update Email
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/30 backdrop-blur-md rounded-xl shadow-md border border-white/40 dark:border-[#27272A] dark:bg-[#09090B] dark:text-white ">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-green-600" />
                    Privacy & Security
                  </CardTitle>
                  <CardDescription className="dark:text-[#A1A1AA] font-proza">
                    Control your privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="profile-public" className="font-semibold">
                      Public Profile
                    </Label>
                    <Switch id="profile-public" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="show-rating" className="font-semibold">
                      Show Rating
                    </Label>
                    <Switch id="show-rating" defaultChecked />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="allow-challenges" className="font-semibold">
                      Allow Challenges from Anyone
                    </Label>
                    <Switch id="allow-challenges" defaultChecked />
                  </div>

                  <Separator />

                  <Button
                    variant="destructive"
                    className="w-full font-semibold bg-red-800 hover:bg-[#731C1B] dark:bg-[#7F1E1D] dark:hover:bg-[#731C1B] cursor-pointer"
                  >
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
