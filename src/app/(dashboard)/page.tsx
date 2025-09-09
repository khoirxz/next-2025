"use client";

import { Boxes, Warehouse, Box, Receipt } from "lucide-react";
import Navbar from "@/components/Navbar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/components/ui/breadcrumb";

import { useItems } from "@/hooks/useItems";
import { useTransactions } from "@/hooks/useTransactions";
import { useItemTypes } from "@/hooks/useItemTypes";
import { useRooms } from "@/hooks/useRooms";
import Link from "next/link";

export default function Home() {
  const { data: items, isLoading: isLoadingItems } = useItems({
    q: "",
    page: 1,
    limit: 20,
  });
  const { data: transactions, isLoading: isLoadingTransactions } =
    useTransactions({ q: "", page: 1, limit: 20 });
  const { data: itemTypes, isLoading: isLoadingItemTypes } = useItemTypes({
    q: "",
    page: 1,
    limit: 20,
  });
  const { data: rooms, isLoading: isLoadingRooms } = useRooms({
    q: "",
    page: 1,
    limit: 20,
  });

  const isLoading =
    isLoadingItems ||
    isLoadingTransactions ||
    isLoadingItemTypes ||
    isLoadingRooms;

  return (
    <>
      <Navbar title="Dashboard" />
      <div className="font-sans flex flex-col min-h-screen p-5 gap-5 max-w-6xl mx-auto">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-10">
          {isLoading ? (
            <div className="bg-zinc-400 h-10 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-row items-center p-5 border rounded-xl w-full gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-amber-400/40 rounded-full">
                  <Boxes className="text-amber-700" />
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-zinc-600">Total Item types</p>
                <p className="text-2xl font-semibold">
                  {itemTypes?.pageInfo.total_data}
                </p>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-row items-center p-5 border rounded-xl w-full gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-indigo-400/40 rounded-full">
                  <Warehouse className="text-indigo-700" />
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-zinc-600">Total Rooms</p>
                <p className="text-2xl font-semibold">
                  {rooms?.pageInfo.total_data}
                </p>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-row items-center p-5 border rounded-xl w-full gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-red-400/40 rounded-full">
                  <Box className="text-red-700" />
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-zinc-600">Total Item</p>
                <p className="text-2xl font-semibold">
                  {items?.pageInfo.total_data}
                </p>
              </div>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-row items-center p-5 border rounded-xl w-full gap-3 shadow-xs">
              <div className="flex items-center gap-3">
                <span className="p-3 bg-green-400/40 rounded-full">
                  <Receipt className="text-green-700" />
                </span>
              </div>
              <div className="flex flex-col">
                <p className="text-xs text-zinc-600">Total Transactions</p>
                <p className="text-2xl font-semibold">
                  {transactions?.pageInfo.total_data}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
