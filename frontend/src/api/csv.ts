import type { ColumnFiltersState, PaginationState } from "@tanstack/react-table"
import axios from "axios";

export const getCsvData = (pagination: PaginationState, columnFilters: ColumnFiltersState, search?: string) => {
    const url = new URL("api/csv", import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")
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

export const uploadCsv = (file: File) => {
    const url = new URL("api/csv/upload", import.meta.env.VITE_BACKEND_URL || "http://localhost:3000")
    const formData = new FormData()
    formData.append("file", file)
    // return fetch(url, {
    //     method: "POST",
    //     body: formData
    // }).then(res => res.json())

    return axios.post(url.toString(), formData, {
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / (progressEvent.total ?? 0));
        console.log(`${percentCompleted}%`);
        // updateProgressBar(((i + percentCompleted / 100) / totalChunks) * 100);
      }
    });

}