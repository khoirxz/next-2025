"use client";
import { useSearchParams, useRouter } from "next/navigation";

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
import AppTable from "@/components/app-table";

import { useRooms } from "@/hooks/useRooms";
import { Room } from "@/types/rooms";

export default function Rooms() {
  const sp = useSearchParams();
  const router = useRouter();
  const q = sp.get("q") || "";
  const page = Number(sp.get("page") || "1");
  const limit = 10;

  const { data, isLoading, isFetching, error } = useRooms({
    q,
    page,
    limit,
  });

  const setParams = (key: string, value: string) => {
    const usp = new URLSearchParams(sp);
    if (value) usp.set(key, value);
    else usp.delete(key);
    router.replace(`/rooms?${usp.toString()}`);
  };

  if (error) return <div>{error.message}</div>;

  const items = data?.data ?? [];
  const { page: cur, total_page } = data?.pageInfo ?? {
    page: 1,
    total_page: 1,
  };

  return (
    <>
      <Navbar title="Rooms" />
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
              <AppTable<Room>
                data={items}
                columns={[
                  {
                    key: "name",
                    label: "Name",
                  },
                  {
                    key: "code",
                    label: "Code",
                  },
                  {
                    key: "status",
                    label: "Status",
                  },
                ]}
              />
            )}
          </div>

          <div className="flex items-center justify-between mt-5 p-5 ">
            <p className="text-sm text-zinc-500">
              Showing <span className="font-medium">{cur}</span> out of{" "}
              <span className="font-medium">{total_page}</span>
            </p>

            <div className="flex items-center gap-2">
              <label htmlFor="rows">Rows per page</label>
              <Select
                onValueChange={(e) => setParams("limit", e)}
                defaultValue={String(limit)}>
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
