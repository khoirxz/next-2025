import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
};

type Props<T extends object> = {
  data: T[];
  columns?: Column<T>[];
};

export default function AppTable<T extends object>({
  data,
  columns,
}: Props<T>) {
  return (
    <Table className="border-y border-zinc-200">
      <TableHeader>
        <TableRow>
          {columns?.map((col) => (
            <TableHead
              className="px-5 bg-zinc-600/10 border border-r-0 border-zinc-300"
              key={String(col.key)}>
              {String(col.label)}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, i) => (
          <TableRow key={i}>
            {columns?.map((col, idx) => (
              <TableCell className="px-5" key={String(idx)}>
                {col.render ? col.render(item) : String(item[col.key])}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
