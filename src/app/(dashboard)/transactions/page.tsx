"use client";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

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
import { SearchIcon, PlusIcon } from "lucide-react";

import Navbar from "@/components/Navbar";
import AppTable from "@/components/app-table";

import { useTransactions } from "@/hooks/useTransactions";
import { InTxnRow } from "@/types/transaction";

export default function ItemType() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") || "";
  const page = Number(sp.get("page") || "1");
  const limit = 10;

  const { data, isLoading, isFetching, error } = useTransactions({
    q,
    page,
    limit,
  });

  const setParams = (key: string, value: string) => {
    const usp = new URLSearchParams(sp);
    if (value) usp.set(key, value);
    else usp.delete(key);
    router.replace(`/transactions?${usp.toString()}`);
  };

  if (error) return <div>{error.message}</div>;

  const items = data?.data ?? [];
  const { page: cur, total_page } = data?.pageInfo ?? {
    page: 1,
    total_page: 1,
  };

  return (
    <>
      <Navbar title="Transactions" />

      <div className="font-sans flex flex-col p-5 max-w-6xl mx-auto mt-5 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/transactions/new">
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
                className="outline-none text-sm"
              />
            </div>
          </div>

          <div className="max-h-[420px] overflow-y-auto">
            {isLoading && isFetching ? (
              <div className="p-5 text-center">Loading...</div>
            ) : (
              <AppTable<InTxnRow>
                data={items}
                columns={[
                  {
                    key: "code",
                    label: "Code",
                  },
                  {
                    key: "status",
                    label: "Status",
                  },
                  {
                    key: "transaction_date",
                    label: "Date",
                    render: (row) =>
                      new Date(row.transaction_date).toDateString(),
                  },
                  {
                    key: "wash_type",
                    label: "Wash Type",
                  },
                ]}
              />
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

            <div className="flex items-center gap-2">
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
