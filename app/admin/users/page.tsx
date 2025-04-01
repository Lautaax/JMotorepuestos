import type { Metadata } from "next"
import UsersTable from "@/components/admin/users-table"

export const metadata: Metadata = {
  title: "Administración de Usuarios | MotoRepuestos",
  description: "Panel de administración de usuarios de MotoRepuestos",
}

export default async function UsersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Administración de Usuarios</h1>
        <p className="text-muted-foreground">
          Gestiona los usuarios de la plataforma, crea nuevas cuentas y administra los permisos.
        </p>
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <UsersTable />
      </div>
    </div>
  )
}

