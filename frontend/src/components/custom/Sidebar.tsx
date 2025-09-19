import { ChevronDown, ChevronUp, HomeIcon, LogOut, Settings, User2 } from "lucide-react"
import { Sidebar, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarSeparator } from "../ui/sidebar"
import paths from "@/utils/sideBarPaths"
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "../ui/dropdown-menu"
import { DropdownMenuItem } from "../ui/dropdown-menu"
import { NavLink, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

function Appsidebar() {
  const {pathname: currentPath} = useLocation()
  console.log(currentPath);
  return (
    <>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <div className="flex items-center gap-4">
                      <img src="./PLlogo.jpg" alt="PastLens Logo" width={40} height={20}/>
                      <span className="font-semibold text-[1rem]">PastLens</span>
                    </div>
                    <ChevronDown className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-[--radix-popper-anchor-width] ml-auto" side="bottom" align="end">
                  <DropdownMenuItem>
                    <SidebarMenuButton asChild>
                      <a href="/">
                        <HomeIcon/>
                        <span>Go to Home</span>
                      </a>
                    </SidebarMenuButton>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
        <SidebarSeparator className="w-[50%]"/>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Admin Dashboard</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {paths.map((path) => (
                  <SidebarMenuItem key={path.title} className={cn("rounded-sm hover:!bg-slate-300  bg-slate-100", currentPath === path.url &&  "bg-slate-300")}>
                    <SidebarMenuButton asChild>
                      <NavLink to={path.url}>
                        <path.icon />
                        <span>{path.title}</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <SidebarMenu >
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton>
                    <User2 /> EdenAdmin
                    <ChevronUp className="ml-auto" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-[--radix-popper-anchor-width]"
                >
                  <DropdownMenuItem>
                    <Settings/>
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LogOut/>
                    <span>Sign out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
    </>
  )
}

export default Appsidebar