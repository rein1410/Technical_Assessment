import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CsvTable } from "./components/module/csv-table"
import { UploadButton } from "./components/module/upload-button"
import { Toaster } from "./components/ui/sonner"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="px-10 container mx-auto py-10">
        <UploadButton/>
        <CsvTable/>
        <Toaster />
      </div>
    </QueryClientProvider>
  )
}

export default App
