import { Home, Edit, User2, Settings } from "lucide-react"

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
    title: "Settings",
    url: "/admin/settings",
    icon: Settings,
  },
]
export default paths