"use client";
// react
import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { toast } from "sonner";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
// components library
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// components custom
import Navbar from "@/components/Navbar";
// icons, images
import { ChevronLeftIcon, Trash, ChevronDownIcon, Plus } from "lucide-react";
import { useItemTypes, useRooms } from "@/hooks/useItems";
import { useCreateItemBatch } from "@/hooks/useCreateItemsBatch";

const formSchema = z
  .object({
    item_type_id: z.string().min(1),
    room_id: z.string().min(1),
    procurement_date: z.date(),
    details: z
      .array(
        z.object({
          item_id: z.string().min(1),
        })
      )
      .min(1),
  })
  .refine(
    (v) => {
      const ids = v.details.map((d) => d.item_id.trim());
      return new Set(ids).size === ids.length;
    },
    {
      path: ["details"],
      message: "Duplikat item_id terdeteksi",
    }
  );

type FormValues = z.infer<typeof formSchema>;

export default function Page() {
  const { mutateAsync, error: createError, isPending } = useCreateItemBatch();

  // ===== DATE PICKER =====
  const [open, setOpen] = useState<boolean>(false);

  // ===== DATA DROPDOWN =====
  const { data: itemTypeResp } = useItemTypes({ page: 1, limit: 50 });
  const { data: roomResp } = useRooms({ page: 1, limit: 50 });

  // ===== RHF SETUP ====
  const {
    register,
    watch,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_type_id: "",
      room_id: "",
      procurement_date: new Date(),
      details: [{ item_id: "" }],
    },
    mode: "onBlur",
  });

  const { fields, append, remove, replace } = useFieldArray({
    control,
    name: "details",
  });

  const addRow = () => append({ item_id: "" });

  // === SUBMIT HANDLER ===
  const onSubmit = async (data: FormValues) => {
    // debug date
    // return console.log(data.procurement_date.toISOString());
    const payload = {
      item_type_id: data.item_type_id,
      room_id: data.room_id,
      procurement_date: data.procurement_date.toISOString(),
      total_qty: data.details.length,
      details: data.details.map((d) => ({ item_id: d.item_id.trim() })),
    };

    try {
      await mutateAsync(payload);

      reset({
        item_type_id: "",
        room_id: "",
        procurement_date: new Date(),
        details: [{ item_id: "" }],
      });

      toast.success("Item berhasil dibuat");

      // wait 2 seconds before redirecting to items page
      setTimeout(() => {
        window.location.href = "/items";
      }, 2000);
    } catch (error) {
      toast.error("Item gagal dibuat");
      console.log(error);
    }
  };

  return (
    <>
      <Navbar title="Create new item" />
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
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/items/new">New Items</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex justify-end">
          <Button asChild>
            <Link href="/items">
              <ChevronLeftIcon className="size-4" />
              Back
            </Link>
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:max-w-sm w-full">
            <h1 className="text-2xl font-semibold">Add New Item</h1>
            <p className="text-sm text-muted-foreground">
              Please fill in the form.
            </p>
          </div>

          <div className="flex-1">
            <div className="bg-white border border-zinc-200 rounded-xl shadow">
              <form
                className="grid grid-cols-1 md:grid-cols-3 gap-4 p-5"
                onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-2 col-span-1">
                  <Label htmlFor="name">Item Type</Label>
                  <Controller
                    control={control}
                    name="item_type_id"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Select item type"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {itemTypeResp?.data.map((itemType) => (
                            <SelectItem
                              key={itemType.item_type_id}
                              value={itemType.item_type_id}
                              className="capitalize">
                              {itemType.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-1">
                  <Label htmlFor="name">Room</Label>
                  <Controller
                    control={control}
                    name="room_id"
                    render={({ field }) => (
                      <Select onValueChange={field.onChange}>
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder="Select room"
                            defaultValue={field.value}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {roomResp?.data.map((room) => (
                            <SelectItem
                              key={room.room_id}
                              value={room.room_id}
                              className="capitalize">
                              {room.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                <div className="flex flex-col gap-2 col-span-1">
                  <Label htmlFor="date" className="px-1">
                    Procurement date
                  </Label>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date"
                        className="w-full justify-between font-normal">
                        {watch("procurement_date")?.toLocaleDateString("id-ID")}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start">
                      <Controller
                        control={control}
                        name="procurement_date"
                        render={({ field }) => (
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={(date) => {
                              setOpen(false);
                              field.onChange(date);
                            }}
                          />
                        )}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="md:col-span-3">
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
                <div className="md:col-span-3 flex justify-end">
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
