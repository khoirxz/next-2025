"use client";
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

export default function Items() {
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
                type="text"
                placeholder="Search by name"
                className="outline-none text-sm w-full"
              />
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
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
                {Array.from({ length: 10 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="pl-5 font-medium">INV001</TableCell>
                    <TableCell>Paid</TableCell>
                    <TableCell>Credit Card</TableCell>
                    <TableCell className="text-right pr-5">$250.00</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
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
