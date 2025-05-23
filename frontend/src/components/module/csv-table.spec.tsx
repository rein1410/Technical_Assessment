import { test, expect } from "vitest";
import { CsvTable } from "./csv-table";
import { render } from 'vitest-browser-react'
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

// vi.mock('@/api/csv', () => ({
//   getCsvData: () => ({
//     items: [
//       { id: 1, postId: 101, name:"test", email:"123@gmail.com", body: "Sample Post" },
//       { id: 2, postId: 102, name: "test2", email: "123@gmail.com", body: "Another Post" },
//     ],
//     totalItems: 2
//   }),
// }));

const queryClient = new QueryClient();

test ("has columns"), async () => {
  const { getByText } = render(
    <QueryClientProvider client={queryClient}>
      <CsvTable />
    </QueryClientProvider>
  );
  await expect.element(getByText("ID"));
  await expect.element(getByText("Name"));
  await expect.element(getByText("Email"));
  await expect.element(getByText("Body"));
}
test("can paginate", async () => {
  const { getByRole } = render(
    <QueryClientProvider client={queryClient}>
      <CsvTable />
    </QueryClientProvider>
  );
  await expect.element(getByRole('button', { name: 'Next'}));
  await expect.element(getByRole('button', { name: 'Previous'}));
  await expect.element(getByRole('button', { name: 'Previous'})).toBeDisabled();
  await getByRole('button', { name: 'Next'}).click()
  await expect.element(getByRole('button', { name: 'Previous'})).toBeEnabled();
  await getByRole('button', { name: 'Previous'}).click()
});

test("can search", async () => {
  const { getByText, getByPlaceholder } = render(
    <QueryClientProvider client={queryClient}>
      <CsvTable />
    </QueryClientProvider>
  );
  await expect.element(getByPlaceholder("Search..."));
  await expect.element(getByPlaceholder("Full text search..."));
  await getByPlaceholder("Search...", { exact: true }).fill("gardner");
  await expect.element(getByText("Eliseo@gardner.biz"));
  await getByPlaceholder("Search...", { exact: true }).clear();
  await getByPlaceholder("Full text search...").fill("dolor");
  await expect.element(getByText("dolores"));
  await getByPlaceholder("Full text search...").clear();
});
