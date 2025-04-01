"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { Upload, X, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void
  currentImage?: string
}

export default function ImageUpload({ onImageSelect, currentImage }: ImageUploadProps) {
  const { toast } = useToast()
  const [preview, setPreview] = useState<string | null>(currentImage || null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Validar tipo de archivo
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Formato no válido",
        description: "Por favor selecciona una imagen (JPG, PNG, GIF, etc.)",
        variant: "destructive",
      })
      return
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Archivo demasiado grande",
        description: "La imagen no debe superar los 5MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Crear URL para previsualización
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setPreview(result)
      onImageSelect(file, result)
      setIsUploading(false)
    }
    reader.readAsDataURL(file)
  }

  const clearImage = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col space-y-2">
        <Label htmlFor="image-upload">Imagen del producto</Label>
        <div className="flex items-center gap-4">
          <Input
            ref={fileInputRef}
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="max-w-xs"
          />
          <Button type="button" variant="outline" size="icon" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">Formatos aceptados: JPG, PNG, GIF. Tamaño máximo: 5MB</p>
      </div>

      {isUploading && (
        <div className="flex items-center justify-center p-4 border border-dashed rounded-md">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      )}

      {preview && !isUploading && (
        <div className="relative">
          <div className="relative aspect-square w-full max-w-xs overflow-hidden rounded-md border">
            <Image src={preview || "/placeholder.svg"} alt="Vista previa" fill className="object-cover" />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={clearImage}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

