import Sidebar from "@/components/custom/Sidebar"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import Overview from "./overview"
import UserManagement from "./usermanagement"
import Contributions from "./contributions"

function Dashboard() {

  return (
    <>
     <SidebarProvider>
        <Sidebar/>
         <main className="flex-1 relative">
          <SidebarTrigger />
          <Overview/>
          <UserManagement/>
          <Contributions/>
         </main>
     </SidebarProvider>
 
    </>
  )
}

export default Dashboard