"use client";

import { ReactNode, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { BanknoteArrowUp, Eye, Pencil, Trash2 } from "lucide-react";

export interface Column<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  onEdit?: (item: T) => void;
  onView?: (item: T) => void;
  onDelete?: (item: T) => void;
  renderActions?: (item: T) => React.ReactNode;
  page?: number;
  pageSize?: number;
  total?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
}

export function DataTable<T>({
  columns,
  data,
  isLoading = false,
  onEdit,
  onView,
  onDelete,
  renderActions,
  page = 1,
  pageSize = 10,
  total = 0,
  onPageChange,
  onPageSizeChange,
}: DataTableProps<T>) {
  const totalPages = total ? Math.ceil(total / pageSize) : 1;
  const isServerPaginated = !!onPageChange;
  const [localPage, setLocalPage] = useState(1);
  const [localPageSize, setLocalPageSize] = useState(pageSize);

  const currentPage = isServerPaginated ? page : localPage;
  const currentPageSize = isServerPaginated ? pageSize : localPageSize;

  const start = (currentPage - 1) * currentPageSize;
  const paginatedData = isServerPaginated
    ? data
    : data.slice(start, start + currentPageSize);

  const handlePageChange = (newPage: number) => {
    if (isServerPaginated) onPageChange?.(newPage);
    else setLocalPage(newPage);
  };

  const handlePageSizeChange = (size: number) => {
    if (isServerPaginated) onPageSizeChange?.(size);
    else setLocalPageSize(size);
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((col) => (
              <TableHead key={col.key as string}>{col.label}</TableHead>
            ))}
            {(onEdit || onView || onDelete || renderActions) && (
              <TableHead>Actions</TableHead>
            )}
          </TableRow>
        </TableHeader>

        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-6"
              >
                Loading...
              </TableCell>
            </TableRow>
          ) : paginatedData.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={columns.length + 1}
                className="text-center py-6"
              >
                No results found
              </TableCell>
            </TableRow>
          ) : (
            paginatedData.map((item, i) => (
              <TableRow key={i}>
                {columns.map((col) => (
                  <TableCell key={col.key as string} className={col.className}>
                    {col.render ? col.render(item) : (item as any)[col.key]}
                  </TableCell>
                ))}
                {(onEdit || onView || onDelete || renderActions) && (
                  <TableCell className="flex gap-2">
                    {onView && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onView(item)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onEdit(item)}
                      >
                        <Pencil className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500"
                        onClick={() => onDelete(item)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}

                    {renderActions && renderActions(item)}
                  </TableCell>
                )}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 py-3 border-t bg-muted/40 gap-3">
        <div className="text-sm text-muted-foreground space-y-1">
          <div>
            Total items: <strong>{total}</strong> | Total pages:{" "}
            <strong>{totalPages}</strong>
          </div>
          <div>
            Showing page <strong>{currentPage}</strong> of{" "}
            <strong>{totalPages}</strong>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Limit selector */}
          <Select
            value={String(currentPageSize)}
            onValueChange={(v) => handlePageSizeChange(Number(v))}
          >
            <SelectTrigger className="w-[80px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Page numbers */}
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <Button
                key={num}
                variant={num === currentPage ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageChange(num)}
              >
                {num}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
