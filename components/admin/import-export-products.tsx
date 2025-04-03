"use client"

import type React from "react"

import { useState } from "react"
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import type { ImportResult } from "@/lib/types"

export default function ImportExportProducts() {
  const { toast } = useToast()
  const [importing, setImporting] = useState(false)
  const [exporting, setExporting] = useState(false)
  const [downloadingTemplate, setDownloadingTemplate] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [activeTab, setActiveTab] = useState("import")

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setProgress(10)
    setImportResult(null)

    const formData = new FormData()
    formData.append("file", file)

    try {
      setProgress(30)
      const response = await fetch("/api/excel/import", {
        method: "POST",
        body: formData,
      })

      setProgress(70)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al importar productos")
      }

      const result = await response.json()
      setImportResult(result)
      setProgress(100)

      toast({
        title: "Importación completada",
        description: `Se importaron ${result.imported} productos y se actualizaron ${result.updated} productos.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al importar los productos",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  const handleExport = async () => {
    setExporting(true)

    try {
      const response = await fetch("/api/excel/export", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al exportar productos")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `productos-${new Date().toISOString().split("T")[0]}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

      toast({
        title: "Exportación completada",
        description: "Los productos han sido exportados correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al exportar los productos",
        variant: "destructive",
      })
    } finally {
      setExporting(false)
    }
  }

  const handleDownloadTemplate = async () => {
    setDownloadingTemplate(true)

    try {
      const response = await fetch("/api/excel/template", {
        method: "GET",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al descargar la plantilla")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = "plantilla-productos.xlsx"
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      a.remove()

      toast({
        title: "Plantilla descargada",
        description: "La plantilla ha sido descargada correctamente.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al descargar la plantilla",
        variant: "destructive",
      })
    } finally {
      setDownloadingTemplate(false)
    }
  }

  const handleStockUpdate = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImporting(true)
    setProgress(10)
    setImportResult(null)

    const formData = new FormData()
    formData.append("file", file)
    formData.append("updateType", "stock")

    try {
      setProgress(30)
      const response = await fetch("/api/excel/import", {
        method: "POST",
        body: formData,
      })

      setProgress(70)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al actualizar el stock")
      }

      const result = await response.json()
      setImportResult(result)
      setProgress(100)

      toast({
        title: "Actualización de stock completada",
        description: `Se actualizó el stock de ${result.updated} productos.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al actualizar el stock",
        variant: "destructive",
      })
    } finally {
      setImporting(false)
      // Reset the file input
      e.target.value = ""
    }
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab}>
      <TabsList className="grid w-full grid-cols-3">
        <TabsTrigger value="import">Importar Productos</TabsTrigger>
        <TabsTrigger value="export">Exportar Productos</TabsTrigger>
        <TabsTrigger value="stock">Actualizar Stock</TabsTrigger>
      </TabsList>

      <TabsContent value="import" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Importar Productos</CardTitle>
            <CardDescription>
              Importa productos desde un archivo Excel. Descarga la plantilla para ver el formato requerido.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta un archivo Excel o haz clic para seleccionar
              </p>
              <input
                type="file"
                id="import-file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleImport}
                disabled={importing}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("import-file")?.click()}
                disabled={importing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo
              </Button>
            </div>

            {importing && (
              <div className="space-y-2">
                <p className="text-sm text-center">Importando productos...</p>
                <Progress value={progress} />
              </div>
            )}

            {importResult && (
              <Alert variant={importResult.errors > 0 ? "destructive" : "default"}>
                <div className="flex items-center">
                  {importResult.errors > 0 ? (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  <AlertTitle>Resultado de la importación</AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Productos importados: {importResult.imported}</li>
                    <li>Productos actualizados: {importResult.updated}</li>
                    <li>Errores: {importResult.errors}</li>
                    {importResult.errors > 0 && (
                      <li>
                        <details>
                          <summary className="cursor-pointer">Ver detalles de errores</summary>
                          <ul className="list-disc pl-5 mt-2">
                            {importResult.errorDetails.map((error, index) => (
                              <li key={index} className="text-sm">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleDownloadTemplate} disabled={downloadingTemplate}>
              <Download className="mr-2 h-4 w-4" />
              {downloadingTemplate ? "Descargando..." : "Descargar Plantilla"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>

      <TabsContent value="export" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Exportar Productos</CardTitle>
            <CardDescription>
              Exporta todos los productos a un archivo Excel para su revisión o modificación.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Exporta todos los productos de la base de datos a un archivo Excel
              </p>
              <Button onClick={handleExport} disabled={exporting}>
                <Download className="mr-2 h-4 w-4" />
                {exporting ? "Exportando..." : "Exportar Productos"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="stock" className="mt-4">
        <Card>
          <CardHeader>
            <CardTitle>Actualización Masiva de Stock</CardTitle>
            <CardDescription>
              Actualiza el stock de múltiples productos a la vez mediante un archivo Excel.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <FileSpreadsheet className="h-10 w-10 text-muted-foreground mb-2" />
              <p className="text-sm text-muted-foreground mb-4">
                Arrastra y suelta un archivo Excel o haz clic para seleccionar
              </p>
              <p className="text-xs text-muted-foreground mb-4">El archivo debe contener las columnas: SKU y Stock</p>
              <input
                type="file"
                id="stock-update-file"
                accept=".xlsx,.xls"
                className="hidden"
                onChange={handleStockUpdate}
                disabled={importing}
              />
              <Button
                variant="outline"
                onClick={() => document.getElementById("stock-update-file")?.click()}
                disabled={importing}
              >
                <Upload className="mr-2 h-4 w-4" />
                Seleccionar Archivo
              </Button>
            </div>

            {importing && (
              <div className="space-y-2">
                <p className="text-sm text-center">Actualizando stock...</p>
                <Progress value={progress} />
              </div>
            )}

            {importResult && (
              <Alert variant={importResult.errors > 0 ? "destructive" : "default"}>
                <div className="flex items-center">
                  {importResult.errors > 0 ? (
                    <AlertCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  <AlertTitle>Resultado de la actualización</AlertTitle>
                </div>
                <AlertDescription className="mt-2">
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Productos actualizados: {importResult.updated}</li>
                    <li>Errores: {importResult.errors}</li>
                    {importResult.errors > 0 && (
                      <li>
                        <details>
                          <summary className="cursor-pointer">Ver detalles de errores</summary>
                          <ul className="list-disc pl-5 mt-2">
                            {importResult.errorDetails.map((error, index) => (
                              <li key={index} className="text-sm">
                                {error}
                              </li>
                            ))}
                          </ul>
                        </details>
                      </li>
                    )}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" onClick={handleDownloadTemplate} disabled={downloadingTemplate}>
              <Download className="mr-2 h-4 w-4" />
              {downloadingTemplate ? "Descargando..." : "Descargar Plantilla"}
            </Button>
          </CardFooter>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

