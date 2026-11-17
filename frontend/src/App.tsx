// App: the top-level component. For now it's a placeholder page that checks
// whether the Django backend is reachable. The real store pages come next.
import { useQuery } from '@tanstack/react-query'

// Ask the backend's health endpoint whether it is running.
async function fetchHealth(): Promise<{ status: string }> {
  const res = await fetch('/api/health/')
  // Treat any non-success HTTP status as an error so the UI can show it.
  if (!res.ok) throw new Error(`Backend returned ${res.status}`)
  return res.json()
}

function App() {
  // Load the health status; React Query tracks loading and error states for us.
  const { data, isLoading, isError } = useQuery({
    queryKey: ['health'],
    queryFn: fetchHealth,
  })

  // Pick the status message to show, based on the request's state.
  let backendStatus = 'Checking backend…'
  if (isError) backendStatus = 'Backend not reachable'
  else if (data) backendStatus = `Backend: ${data.status}`
  else if (!isLoading) backendStatus = 'No response'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 bg-neutral-50 text-neutral-900">
      <h1 className="text-4xl font-semibold tracking-tight">Nsoro</h1>
      <p className="text-sm text-neutral-500">{backendStatus}</p>
    </main>
  )
}

export default App
