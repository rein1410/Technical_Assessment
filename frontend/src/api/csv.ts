import type { ColumnFiltersState, PaginationState } from "@tanstack/react-table"

export const getCsvData = (pagination: PaginationState, columnFilters: ColumnFiltersState, search?: string) => {
    const url = new URL("api/csv", import.meta.env.BACKEND_URL || "http://localhost:3000")
    const params = new URLSearchParams()
    params.append("skip", (pagination.pageIndex * pagination.pageSize).toString());
    params.append("take", (pagination.pageSize).toString());
    if (search) {
        params.append("search", search);
    }
    const email = columnFilters.find(c => c.id === 'email');
    if (email) {
        params.append("email", email.value as string);
    }
    url.search = params.toString()
    return fetch(url).then(res => res.json())
}