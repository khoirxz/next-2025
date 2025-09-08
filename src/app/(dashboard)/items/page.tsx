"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { SearchIcon, PlusIcon } from "lucide-react";

import { useItems } from "@/hooks/useItems";

export default function Items() {
  const router = useRouter();
  const sp = useSearchParams();
  const q = sp.get("q") || "";
  const page = Number(sp.get("page") || "1");
  const [limit, setLimit] = useState<number>(10);
  const room_id = sp.get("room_id") || "";
  const item_type_id = sp.get("item_type_id") || "";

  const { data, isLoading, isFetching, error } = useItems({
    q,
    page,
    limit,
    room_id,
    item_type_id,
  });

  const setParams = (key: string, value: string) => {
    const usp = new URLSearchParams(sp);
    if (value) usp.set(key, value);
    else usp.delete(key);
    router.replace(`/items?${usp.toString()}`);
  };

  if (error) return <div>{error.message}</div>;

  const items = data?.data ?? [];
  const { page: cur, total_page } = data?.pageInfo ?? {
    page: 1,
    total_page: 1,
  };

  return (
    <>
      <Navbar title="List Items" />
      <div className="font-sans flex flex-col p-5 max-w-6xl mx-auto mt-5 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/items/new">
              <PlusIcon className="size-4" />
              Create
            </Link>
          </Button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl shadow">
          <div className="p-5">
            <div className="flex gap-2 items-center">
              <SearchIcon className="size-4" />
              <input
                onChange={(e) => setParams("q", e.target.value)}
                defaultValue={q}
                type="text"
                placeholder="Search by name"
                className="outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading && isFetching ? (
              <div className="p-5 text-center">Loading...</div>
            ) : (
              <Table className="border-y border-zinc-200">
                <TableHeader>
                  <TableRow>
                    <TableHead className="pl-5 bg-zinc-600/10 border border-l-0 border-zinc-300">
                      Invoice
                    </TableHead>
                    <TableHead className="bg-zinc-600/10 border border-zinc-300">
                      Status
                    </TableHead>
                    <TableHead className="bg-zinc-600/10 border border-zinc-300">
                      Method
                    </TableHead>
                    <TableHead className="pr-5 text-right bg-zinc-600/10 border border-r-0 border-zinc-300">
                      Amount
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item) => (
                    <TableRow key={item.item_id}>
                      <TableCell className="pl-5 font-medium">
                        {item.corporates.name} - {item.corporates.code}
                      </TableCell>
                      <TableCell>Paid</TableCell>
                      <TableCell>Credit Card</TableCell>
                      <TableCell className="text-right pr-5">$250.00</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between p-5 ">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-semibold">1-10</span> of{" "}
              <span className="font-semibold">100</span> results
            </p>

            <div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious href="#" />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink href="#">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext href="#" />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <label htmlFor="rows">Rows per page</label>
              <Select onValueChange={(v) => setLimit(parseInt(v))}>
                <SelectTrigger className="w-[80px]" id="rows">
                  <SelectValue placeholder="10" defaultValue={limit} />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Total rows</SelectLabel>
                    {[10, 20, 30].map((r) => (
                      <SelectItem key={r} value={r.toString()}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
