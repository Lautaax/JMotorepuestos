import {
  Building2,
  ListIcon as Category,
  LayoutDashboard,
  ListChecks,
  type LucideIcon,
  MessageSquare,
  Settings,
  ShoppingCart,
  User,
  Users,
} from "lucide-react"

// Cambiamos la ruta de importación para que sea relativa
import { Icons } from "../../components/icons"

interface SidebarNavItem {
  name: string
  href: string
  icon: LucideIcon
}

interface SidebarProps {
  isSuperAdmin?: boolean
}

export function AdminSidebar({ isSuperAdmin }: SidebarProps) {
  const commonNavItems: SidebarNavItem[] = [
    {
      name: "Dashboard",
      href: "/admin",
      icon: LayoutDashboard,
    },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: ShoppingCart,
    },
    {
      name: "Products",
      href: "/admin/products",
      icon: Category,
    },
    {
      name: "Customers",
      href: "/admin/customers",
      icon: Users,
    },
    {
      name: "Reviews",
      href: "/admin/reviews",
      icon: MessageSquare,
    },
  ]

  const superAdminNavItems: SidebarNavItem[] = [
    {
      name: "Companies",
      href: "/admin/companies",
      icon: Building2,
    },
    {
      name: "Users",
      href: "/admin/users",
      icon: User,
    },
    {
      name: "Categories",
      href: "/admin/categories",
      icon: ListChecks,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ]

  const navItems = isSuperAdmin ? [...commonNavItems, ...superAdminNavItems] : commonNavItems

  return (
    <div className="flex flex-col w-64 border-r border-gray-200 dark:border-gray-700">
      <div className="flex-shrink-0 px-4 py-6">
        <Icons.logo className="h-8 w-auto" />
      </div>
      <nav className="flex-1 px-2 space-y-1">
        {navItems.map((item) => (
          <a
            key={item.name}
            href={item.href}
            className="group flex items-center px-2 py-2 text-sm font-medium rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100"
          >
            <item.icon className="mr-3 h-4 w-4 flex-shrink-0 text-gray-400 group-hover:text-gray-500 dark:group-hover:text-gray-400" />
            {item.name}
          </a>
        ))}
      </nav>
    </div>
  )
}
