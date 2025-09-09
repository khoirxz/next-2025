"use client";

import { EyeIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import Navbar from "@/components/Navbar";

import { useItems } from "@/hooks/useItems";
import { useTransactions } from "@/hooks/useTransactions";
import { useItemTypes } from "@/hooks/useItemTypes";
import { useRooms } from "@/hooks/useRooms";

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
      <div className="font-sans flex flex-col min-h-screen p-5  max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 min-h-10">
          {isLoading ? (
            <div className="bg-zinc-400 h-10 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-col bg-white p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow">
              <div className="flex items-center gap-3">
                <p className="text-zinc-600 text-sm">Item Types</p>
              </div>
              <span className="flex gap-3">
                <p className="text-3xl font-semibold">
                  {itemTypes?.pageInfo.total_data}
                </p>
              </span>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-col bg-white p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow">
              <div className="flex items-center gap-3">
                <p className="text-zinc-600 text-sm">Rooms</p>
              </div>
              <span className="flex gap-3">
                <p className="text-3xl font-semibold">
                  {rooms?.pageInfo.total_data}
                </p>
              </span>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-col bg-white p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow">
              <div className="flex items-center gap-3">
                <p className="text-zinc-600 text-sm">Items</p>
              </div>
              <span className="flex gap-3">
                <p className="text-3xl font-semibold">
                  {items?.pageInfo.total_data}
                </p>
              </span>
            </div>
          )}
          {isLoading ? (
            <div className="bg-zinc-400 h-10 p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow animate-pulse"></div>
          ) : (
            <div className="flex flex-col bg-white p-5 border border-zinc-200 rounded-xl w-full gap-3 shadow">
              <div className="flex items-center gap-3">
                <p className="text-zinc-600 text-sm">Transactions</p>
              </div>
              <span className="flex gap-3">
                <p className="text-3xl font-semibold">
                  {transactions?.pageInfo.total_data}
                </p>
              </span>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
