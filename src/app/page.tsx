import { EyeIcon, TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import Navbar from "@/components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar title="Dashboard" />
      <div className="font-sans flex flex-col min-h-screen p-5  max-w-6xl mx-auto">
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col bg-white p-5 border border-zinc-200 rounded-2xl w-full gap-3">
              <div className="flex items-center gap-3">
                <span className="bg-zinc-400/20 rounded-md p-1.5">
                  <EyeIcon className="size-4" />
                </span>
                <p className="font-semibold">Page View</p>
              </div>
              <span className="flex gap-3">
                <p className="text-3xl">
                  {Math.floor(Math.random() * 1000000).toLocaleString()}
                </p>{" "}
                <div className="flex flex-col">
                  {i % 2 === 0 ? (
                    <span className="bg-red-400/20 text-red-700 ring-2 ring-red-700 py-0.5 px-2 rounded-md text-[10px] font-semibold flex items-center gap-1">
                      {Math.floor(Math.random() * 100)}%
                      <TrendingDownIcon className="size-3" />
                    </span>
                  ) : (
                    <span className="bg-green-400/20 text-green-700 ring-2 ring-green-700 py-0.5 px-2 rounded-md text-[10px] font-semibold flex items-center gap-1">
                      {Math.floor(Math.random() * 100)}%
                      <TrendingUpIcon className="size-3" />
                    </span>
                  )}
                </div>
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
