
import { Button } from "../ui/button";
import { useSidebar } from "../ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";
import { LogOut, Sidebar, User2, Palette } from "lucide-react";
import { useBar } from "@/context/sidebarcontext";
import { Input } from "../ui/input";
import { DropdownMenu } from "../ui/dropdown-menu";
import { DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { Separator } from "../ui/separator";
import { useAuth } from "@/context/authcontext";
import { NavLink } from "react-router-dom";
import { useTheme } from "../../context/themecontext";
import { useSearch } from "@/context/searchcontext";

function TopBar() {
  const { toggleSidebar } = useSidebar();
  const { isOpen, setOpen } = useBar();
  const { logout } = useAuth();
  const { themeName, setThemeName, themeColors } = useTheme();
  const { query, setQuery } = useSearch();

  return (
    <header
      className="py-2 px-6 border-x-0 border-2 sticky top-0 flex gap-4 z-50 justify-around"
      style={{
        background: themeColors.background,
        color: themeColors.text,
        borderBottom: `2px solid ${themeColors.border}`,
      }}
    >
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            onClick={() => {
              toggleSidebar();
              setOpen((prev) => !prev);
            }}
            className="cursor-pointer"
            style={{
              background: themeColors.cardBg || themeColors.cardBackground,
              color:
                themeColors.primary === "#4F3325"
                  ? "#2d160a" // much darker brown for coffee theme
                  : themeColors.text,
            }}
          >
            <Sidebar />
            {isOpen ? "Collapse" : "Expand"}
          </Button>
        </TooltipTrigger>
        <TooltipContent>Toggle the sidebar</TooltipContent>
      </Tooltip>
      <Input
        type="text"
        placeholder="Search..."
        className="min-w-[6rem] md:max-w-[50%]"
        style={{ background: themeColors.cardBg || themeColors.cardBackground, color: themeColors.text, border: `1px solid ${themeColors.border}` }}
        value={query}
        onChange={e => setQuery(e.target.value)}
      />
      <div className="flex items-center gap-2">
        {/* Account Actions Dropdown */}
        <Tooltip>
          <TooltipTrigger>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full h-10 w-10 cursor-pointer flex items-center justify-center"
                  style={{ background: themeColors.primary, color: themeColors.buttonText || themeColors.text }}
                >
                  EA
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={12}
                className="p-4"
                style={{ background: themeColors.cardBg || themeColors.cardBackground, color: themeColors.text }}
              >
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Account Actions</DropdownMenuLabel>
                  <Separator className="my-2" style={{ background: themeColors.border }} />
                  <DropdownMenuItem className="my-2">
                    <NavLink to={"/admin/settings"} className="flex gap-2 outline-1 p-1 rounded" style={{ color: themeColors.text }}>
                      <User2 /> Profile
                    </NavLink>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="flex">
                    <Button onClick={logout} className="cursor-pointer" style={{ background: themeColors.error, color: themeColors.buttonText || themeColors.text }}>
                      <LogOut /> Sign Out
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>View Profile</TooltipContent>
        </Tooltip>
        {/* Theme Dropdown */}
        <Tooltip>
          <TooltipTrigger asChild>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  className="rounded-full h-10 w-10 cursor-pointer flex items-center justify-center"
                  style={{ background: themeColors.primary, color: themeColors.buttonText || themeColors.text }}
                >
                  <Palette className="w-5 h-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                side="top"
                sideOffset={12}
                className="p-2 min-w-[180px]"
                style={{ background: themeColors.cardBg || themeColors.cardBackground, color: themeColors.text }}
              >
                <DropdownMenuLabel>Choose a theme</DropdownMenuLabel>
                <Separator className="my-2" style={{ background: themeColors.border }} />
                <DropdownMenuGroup>
                  <DropdownMenuItem
                    onClick={() => setThemeName("default")}
                    className="flex items-center gap-2 rounded px-3 py-2 transition-colors cursor-pointer"
                    style={{
                      background: themeName === 'default' ? themeColors.accent || '#e2e8f0' : undefined,
                      color: themeName === 'default' ? themeColors.primary : undefined,
                    }}
                  >
                    <span role="img" aria-label="default">🖥️</span>
                    <span className="font-semibold">Default</span>
                    <span className="ml-auto w-4 h-4 rounded-full border border-slate-400" style={{ background: '#f1f5f9' }}></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setThemeName("roseFlower")}
                    className="flex items-center gap-2 rounded px-3 py-2 transition-colors cursor-pointer"
                    style={{
                      background: themeName === 'roseFlower' ? themeColors.accent || '#ffe5ef' : undefined,
                      color: themeName === 'roseFlower' ? themeColors.primary : undefined,
                    }}
                  >
                    <span role="img" aria-label="rose">🌹</span>
                    <span className="font-semibold">Rose</span>
                    <span className="ml-auto w-4 h-4 rounded-full border border-pink-300" style={{ background: '#FFD6E0' }}></span>
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setThemeName("coffee")}
                    className="flex items-center gap-2 rounded px-3 py-2 transition-colors cursor-pointer"
                    style={{
                      background: themeName === 'coffee' ? themeColors.accent || '#B39885' : undefined,
                      color: themeName === 'coffee' ? themeColors.primary : undefined,
                    }}
                  >
                    <span role="img" aria-label="coffee">☕</span>
                    <span className="font-semibold">Coffee</span>
                    <span className="ml-auto w-4 h-4 rounded-full border border-yellow-700" style={{ background: '#B39885' }}></span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </TooltipTrigger>
          <TooltipContent>Choose a theme</TooltipContent>
        </Tooltip>
      </div>
    </header>
  );
}
export default TopBar;
