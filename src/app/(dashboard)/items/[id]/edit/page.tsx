"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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
import { Button } from "@/components/ui/button";
// components custom
import Navbar from "@/components/Navbar";
// icons, images
import { ChevronLeftIcon } from "lucide-react";

import {
  useItemDetail,
  useItemTypes,
  useRooms,
  useUpdateItem,
} from "@/hooks/useItems";
import { useEffect } from "react";
import { toast } from "sonner";

const formSchema = z.object({
  item_type_id: z.string().min(1),
  room_id: z.string().min(1),
});

type formValues = z.infer<typeof formSchema>;

export default function Page() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  const { data: detailResp, isLoading: isLoadingDetail } = useItemDetail(id!);
  const { data: itemTypeResp, isLoading: isLoadingItemTypes } = useItemTypes({
    page: 1,
    limit: 50,
  });
  const { data: roomResp, isLoading: isLoadingRooms } = useRooms({
    page: 1,
    limit: 50,
  });

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<formValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      item_type_id: "",
      room_id: "",
    },
  });

  // set niali form
  useEffect(() => {
    const d = detailResp?.data;
    if (d) {
      reset(
        {
          item_type_id: d.item_type_id,
          room_id: d.room_id,
        },
        { keepDirty: false }
      );
    }
  }, [detailResp, reset]);

  const { mutateAsync, isPending } = useUpdateItem(id!);

  const onSubmit = async (data: formValues) => {
    await mutateAsync({
      item_type_id: data.item_type_id,
      room_id: data.room_id,
      corporate_id: "",
    });

    toast.success("Item berhasil diupdate");

    // wait 2 seconds before redirecting to items page
    setTimeout(() => {
      router.replace("/items");
    }, 2000);
  };

  const itemTypes = itemTypeResp?.data ?? [];
  const rooms = roomResp?.data ?? [];

  return (
    <>
      <Navbar
        title={
          isLoadingDetail ? "Loading..." : `Edit ${detailResp?.data.item_id} `
        }
      />
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
                <Link href={`/items/${detailResp?.data.item_id}/edit`}>
                  Edit {detailResp?.data.item_id}
                </Link>
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
            {isLoadingDetail ? (
              <div className="flex flex-col gap-2">
                <div className="w-full h-10 bg-zinc-300 animate-pulse rounded-md"></div>
                <div className="w-full h-6 bg-zinc-300 animate-pulse rounded-md"></div>
              </div>
            ) : (
              <>
                <h1 className="text-2xl font-semibold">
                  Edit Item {detailResp?.data.item_id}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Please fill in the form.
                </p>
              </>
            )}
          </div>
          <div className="flex-1">
            <div className="bg-white border border-zinc-200 rounded-xl shadow">
              <form
                className="grid grid-cols-2 gap-4 p-5"
                onSubmit={handleSubmit(onSubmit)}>
                {isLoadingItemTypes ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-6 bg-zinc-300 animate-pulse rounded-md"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
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
                            {itemTypes.map((itemType) => (
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
                )}

                {isLoadingRooms ? (
                  <div className="flex flex-col gap-2">
                    <div className="w-full h-6 bg-zinc-300 animate-pulse rounded-md"></div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2">
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
                            {rooms.map((room) => (
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
                )}

                <div className="col-span-3 flex justify-end">
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
