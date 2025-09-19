import { Home, Edit, User2, Settings, AppWindow } from "lucide-react"

const paths = [
  {
    title: "Overview",
    url: "/admin",
    icon: Home,
  },
  {
    title: "Contributions",
    url: "/admin/contributions",
    icon: Edit,
  },
  {
    title: "User Management",
    url: "/admin/users",
    icon: User2,
  },
  {
    title: "Application",
    url: "/admin/application",
    icon: AppWindow,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]
export default paths