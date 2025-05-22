import { getCsvData } from "@/api/csv";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query";
import { DataTable } from "../ui/data-table";
import type { ColumnDef, ColumnFiltersState, PaginationState } from "@tanstack/react-table";
import { useState } from "react";

type Csv = {
  id: string
  createdAt: Date
  updatedAt: Date
  postId: string
  email: string
  name: string
  body: string
}

export const columns: ColumnDef<Csv>[] = [
  {
    accessorKey: "id",
    header: "ID",
    enableColumnFilter: false,
  },
  {
    accessorKey: "postId",
    header: "Post ID",
    enableColumnFilter: false,
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "name",
    header: "Name",
    enableColumnFilter: false,
  },
  {
    accessorKey: "body",
    header: "Body",
    enableColumnFilter: false,
  },
]

export const CsvTable = () => {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 30,
  })
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(
    []
  )
  const [globalFilter, setGlobalFilter] = useState<string>();
  const { data, isPending, error }= useQuery({ queryKey: ['csv', pagination, columnFilters, globalFilter], queryFn: () => getCsvData(pagination, columnFilters, globalFilter), placeholderData: keepPreviousData })
  if (isPending) return 'Loading...'
  if (error) return 'An error has occurred: ' + error.message
  return <DataTable columns={columns} data={data} 
  pagination={pagination} setPagination={setPagination}
  columnFilters={columnFilters} setColumnFilters={setColumnFilters}
  useGlobalFilter={
    {
      placeholder: "Full text search...",
      globalFilter,
      setGlobalFilter
    }
  }
  />
};
