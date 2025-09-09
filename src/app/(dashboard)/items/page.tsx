"use client";
import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AppTable from "@/components/app-table";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";

import { SearchIcon, PlusIcon } from "lucide-react";

import { useItems } from "@/hooks/useItems";
import { ItemRow } from "@/types/items";

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
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/items">Items</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
              <AppTable<ItemRow>
                data={items}
                columns={[
                  {
                    key: "corporates",
                    label: "Name",
                    render: (row) => <span>{row.item_types.name}</span>,
                  },
                  {
                    key: "status",
                    label: "Status",
                  },
                  {
                    key: "last_status",
                    label: "Last Status",
                  },
                  {
                    key: "created_at",
                    label: "Created At",
                    render: (row) => (
                      <span>{new Date(row.created_at).toDateString()}</span>
                    ),
                  },
                  {
                    key: "item_id",
                    label: "Actions",
                    render: (row) => (
                      <div className="flex items-center gap-2">
                        <Button variant="link" asChild>
                          <Link href={`/items/${row.item_id}`}>
                            <span>View</span>
                          </Link>
                        </Button>
                        <Button variant="link" asChild>
                          <Link href={`/items/${row.item_id}/edit`}>
                            <span>Edit</span>
                          </Link>
                        </Button>
                      </div>
                    ),
                  },
                ]}
              />
            )}
          </div>

          <div className="flex items-center justify-between p-5 ">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-medium">{cur}</span> out of{" "}
              <span className="font-medium">{total_page}</span>
            </p>

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
