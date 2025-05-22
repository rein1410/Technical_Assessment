import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { CsvTable } from "./components/module/csv-table"

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="px-10 container mx-auto py-10">
        <CsvTable/>
      </div>
    </QueryClientProvider>
  )
}

export default App
