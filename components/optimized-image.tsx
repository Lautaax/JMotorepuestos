"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  priority?: boolean
}

export default function OptimizedImage({ src, alt, width, height, className, priority = false }: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority)
  const [error, setError] = useState(false)

  // Determinar si la imagen es un placeholder
  const isPlaceholder = src.includes("/placeholder.svg")

  // Determinar la URL optimizada
  const imageUrl = isPlaceholder
    ? src
    : src.startsWith("http")
      ? src
      : `${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`

  return (
    <div className="relative" style={{ width, height }}>
      {loading && !priority && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        src={error ? `/placeholder.svg?height=${height}&width=${width}` : imageUrl}
        alt={alt}
        width={width}
        height={height}
        className={className}
        priority={priority}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError(true)
          setLoading(false)
        }}
      />
    </div>
  )
}

