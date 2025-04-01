"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Menu, Search, ShoppingCart, User, LogOut, Settings, Package, Heart, UserCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useCart } from "@/components/providers/cart-provider"
import LoginModal from "@/components/auth/login-modal"
import MotoSelector from "@/components/moto-selector/moto-selector"

export default function SiteHeader() {
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const { cart } = useCart()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false)

  const cartItemsCount = cart.reduce((total, item) => total + item.quantity, 0)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const isAdminRoute = pathname?.startsWith("/admin")
  if (isAdminRoute) return null

  const handleSignOut = async () => {
    await signOut({ redirect: false })
    router.push("/")
  }

  return (
    <header
      className={`sticky top-0 z-40 w-full transition-all ${
        isScrolled ? "bg-background/95 backdrop-blur-sm shadow-sm" : "bg-background"
      }`}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/images/logo/logo.svg" alt="Moto Parts Logo" width={40} height={40} />
            <span className="hidden font-bold sm:inline-block">Moto Parts</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/products"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/products" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Productos
            </Link>
            <Link
              href="/categories"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/categories" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Categorías
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                pathname === "/contact" ? "text-primary" : "text-foreground/60"
              }`}
            >
              Contacto
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Selector de moto */}
          <div className="hidden md:block">
            <MotoSelector variant="outline" />
          </div>

          <Link href="/products" className="hidden md:flex">
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
              <span className="sr-only">Buscar</span>
            </Button>
          </Link>

          <Link href="/cart" className="relative">
            <Button variant="outline" size="icon">
              <ShoppingCart className="h-4 w-4" />
              <span className="sr-only">Carrito</span>
              {cartItemsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-primary text-[10px] font-medium text-primary-foreground flex items-center justify-center">
                  {cartItemsCount}
                </span>
              )}
            </Button>
          </Link>

          {session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="rounded-full">
                  {session.user?.image ? (
                    <Image
                      src={session.user.image || "/placeholder.svg"}
                      alt={session.user.name || "Usuario"}
                      width={24}
                      height={24}
                      className="rounded-full"
                    />
                  ) : (
                    <User className="h-4 w-4" />
                  )}
                  <span className="sr-only">Mi cuenta</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>
                  <div className="flex flex-col">
                    <span>Mi cuenta</span>
                    {session.user?.email && (
                      <span className="text-xs text-muted-foreground truncate">{session.user.email}</span>
                    )}
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => router.push("/account/profile")}>
                  <UserCircle className="mr-2 h-4 w-4" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/orders")}>
                  <Package className="mr-2 h-4 w-4" />
                  <span>Mis pedidos</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/garage")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Mi garaje</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => router.push("/account/wishlist")}>
                  <Heart className="mr-2 h-4 w-4" />
                  <span>Lista de deseos</span>
                </DropdownMenuItem>
                {session.user?.role === "admin" && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => router.push("/admin")}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Panel de administración</span>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="icon" onClick={() => setIsLoginModalOpen(true)}>
              <User className="h-4 w-4" />
              <span className="sr-only">Iniciar sesión</span>
            </Button>
          )}

          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
                <span className="sr-only">Menú</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <div className="flex flex-col gap-6 py-6">
                <Link href="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                  <Image src="/images/logo/logo.svg" alt="Moto Parts Logo" width={40} height={40} />
                  <span className="font-bold">Moto Parts</span>
                </Link>
                <div className="flex flex-col gap-4">
                  <MotoSelector />
                  <Link
                    href="/products"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Productos
                  </Link>
                  <Link
                    href="/categories"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Categorías
                  </Link>
                  <Link
                    href="/contact"
                    className="text-sm font-medium transition-colors hover:text-primary"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Contacto
                  </Link>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <LoginModal isOpen={isLoginModalOpen} onClose={() => setIsLoginModalOpen(false)} />
    </header>
  )
}

