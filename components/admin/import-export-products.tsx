"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Download, FileSpreadsheet, Upload, AlertCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { useToast } from "@/hooks/use-toast"
import type { ImportResult } from "@/lib/types"

export default function ImportExportProducts() {
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)
  const [importResult, setImportResult] = useState<ImportResult | null>(null)
  const [showErrors, setShowErrors] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0])
      setImportResult(null)
      setShowErrors(false)
    }
  }

  const handleImport = async () => {
    if (!file) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo Excel",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)
    setImportResult(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("/api/excel/import", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || "Error al importar productos")
      }

      const result = await response.json()
      setImportResult(result)

      toast({
        title: "Importación exitosa",
        description: `Se importaron ${result.imported} productos, se actualizaron ${result.updated}. ${result.errors} errores.`,
      })

      // Limpiar el input de archivo
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setFile(null)
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al importar los productos",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleExport = async () => {
    setIsDownloading(true)

    try {
      // Descargar el archivo directamente
      window.location.href = "/api/excel/export"

      toast({
        title: "Exportación iniciada",
        description: "La descarga del archivo Excel comenzará en breve",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Ocurrió un error al exportar los productos",
        variant: "destructive",
      })
    } finally {
      setTimeout(() => {
        setIsDownloading(false)
      }, 1000)
    }
  }

  const handleDownloadTemplate = () => {
    window.location.href = "/api/excel/template"
  }

  return (
    <div className="space-y-6">
      <Tabs defaultValue="import">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="import">Importar Productos</TabsTrigger>
          <TabsTrigger value="export">Exportar Productos</TabsTrigger>
        </TabsList>
        <TabsContent value="import" className="space-y-4 mt-4">
          <div className="space-y-2">
            <Label htmlFor="excel-file">Archivo Excel</Label>
            <div className="flex items-center gap-2">
              <Input id="excel-file" type="file" accept=".xlsx,.xls" onChange={handleFileChange} ref={fileInputRef} />
              <Button onClick={handleImport} disabled={!file || isUploading}>
                {isUploading ? (
                  <>
                    <Upload className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar
                  </>
                )}
              </Button>
            </div>
            {file && <p className="text-sm text-muted-foreground">Archivo seleccionado: {file.name}</p>}
          </div>

          {importResult && (
            <div className="space-y-4">
              <Alert>
                <FileSpreadsheet className="h-4 w-4" />
                <AlertTitle>Resultado de la importación</AlertTitle>
                <AlertDescription>
                  <p>Productos importados: {importResult.imported}</p>
                  <p>Productos actualizados: {importResult.updated}</p>
                  <p>Errores encontrados: {importResult.errors}</p>
                  {importResult.errors > 0 && (
                    <Button variant="link" className="p-0 h-auto" onClick={() => setShowErrors(!showErrors)}>
                      {showErrors ? "Ocultar detalles" : "Ver detalles de errores"}
                    </Button>
                  )}
                </AlertDescription>
              </Alert>

              {showErrors && importResult.errors > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Detalles de errores</AlertTitle>
                  <AlertDescription>
                    <ul className="list-disc list-inside text-sm">
                      {importResult.errorDetails.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}
            </div>
          )}

          <div className="rounded-md border p-4 bg-muted/50">
            <h3 className="font-medium flex items-center gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Formato del archivo Excel
            </h3>
            <p className="text-sm text-muted-foreground mt-2">El archivo debe contener las siguientes columnas:</p>
            <ul className="text-sm text-muted-foreground mt-1 list-disc list-inside">
              <li>SKU (opcional)</li>
              <li>Nombre (obligatorio)</li>
              <li>Descripción (opcional)</li>
              <li>Precio (obligatorio)</li>
              <li>Stock (obligatorio)</li>
              <li>Categoría (opcional)</li>
              <li>Marca (opcional)</li>
              <li>URL de imagen (opcional)</li>
            </ul>
            <p className="text-sm text-muted-foreground mt-2">
              Puedes descargar una plantilla de ejemplo haciendo clic{" "}
              <Button variant="link" className="p-0 h-auto" onClick={handleDownloadTemplate}>
                aquí
              </Button>
              .
            </p>
          </div>
        </TabsContent>
        <TabsContent value="export" className="space-y-4 mt-4">
          <div className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Exporta todos los productos a un archivo Excel para editarlos o hacer una copia de seguridad.
            </p>
            <Button onClick={handleExport} disabled={isDownloading}>
              {isDownloading ? (
                <>
                  <Download className="mr-2 h-4 w-4 animate-spin" />
                  Exportando...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-4 w-4" />
                  Exportar Productos
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

