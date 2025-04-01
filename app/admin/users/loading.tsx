import { Skeleton } from "@/components/ui/skeleton"

export default function UsersLoading() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-full max-w-md" />
      </div>

      <div className="border rounded-lg p-6 bg-card">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-40" />
          </div>

          <div className="rounded-md border">
            <div className="h-12 border-b px-4 flex items-center">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-1/5" />
              ))}
            </div>

            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-16 border-b px-4 flex items-center">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-1/5" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

