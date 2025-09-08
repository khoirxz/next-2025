"use client";

import { useParams, useRouter } from "next/navigation";
import type { ItemDetail } from "@/types/items";
import { useMemo } from "react";

import { useItemDetail } from "@/hooks/useItems"; // hook yang sudah kita punya
import Navbar from "@/components/Navbar";

function fmtDate(s?: string | null) {
  if (!s) return "-";
  try {
    const d = new Date(s);
    return new Intl.DateTimeFormat("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(d);
  } catch {
    return s ?? "-";
  }
}

function StatusBadge({ status }: { status: ItemDetail["status"] }) {
  const style =
    {
      REGISTERED: "bg-blue-100 text-blue-800",
      WASH: "bg-cyan-100 text-cyan-800",
      CLEAN: "bg-emerald-100 text-emerald-800",
      STORED: "bg-slate-100 text-slate-800",
      SENT: "bg-violet-100 text-violet-800",
      USED: "bg-amber-100 text-amber-800",
      DIRT: "bg-orange-100 text-orange-800",
      DEFECT: "bg-red-100 text-red-800",
    }[status] || "bg-gray-100 text-gray-800";
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${style}`}>
      {status}
    </span>
  );
}

function Skeleton() {
  return (
    <div className="p-4 space-y-4 animate-pulse">
      <div className="h-7 w-2/3 bg-slate-200 rounded" />
      <div className="h-5 w-1/3 bg-slate-200 rounded" />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-20 bg-slate-200 rounded" />
        ))}
      </div>
    </div>
  );
}

export default function ItemsDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { data, isLoading, error, refetch, isFetching } = useItemDetail(id!);

  const it = data?.data ?? ({} as ItemDetail);
  const title = useMemo(() => it.item_types?.name ?? "Item", [it]);

  const copyId = async () => {
    try {
      await navigator.clipboard.writeText(it.item_id);
      // pakai toast kalau ada; untuk simpel:
      alert("Item ID disalin");
    } catch {}
  };

  if (isLoading) return <Skeleton />;
  if (error) {
    return (
      <div className="p-4">
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-red-700 text-sm">
          Gagal memuat detail item. {(error as Error).message}
        </div>
        <button
          onClick={() => refetch()}
          className="mt-3 border rounded px-3 py-1">
          Coba lagi
        </button>
      </div>
    );
  }

  return (
    <>
      <Navbar title="Detail Item" />
      <div className="font-sans flex flex-col p-5 max-w-6xl mx-auto mt-5 space-y-6">
        <div className="flex items-center justify-end gap-3">
          <button
            onClick={() => router.push(`/items/${it.item_id}/edit`)}
            className="border rounded px-3 py-1">
            Edit
          </button>
          <button
            onClick={() => router.push("/items")}
            className="border rounded px-3 py-1">
            Kembali
          </button>
        </div>
        <div>
          <h1 className="text-2xl font-semibold">{title}</h1>
          <div className="mt-1 flex items-center gap-2 text-sm text-slate-600">
            <span className="font-mono">#{it.item_id}</span>
            <button onClick={copyId} className="underline underline-offset-2">
              Copy ID
            </button>
            {isFetching && <span className="opacity-70">• menyegarkan…</span>}
          </div>
        </div>

        {/* Status utama */}
        <div className="flex items-center gap-2">
          <StatusBadge status={it.status} />
          <span className="text-sm text-slate-600">
            Last: {it.last_status ?? "-"}
          </span>
          <span className="text-sm text-slate-600">
            • Wash Count: {it.wash_count}
          </span>
        </div>

        {/* Grid info */}
        <section className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Item Type
            </div>
            <div className="font-medium">{it.item_types?.name ?? "-"}</div>
            <div className="text-sm text-slate-600">
              {it.item_types?.medical_type ?? "-"}
            </div>
          </div>

          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Room
            </div>
            <div className="font-medium">{it.rooms?.name ?? "-"}</div>
            <div className="text-sm text-slate-600">{it.room_id}</div>
          </div>

          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Corporate
            </div>
            <div className="font-medium">
              {it.corporates?.code
                ? `${it.corporates.code} — ${it.corporates.name}`
                : it.corporate_id}
            </div>
          </div>

          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Procurement Date
            </div>
            <div className="font-medium">{fmtDate(it.procurement_date)}</div>
          </div>

          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Created
            </div>
            <div className="font-medium">{fmtDate(it.created_at)}</div>
            <div className="text-sm text-slate-600">by {it.created_by}</div>
          </div>

          <div className="border rounded p-3 bg-white">
            <div className="text-xs uppercase tracking-wide text-slate-500">
              Updated
            </div>
            <div className="font-medium">{fmtDate(it.updated_at)}</div>
            <div className="text-sm text-slate-600">by {it.updated_by}</div>
          </div>

          {it.description ? (
            <div className="sm:col-span-2 lg:col-span-3 border rounded p-3 bg-white">
              <div className="text-xs uppercase tracking-wide text-slate-500">
                Description
              </div>
              <div className="mt-1">{it.description}</div>
            </div>
          ) : null}
        </section>
      </div>
    </>
  );
}
