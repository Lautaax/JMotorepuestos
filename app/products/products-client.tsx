// Encuentra la línea 29 y reemplaza el código que itera sobre URLSearchParams
// Por ejemplo, si el código original es algo como:
// const params = Object.fromEntries([...searchParams]);

// Reemplázalo con:
const params: Record<string, string> = {}
searchParams.forEach((value, key) => {
  params[key] = value
})

// O alternativamente:
// const params = Object.fromEntries(Array.from(searchParams.entries()));
