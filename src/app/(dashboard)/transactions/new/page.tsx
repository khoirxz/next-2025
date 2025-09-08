"use client";
import { useState, useMemo } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";

import { ChevronLeftIcon, Trash, Plus } from "lucide-react";
import { useCreateTrx } from "@/hooks/useCreateTrx";

const formSchema = z.object({
  wash_type: z.string(),
  infectious_type: z.string(),
  details: z.array(z.object({ item_id: z.string().min(1) })).min(1),
});

type FormData = z.infer<typeof formSchema>;

export default function Page() {
  const { mutateAsync, error: createError, isPending } = useCreateTrx();

  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wash_type: "NORMAL",
      infectious_type: "NON_INFECTIOUS",
      details: [{ item_id: "" }],
    },
    mode: "onBlur",
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "details",
  });

  const addRow = () => append({ item_id: "" });

  const onSubmit = async (data: FormData) => {
    const payload = {
      wash_type: data.wash_type,
      infectious_type: data.infectious_type,
      total_qty: data.details.length,
      details: data.details.map((d) => ({ item_id: d.item_id.trim() })),
    };

    try {
      await mutateAsync(payload);

      reset({
        wash_type: "NORMAL",
        infectious_type: "NON_INFECTIOUS",
        details: [{ item_id: "" }],
      });

      alert("Item berhasil dibuat");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <Navbar title="Create new Transaction" />
      <div className="font-sans flex flex-col p-5 max-w-6xl mx-auto mt-5 space-y-6">
        <div className="flex justify-end">
          <Button asChild>
            <Link href="/items">
              <ChevronLeftIcon className="size-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="bg-white border border-zinc-200 rounded-xl shadow">
          <form
            className="grid grid-cols-2 gap-4 p-5"
            onSubmit={handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Wash Type</Label>
              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Wash Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NORMAL">NORMAL</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Infectious Type</Label>

              <Select>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Infectious Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NON_INFECTIOUS">NON INFECTIOUS</SelectItem>
                  <SelectItem value="INFECTIOUS">INFECTIOUS</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="col-span-2">
              <div className="flex flex-col gap-2">
                <Label>Item ({fields.length})</Label>
                {fields.map((field, idx) => (
                  <div className="flex gap-2" key={field.id}>
                    <Input
                      type="text"
                      placeholder={`Item ID #${idx + 1}`}
                      {...register(`details.${idx}.item_id` as const)}
                    />
                    <Button
                      type="button"
                      variant={"destructive"}
                      size={"icon"}
                      onClick={() => remove(idx)}
                      disabled={fields.length === 1}>
                      <Trash className="size-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button
                className="mt-2 w-full"
                variant="outline"
                type="button"
                onClick={addRow}>
                <Plus className="size-4" />
                Add
              </Button>
            </div>
            <div className="col-span-3 flex justify-end">
              <Button type="submit">Submit</Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
