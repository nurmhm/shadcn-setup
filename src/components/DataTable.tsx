"use client";

import {
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import jsPDF from "jspdf";
import "jspdf-autotable";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  FileSpreadsheet,
  FileText,
  Search,
} from "lucide-react";
import * as React from "react";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import autoTable from "jspdf-autotable";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  title?: string;
  fileName?: string;
  searchKey?: keyof TData;
  searchPlaceholder?: string;
  enableColumnVisibility?: boolean;
  enableExport?: boolean;
  enablePagination?: boolean;
  pageSize?: number;
  isLoading?: boolean;
  emptyMessage?: string;
  className?: string;
  itemAddLink?: string;
  itemAddTitele?: string;
  onRowClick?: (row: TData) => void;
  Component?: React.FC;
  LeftComponent?: React.FC;
}

// --- DataTable Component ---
export function DataTable<TData, TValue>({
  columns,
  data,
  title,
  fileName = "RedioLens",
  searchKey,
  searchPlaceholder = "Search...",
  enableColumnVisibility = true,
  enableExport = true,
  enablePagination = true,
  pageSize = 20,
  isLoading = false,
  emptyMessage = "No results found.",
  className = "p-0 gap-2",
  onRowClick,
  Component,
  LeftComponent,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [globalFilter, setGlobalFilter] = React.useState("");

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onGlobalFilterChange: setGlobalFilter,
    globalFilterFn: "includesString",
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      globalFilter,
    },
    initialState: {
      pagination: {
        pageSize,
      },
    },
  });

  const exportToCSV = () => {
    const headers = table.getVisibleFlatColumns().map((column) => column.id);
    const rows = table.getFilteredRowModel().rows.map((row) =>
      headers.map((header) => {
        const cell = row.getValue(header);
        return typeof cell === "string" || typeof cell === "number" ? cell : "";
      })
    );

    const csvContent = [headers, ...rows]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `${fileName || "data"}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToXLSX = () => {
    const headers = table.getVisibleFlatColumns().map((column) => column.id);
    const rows = table.getFilteredRowModel().rows.map((row) =>
      headers.map((header) => {
        const cell = row.getValue(header);
        return typeof cell === "string" || typeof cell === "number" ? cell : "";
      })
    );

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Data");
    XLSX.writeFile(workbook, `${fileName || "data"}.xlsx`);
  };


const exportToPDF = () => {
  const doc = new jsPDF();

  if (title) {
    doc.setFontSize(16);
    doc.text(title, 14, 15);
  }

  const headers = table.getVisibleFlatColumns().map((column) => column.id);
  const rows = table.getFilteredRowModel().rows.map((row) =>
    headers.map((header) => {
      const cell = row.getValue(header);
      return typeof cell === "string" || typeof cell === "number"
        ? String(cell)
        : "";
    })
  );

  // ✅ নতুনভাবে autoTable কল
  autoTable(doc, {
    head: [headers],
    body: rows,
    startY: title ? 25 : 15,
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [71, 85, 105],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { top: 15 },
  });

  doc.save(`${fileName || "data"}.pdf`);
};

  if (isLoading) {
    return (
      <Card className={className}>
        <CardContent className="p-4">
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-8 bg-muted animate-pulse rounded" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader className="pb-0">
        <div className="flex justify-end">
          {/* Header content can go here if needed */}
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Mobile Toolbar */}
        <div className="flex flex-col gap-4 p-4 border-b lg:flex-row lg:justify-between lg:items-center">
          {/* Title - Center on mobile, left on desktop */}
          {title && (
            <div className="order-1 text-center lg:order-2 lg:text-left">
              <CardTitle className="text-xl font-semibold lg:text-2xl">
                {title}
              </CardTitle>
            </div>
          )}

          {/* Search - Top on mobile */}

          <div className="order-2 lg:order-1 flex items-center gap-4">
            {LeftComponent && <LeftComponent />}
            {searchKey && (
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder={searchPlaceholder}
                  value={globalFilter ?? ""}
                  onChange={(event) =>
                    setGlobalFilter(String(event.target.value))
                  }
                  className="pl-8 w-full lg:max-w-sm"
                />
              </div>
            )}
          </div>

          {/* Controls - Bottom on mobile */}
          <div className="flex flex-wrap gap-2 order-3 lg:order-3">
            {enableExport && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1 lg:flex-none"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    <span className="">Export</span>
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={exportToCSV}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as CSV
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToXLSX}>
                    <FileSpreadsheet className="mr-2 h-4 w-4" />
                    Export as XLSX
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={exportToPDF}>
                    <FileText className="mr-2 h-4 w-4" />
                    Export as PDF
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            {enableColumnVisibility && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Eye className="mr-2 h-4 w-4" />
                    Columns
                    <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {table
                    .getAllColumns()
                    .filter((column) => column.getCanHide())
                    .map((column) => {
                      return (
                        <DropdownMenuCheckboxItem
                          key={column.id}
                          className="capitalize"
                          checked={column.getIsVisible()}
                          onCheckedChange={(value) =>
                            column.toggleVisibility(!!value)
                          }
                        >
                          {column.id}
                        </DropdownMenuCheckboxItem>
                      );
                    })}
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <div>{Component && <Component />}</div>
          </div>
        </div>

        {/* Table Content */}
        <div className="min-h-[500px] overflow-x-auto">
          <Table className="border-collapse border border-border">
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="border border-border">
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    onClick={() => onRowClick && onRowClick(row.original)}
                    className={`border border-border ${
                      index % 2 === 0 ? "bg-background" : "bg-muted/20"
                    } ${
                      (row.original as any)?.is_tat_definition
                        ? "bg-red-100"
                        : ""
                    } ${onRowClick ? "cursor-pointer" : ""}`}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="border border-border">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center border border-border"
                  >
                    {emptyMessage}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {enablePagination && (
          <div className="flex flex-col gap-4 px-4 py-3 border-t lg:flex-row lg:justify-between lg:items-center">
            {/* Results info - Full width on mobile */}
            <div className="text-center lg:text-left">
              <p className="text-sm text-muted-foreground">
                Showing{" "}
                {table.getState().pagination.pageIndex *
                  table.getState().pagination.pageSize +
                  1}{" "}
                to{" "}
                {Math.min(
                  (table.getState().pagination.pageIndex + 1) *
                    table.getState().pagination.pageSize,
                  table.getFilteredRowModel().rows.length
                )}{" "}
                of {table.getFilteredRowModel().rows.length} entries
              </p>
            </div>

            {/* Pagination controls */}
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
              {/* Page size selector */}
              <div className="flex items-center justify-center gap-2 lg:justify-start">
                <p className="text-sm font-medium whitespace-nowrap">
                  Rows per page
                </p>
                <Select
                  value={`${table.getState().pagination.pageSize}`}
                  onValueChange={(value) => {
                    table.setPageSize(Number(value));
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue
                      placeholder={table.getState().pagination.pageSize}
                    />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[10, 20, 25, 30, 40, 50].map((pageSize) => (
                      <SelectItem key={pageSize} value={`${pageSize}`}>
                        {pageSize}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.previousPage()}
                  disabled={!table.getCanPreviousPage()}
                  className="flex-1 lg:flex-none"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => table.nextPage()}
                  disabled={!table.getCanNextPage()}
                  className="flex-1 lg:flex-none"
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function to create sortable column header
export function createSortableHeader(title: string) {
  return ({ column }: { column: any }) => {
    return (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="h-auto p-0 font-medium text-xs hover:bg-transparent"
      >
        {title}
        <ArrowUpDown className="ml-2 h-3 w-3" />
      </Button>
    );
  };
}
