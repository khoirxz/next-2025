"use client";
import { useState, Fragment } from "react";
import { useFieldArray, Control, useWatch } from "react-hook-form";
import { z } from "zod";

import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

import {
  ItemCreateSchema,
  TransactionCreateSchema,
  DynamicFieldTypeSchema,
} from "@/lib/validators";

import { Trash, Plus } from "lucide-react";

export type ItemCreateSchema = z.infer<typeof ItemCreateSchema>;
export type TransactionCreateSchema = z.infer<typeof TransactionCreateSchema>;

const fieldTypes = DynamicFieldTypeSchema.options; // ['text', 'number', 'select', 'date', 'multivalue']

type Props<T extends { attributes: any[] }> = {
  control: Control<T>;
  name?: "attributes";
  errors?: any;
  presets?: string[];
};

export function DynamicAttributesBuilder<T extends { attributes: any[] }>({
  control,
  name = "attributes",
  errors,
  presets = [],
}: Props<T>) {
  const { fields, append, remove, update } = useFieldArray({
    control,
    name: name as any,
  });
  const values = useWatch({ control, name: name as any }) as any[];

  return (
    <div className="col-span-3">
      <div className="flex flex-col gap-2">
        <Label>Nama Item</Label>
        <div className="flex gap-2">
          {fields.map((f, idx) => {
            const val = values?.[idx] ?? {};
            const type = val?.type ?? "text";

            return (
              <Fragment key={idx}>
                <Input
                  type="text"
                  placeholder="Nama Item"
                  {...({
                    name: `${name}.${idx}.key`,
                  } as any)}
                  defaultValue={f.id}
                  onChange={(e) =>
                    update(idx, { ...fields[idx], key: e.target.value })
                  }
                  list={`attr-key-suggestions-${name}`}
                />
                <Button
                  type="button"
                  variant={"destructive"}
                  size={"icon"}
                  onClick={() => remove(idx)}
                  disabled={fields.length === 1}>
                  <Trash className="size-4" />
                </Button>
                <Button
                  type="button"
                  variant={"secondary"}
                  size={"icon"}
                  onClick={() =>
                    append({ key: "", type: "text", value: "" } as any)
                  }>
                  <Plus className="size-4" />
                </Button>
              </Fragment>
            );
          })}
        </div>
      </div>
    </div>
  );
}
