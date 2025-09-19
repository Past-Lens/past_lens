import Sidebar from "@/components/custom/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Outlet } from "react-router-dom"

function Dashboard() {

  return (
    <>
     <SidebarProvider>
        <Sidebar/>
         <main className="flex-1 relative">
          <SidebarTrigger />
          <Outlet/>
         </main>
     </SidebarProvider>
 
    </>
  )
}

export default Dashboard