"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signIn, signOut, useSession } from "next-auth/react"
import { ShoppingCart, Menu, X, Search, User, LogOut, Package, Heart, Settings, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useCart } from "@/lib/cart-context"
import type { User as UserType } from "@/lib/types"

// Definir el tipo CartItem para evitar 'any' implícito
interface CartItem {
  id: string
  quantity: number
  product: any // Puedes definir un tipo más específico si es necesario
}

export default function SiteHeader() {
  const { data: session } = useSession()
  const cart = useCart()
  const pathname = usePathname()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  // Manejar el scroll para cambiar el estilo del header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      window.location.href = `/productos?q=${encodeURIComponent(searchTerm)}`
    }
  }

  // Asegurarse de que cart.items existe antes de usarlo
  const items = cart.items || []
  const totalItems = items.reduce((total: number, item: CartItem) => total + item.quantity, 0)

  const isAdmin = session?.user && (session.user as UserType).role === "admin"

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        isScrolled ? "bg-black shadow-md" : "bg-black/80 text-white"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={isScrolled ? "/images/logo/logo.svg" : "/images/logo/logo-white.svg"}
              alt="MotoRepuesto"
              width={40}
              height={40}
              priority
            />
            <span className="text-xl font-bold">MotoRepuesto</span>
          </Link>

          {/* Navegación de escritorio */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/" ? "text-primary" : ""
              }`}
            >
              Inicio
            </Link>
            <Link
              href="/productos"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/productos" || pathname.startsWith("/producto/") ? "text-primary" : ""
              }`}
            >
              Productos
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/categories" || pathname.startsWith("/categories/") ? "text-primary" : ""
              }`}
            >
              Categorías
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/contact" ? "text-primary" : ""
              }`}
            >
              Contacto
            </Link>
            {isAdmin && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1 p-0">
                    <span className="text-sm font-medium">Admin</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/admin">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/products">Productos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/orders">Pedidos</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/admin/marketing">Marketing</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Búsqueda de escritorio */}
          <form onSubmit={handleSearch} className="hidden md:flex relative">
            <Input
              type="search"
              placeholder="Buscar productos..."
              className={`w-[200px] lg:w-[300px] ${isScrolled ? "" : "bg-white/10 border-white/20 placeholder:text-white/70"}`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Button type="submit" variant="ghost" size="icon" className="absolute right-0">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </form>

          {/* Carrito */}
          <Link href="/cart">
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {totalItems}
                </span>
              )}
              <span className="sr-only">Carrito</span>
            </Button>
          </Link>

          {/* Usuario */}
          {session?.user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Perfil</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    {session.user.name && <p className="font-medium">{session.user.name}</p>}
                    {session.user.email && (
                      <p className="w-[200px] truncate text-sm text-muted-foreground">{session.user.email}</p>
                    )}
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/profile/orders" as any}>
                    <Package className="mr-2 h-4 w-4" />
                    <span>Mis pedidos</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={"/profile/wishlist" as any}>
                    <Heart className="mr-2 h-4 w-4" />
                    <span>Lista de deseos</span>
                  </Link>
                </DropdownMenuItem>
                {session.user && (session.user as UserType).role === "admin" && (
                  <DropdownMenuItem asChild>
                    <Link href="/admin">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Admin</span>
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="cursor-pointer"
                  onSelect={(event) => {
                    event.preventDefault()
                    signOut({ callbackUrl: "/" })
                  }}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="ghost" size="sm" onClick={() => signIn()}>
              Iniciar sesión
            </Button>
          )}

          {/* Menú móvil */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] sm:w-[400px]">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between mb-6">
                  <Link href="/" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-2">
                    <Image src="/images/logo/logo.svg" alt="MotoRepuesto" width={40} height={40} />
                    <span className="text-xl font-bold">MotoRepuesto</span>
                  </Link>
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileMenuOpen(false)}>
                    <X className="h-5 w-5" />
                    <span className="sr-only">Cerrar</span>
                  </Button>
                </div>

                <form onSubmit={handleSearch} className="relative mb-6">
                  <Input
                    type="search"
                    placeholder="Buscar productos..."
                    className="w-full"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Button type="submit" variant="ghost" size="icon" className="absolute right-0 top-0">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Buscar</span>
                  </Button>
                </form>

                <nav className="flex flex-col gap-4">
                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${pathname === "/" ? "text-primary" : ""}`}
                  >
                    Inicio
                  </Link>
                  <Link
                    href="/productos"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${
                      pathname === "/productos" || pathname.startsWith("/producto/") ? "text-primary" : ""
                    }`}
                  >
                    Productos
                  </Link>
                  <Link
                    href="/categories"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${
                      pathname === "/categories" || pathname.startsWith("/categories/") ? "text-primary" : ""
                    }`}
                  >
                    Categorías
                  </Link>
                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`text-lg font-medium ${pathname === "/contact" ? "text-primary" : ""}`}
                  >
                    Contacto
                  </Link>
                </nav>

                {isAdmin && (
                  <>
                    <div className="mt-6 mb-2 font-semibold">Admin</div>
                    <nav className="flex flex-col gap-4">
                      <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-medium">
                        Dashboard
                      </Link>
                      <Link
                        href="/admin/products"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium"
                      >
                        Productos
                      </Link>
                      <Link
                        href="/admin/orders"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium"
                      >
                        Pedidos
                      </Link>
                      <Link
                        href="/admin/marketing"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="text-lg font-medium"
                      >
                        Marketing
                      </Link>
                    </nav>
                  </>
                )}

                <div className="mt-auto pt-6">
                  {session?.user ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="flex-shrink-0">
                          <User className="h-10 w-10 rounded-full bg-muted p-2" />
                        </div>
                        <div>
                          <p className="font-medium">{session.user.name}</p>
                          <p className="text-sm text-muted-foreground">{session.user.email}</p>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2">
                        <Link
                          href="/profile"
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-sm"
                        >
                          <User className="h-4 w-4" />
                          <span>Perfil</span>
                        </Link>
                        <Link
                          href={"/profile/orders" as any}
                          onClick={() => setIsMobileMenuOpen(false)}
                          className="flex items-center gap-2 text-sm"
                        >
                          <Package className="h-4 w-4" />
                          <span>Mis pedidos</span>
                        </Link>
                        <Button
                          variant="ghost"
                          className="flex items-center justify-start gap-2 px-0 text-sm"
                          onClick={() => {
                            setIsMobileMenuOpen(false)
                            signOut({ callbackUrl: "/" })
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span>Cerrar sesión</span>
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <Button onClick={() => signIn()} className="w-full">
                      Iniciar sesión
                    </Button>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}

export { SiteHeader }
