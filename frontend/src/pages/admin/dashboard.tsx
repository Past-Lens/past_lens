import Sidebar from "@/components/custom/Sidebar"
import TopBar from "@/components/custom/topBar"
import { SidebarProvider} from "@/components/ui/sidebar"
import { SideBarToogleProvider, useBar } from "@/context/sidebarcontext"
import { Outlet } from "react-router-dom"

function Dashboard() {
  return (
    <SideBarToogleProvider>
      <SidebarWrapper />
    </SideBarToogleProvider>
  )
}

function SidebarWrapper() {
  const { isOpen } = useBar();

  return (
    <SidebarProvider defaultOpen={isOpen}>
      <Sidebar />
      <main className="flex-1 relative">
        <TopBar />
        <Outlet />
      </main>
    </SidebarProvider>
  );
}

export default Dashboard