import { useMemo, useState } from "react";
import type { RuntimeTableModel } from "../runtime-data";
import { normalizeText } from "../lib/normalize-text";

function compareValues(leftValue: unknown, rightValue: unknown): number {
  const left = normalizeText(leftValue);
  const right = normalizeText(rightValue);
  if (left === right) {
    return 0;
  }

  return left < right ? -1 : 1;
}

export function useInteractiveTable(options: {
  table: RuntimeTableModel;
  initialSearch?: string;
}) {
  const { table, initialSearch = "" } = options;
  const columns = Array.isArray(table.columns) ? table.columns : [];
  const sourceRows = Array.isArray(table.rows) ? table.rows : [];
  const pageSize = Number(table.pageSize) > 0 ? Number(table.pageSize) : 8;
  const firstSortable = columns.find((column) => column.sortable)?.key || columns[0]?.key || "";

  const [search, setSearch] = useState(initialSearch);
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState(table.defaultSort?.key || firstSortable);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    table.defaultSort?.direction === "desc" ? "desc" : "asc"
  );

  const filteredRows = useMemo(() => {
    const searchTerm = normalizeText(search);
    const rows = sourceRows.filter((row) => {
      if (!searchTerm) {
        return true;
      }

      const lookup = columns
        .filter((column) => column.key !== "actions")
        .map((column) => String((row as Record<string, unknown>)[column.key] ?? ""))
        .join(" ")
        .toLowerCase();

      return lookup.includes(searchTerm);
    });

    if (!sortKey) {
      return rows;
    }

    return [...rows].sort((leftRow, rightRow) => {
      const left = (leftRow as Record<string, unknown>)[sortKey];
      const right = (rightRow as Record<string, unknown>)[sortKey];
      const compare = compareValues(left, right);
      return sortDirection === "asc" ? compare : compare * -1;
    });
  }, [columns, search, sortDirection, sortKey, sourceRows]);

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);

  const pagedRows = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [currentPage, filteredRows, pageSize]);

  function handleSort(nextSortKey: string) {
    if (!nextSortKey) {
      return;
    }

    setPage(1);
    if (nextSortKey === sortKey) {
      setSortDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(nextSortKey);
    setSortDirection("asc");
  }

  return {
    columns,
    search,
    setSearch,
    currentPage,
    setPage,
    totalPages,
    pagedRows,
    handleSort
  };
}
