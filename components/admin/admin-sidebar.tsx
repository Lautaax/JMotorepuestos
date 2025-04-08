"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  BarChart,
  Tag,
  Settings,
  ChevronDown,
  ChevronRight,
  Menu,
  X,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface SidebarItemProps {
  icon: React.ReactNode
  label: string
  href: string
  active?: boolean
  subItems?: { label: string; href: string }[]
}

const SidebarItem = ({ icon, label, href, active, subItems }: SidebarItemProps) => {
  const [expanded, setExpanded] = useState(false)

  if (subItems && subItems.length > 0) {
    return (
      <div className="space-y-1">
        <Button
          variant="ghost"
          className={cn(
            "w-full justify-between",
            active ? "bg-secondary text-primary" : "hover:bg-secondary hover:text-primary",
          )}
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex items-center">
            <div className="mr-2">{icon}</div>
            <span>{label}</span>
          </div>
          {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </Button>

        {expanded && (
          <div className="pl-8 space-y-1">
            {subItems.map((item, index) => (
              <Link key={index} href={item.href as any}>
                <Button variant="ghost" className="w-full justify-start text-sm">
                  {item.label}
                </Button>
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <Link href={href as any}>
      <Button
        variant="ghost"
        className={cn(
          "w-full justify-start",
          active ? "bg-secondary text-primary" : "hover:bg-secondary hover:text-primary",
        )}
      >
        <div className="mr-2">{icon}</div>
        <span>{label}</span>
      </Button>
    </Link>
  )
}

export default function AdminSidebar() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  const sidebarItems = [
    {
      icon: <LayoutDashboard className="h-5 w-5" />,
      label: "Dashboard",
      href: "/admin",
    },
    {
      icon: <ShoppingBag className="h-5 w-5" />,
      label: "Productos",
      href: "/admin/products",
      subItems: [
        { label: "Todos los productos", href: "/admin/products" },
        { label: "Añadir producto", href: "/admin/products/new" },
        { label: "Categorías", href: "/admin/products/categories" },
        { label: "Guía de Compatibilidad", href: "/admin/products/compatibility-guide" },
      ],
    },
    {
      icon: <Package className="h-5 w-5" />,
      label: "Pedidos",
      href: "/admin/orders",
    },
    {
      icon: <Users className="h-5 w-5" />,
      label: "Usuarios",
      href: "/admin/users",
    },
    {
      icon: <Tag className="h-5 w-5" />,
      label: "Marketing",
      href: "/admin/marketing",
      subItems: [
        { label: "Cupones", href: "/admin/marketing/coupons" },
        { label: "Email Marketing", href: "/admin/marketing/email" },
      ],
    },
    {
      icon: <BarChart className="h-5 w-5" />,
      label: "Analíticas",
      href: "/admin/analytics",
    },
    {
      icon: <Settings className="h-5 w-5" />,
      label: "Configuración",
      href: "/admin/settings",
    },
  ]

  const sidebar = (
    <div className="space-y-4 py-4">
      <div className="px-3 py-2">
        <h2 className="mb-2 px-4 text-lg font-semibold">Panel de Administración</h2>
        <div className="space-y-1">
          {sidebarItems.map((item, index) => (
            <SidebarItem
              key={index}
              icon={item.icon}
              label={item.label}
              href={item.href}
              active={pathname === item.href || pathname.startsWith(`${item.href}/`)}
              subItems={item.subItems}
            />
          ))}
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button variant="outline" size="icon" onClick={() => setMobileOpen(!mobileOpen)} className="bg-background">
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm lg:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
      >
        <div
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 bg-background border-r border-border transition-transform duration-300 ease-in-out",
            mobileOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </div>
      </div>

      {/* Desktop sidebar */}
      <div className="hidden lg:block w-72 border-r border-border">{sidebar}</div>
    </>
  )
}
