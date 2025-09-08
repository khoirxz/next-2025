"use client";
import { useSearchParams, useRouter } from "next/navigation";

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
import { SearchIcon } from "lucide-react";

import Navbar from "@/components/Navbar";

import { useItemTypes } from "@/hooks/useItemTypes";

export default function ItemType() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") || "";
  const page = Number(sp.get("page") || "1");
  const limit = 10;

  const { data, isLoading, isFetching, error } = useItemTypes({
    q,
    page,
    limit,
  });

  const setParams = (key: string, value: string) => {
    const usp = new URLSearchParams(sp);
    if (value) usp.set(key, value);
    else usp.delete(key);
    router.replace(`/item-type?${usp.toString()}`);
  };

  if (error) return <div>{error.message}</div>;

  const items = data?.data ?? [];
  const { page: cur, total_page } = data?.pageInfo ?? {
    page: 1,
    total_page: 1,
  };

  return (
    <>
      <Navbar title="Item Types" />
      <div className="font-sans flex flex-col p-5 max-w-6xl mx-auto mt-5">
        <div className="bg-white border border-zinc-200 rounded-xl shadow">
          <div className="p-5">
            <div className="flex gap-2 items-center">
              <SearchIcon className="size-4" />
              <input
                defaultValue={q}
                onChange={(e) => setParams("q", e.target.value)}
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
                      Name
                    </TableHead>
                    <TableHead className="bg-zinc-600/10 border border-zinc-300">
                      Spect
                    </TableHead>
                    <TableHead className="bg-zinc-600/10 border border-zinc-300">
                      Date
                    </TableHead>
                    <TableHead className="pr-5 text-right bg-zinc-600/10 border border-r-0 border-zinc-300">
                      Corporates
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell className="pl-5 font-medium">
                        {item.name}
                      </TableCell>
                      <TableCell>{item.specs}</TableCell>
                      <TableCell>{item.created_at}</TableCell>
                      <TableCell className="text-right pr-5">
                        {item.corporates?.name} - {item.corporates?.code}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          <div className="flex items-center justify-between mt-5 p-5 ">
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
              <Select>
                <SelectTrigger className="w-[80px]" id="rows">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Total rows</SelectLabel>
                    <SelectItem value="10">10</SelectItem>
                    <SelectItem value="20">20</SelectItem>
                    <SelectItem value="30">30</SelectItem>
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
