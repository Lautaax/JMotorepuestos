"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface OptimizedImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  fill?: boolean
  className?: string
  priority?: boolean
  sizes?: string
}

export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  className,
  priority = false,
  sizes,
}: OptimizedImageProps) {
  const [loading, setLoading] = useState(!priority)
  const [error, setError] = useState(false)

  // Determinar si la imagen es un placeholder
  const isPlaceholder = src.includes("/placeholder.svg")

  // Determinar la URL optimizada
  const imageUrl = isPlaceholder
    ? src
    : src.startsWith("http")
      ? src
      : `${process.env.NEXT_PUBLIC_APP_URL}/_next/image?url=${encodeURIComponent(src)}&w=${width || 1920}&q=75`

  // Si fill es true, no necesitamos width y height
  if (fill) {
    return (
      <div className="relative w-full h-full">
        {loading && !priority && <Skeleton className="absolute inset-0 z-10" />}

        <Image
          src={error ? `/placeholder.svg?height=500&width=500` : imageUrl}
          alt={alt}
          fill
          sizes={sizes || "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"}
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

  // Asegurarse de que width y height estén definidos cuando fill es false
  const imgWidth = width || 300
  const imgHeight = height || 300

  return (
    <div className="relative" style={{ width: imgWidth, height: imgHeight }}>
      {loading && !priority && <Skeleton className="absolute inset-0 z-10" />}

      <Image
        src={error ? `/placeholder.svg?height=${imgHeight}&width=${imgWidth}` : imageUrl}
        alt={alt}
        width={imgWidth}
        height={imgHeight}
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

