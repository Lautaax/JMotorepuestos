"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Search, ShoppingCart, User, Menu, X, LogOut } from "lucide-react"
import { useSession, signOut } from "next-auth/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/providers/cart-provider"
import { cn } from "@/lib/utils"
import LoginModal from "@/components/auth/login-modal"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function SiteHeader() {
  const pathname = usePathname()
  const { cart } = useCart()
  const { data: session } = useSession()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/products?q=${encodeURIComponent(searchQuery)}`
    }
  }

  const handleLogout = async () => {
    await signOut({ redirect: false })
    window.location.href = "/"
  }

  const navItems = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/products" },
    { name: "Categorías", href: "/categories" },
    { name: "Contacto", href: "/contact" },
  ]

  if (session?.user && session.user.role === "admin" ) {
    navItems.push({ name: "Admin", href: "/admin" })
  }

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          isScrolled ? "bg-background/95 backdrop-blur-sm shadow-md" : "bg-background",
        )}
      >
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2 md:gap-10">
            <Link href="/" className="flex items-center gap-2 font-bold text-xl">
              <Image
                src="/images/logo/logo.svg"
                alt="MotoRepuestos Logo"
                width={150}
                height={40}
                className="h-8 w-auto"
              />
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary relative group",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {item.name}
                  <span
                    className={cn(
                      "absolute -bottom-1 left-0 h-0.5 bg-primary transition-all duration-300",
                      pathname === item.href ? "w-full" : "w-0 group-hover:w-full",
                    )}
                  ></span>
                </Link>
              ))}
            </nav>
          </div>

          <div className="hidden md:flex items-center gap-4 flex-1 px-6">
            <form onSubmit={handleSearch} className="relative w-full max-w-sm">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar repuestos..."
                className="pl-8 w-full bg-secondary border-secondary"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <div className="flex items-center gap-4">
            <Link href="/cart">
              <Button variant="outline" size="icon" className="relative hover:bg-secondary hover:text-primary">
                <ShoppingCart className="h-5 w-5" />
                {cart.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </Button>
            </Link>

            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="hover:bg-secondary hover:text-primary">
                    <span className="hidden md:inline mr-2">{session.user.name}</span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-primary text-primary-foreground">
                      {session.user.role === "admin" ? "Admin" : "Cliente"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Perfil</Link>
                  </DropdownMenuItem>
                  {session.user.role === "admin" && (
                    <DropdownMenuItem asChild>
                      <Link href="/admin">Panel de Admin</Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem asChild>
                  <Link href={"/profile/orders" as any}>Mis pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Cerrar sesión
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button
                variant="outline"
                className="hover:bg-secondary hover:text-primary"
                onClick={() => setIsLoginModalOpen(true)}
              >
                <User className="h-5 w-5 md:mr-2" />
                <span className="hidden md:inline">Iniciar sesión</span>
              </Button>
            )}

            <Button
              variant="ghost"
              size="icon"
              className="md:hidden hover:bg-secondary hover:text-primary"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile search */}
        <div className="md:hidden container px-4 pb-3">
          <form onSubmit={handleSearch} className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar repuestos..."
              className="pl-8 w-full bg-secondary border-secondary"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden container px-4 py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <Link
                  key={item.href}
                  href={item.href as any}
                  className={cn(
                    "text-sm font-medium transition-colors hover:text-primary py-2",
                    pathname === item.href ? "text-primary" : "text-muted-foreground",
                    `animate-slide-in-right`,
                  )}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}

              {session && (
                <Button variant="outline" className="justify-start mt-2" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Cerrar sesión
                </Button>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Login Modal */}
      {isLoginModalOpen && <LoginModal open={isLoginModalOpen} onOpenChange={(open) => setIsLoginModalOpen(open)} />}
    </>
  )
}

