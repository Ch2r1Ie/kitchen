"use client";

import { useState } from "react";
import { Printer, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { INITIAL_TABLES, type TableRec } from "../data";

export default function QrPage() {
  const [tables, setTables] = useState<TableRec[]>(INITIAL_TABLES);

  function addTable() {
    setTables((prev) => {
      const nextId = prev.length ? Math.max(...prev.map((t) => t.id)) + 1 : 1;
      return [...prev, { id: nextId, status: "empty", total: 0, elapsed: "" }];
    });
  }

  function removeTable(id: number) {
    setTables((prev) => prev.filter((t) => t.id !== id));
  }

  const qrCodes = [
    ...tables.map((t) => ({
      label: `โต๊ะ ${t.id}`,
      url: `baanbaankitchen.co.th/table/${t.id}`,
      removable: true,
      onRemove: () => removeTable(t.id),
    })),
    { label: "สั่งกลับบ้าน", url: "baanbaankitchen.co.th/takeaway", removable: false, onRemove: () => {} },
  ];

  return (
    <div className="px-8 pt-7 pb-15">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="mb-0.5 text-[22px] font-extrabold">QR โต๊ะ</div>
          <div className="text-sm text-muted-foreground">{tables.length} โต๊ะ · พิมพ์และวางไว้ที่โต๊ะ หรือใช้สำหรับสั่งกลับบ้าน</div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={addTable}>
            + เพิ่มโต๊ะ
          </Button>
          <Button onClick={() => window.print()}>
            <Printer className="size-4" />
            พิมพ์ทั้งหมด
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-4">
        {qrCodes.map((q) => (
          <Card key={q.label} className="relative gap-0 p-4.5 text-center">
            {q.removable && (
              <Button
                variant="outline"
                size="icon-sm"
                className="absolute top-2.5 right-2.5 text-muted-foreground"
                onClick={q.onRemove}
              >
                <X className="size-3.5" />
              </Button>
            )}
            <div className="text-sm font-bold">{q.label}</div>
            <div className="mx-auto mt-3.5 size-37.5 rounded-lg border-6 border-background bg-[repeating-conic-gradient(var(--primary)_0%_25%,var(--background)_0%_50%)] bg-size-[20px_20px] shadow-[0_0_0_1px_var(--border)]" />
            <div className="mt-3 text-[11px] break-all text-muted-foreground">{q.url}</div>
            <Button variant="outline" size="sm" className="mt-3 w-full" onClick={() => window.print()}>
              ดาวน์โหลด
            </Button>
          </Card>
        ))}
      </div>
    </div>
  );
}
