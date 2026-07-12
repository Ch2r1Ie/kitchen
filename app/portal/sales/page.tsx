"use client";

import { useState } from "react";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

import { INITIAL_TABLES, WEEK_SALES, type Order, type TableRec } from "../data";
import ordersData from "../orders/orders.json";

export default function SalesPage() {
  const [orders] = useState<Order[]>(ordersData as Order[]);
  const [tables] = useState<TableRec[]>(INITIAL_TABLES);

  const todaysSales = orders.reduce((sum, o) => sum + o.total, 0);
  const ordersToday = orders.length;
  const activeTableCount = tables.filter((t) => t.status !== "empty").length;
  const avgOrderValue = ordersToday ? Math.round(todaysSales / ordersToday) : 0;

  const statCards = [
    { label: "ยอดขายวันนี้", value: `฿${todaysSales.toLocaleString()}` },
    { label: "ออเดอร์วันนี้", value: String(ordersToday) },
    { label: "โต๊ะที่ใช้งาน", value: `${activeTableCount} / ${tables.length}` },
    { label: "ค่าเฉลี่ยต่อออเดอร์", value: `฿${avgOrderValue}` },
  ];

  const maxSales = Math.max(...WEEK_SALES.map((d) => d.sales));

  return (
    <div className="px-8 pt-7 pb-15">
      <div className="mb-0.5 text-[22px] font-extrabold">สรุปยอดขาย</div>
      <div className="mb-6 text-sm text-muted-foreground">สรุปผลการดำเนินงานวันนี้</div>

      <div className="mb-7 grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4">
        {statCards.map((stat) => (
          <Card key={stat.label} className="gap-2 px-5 py-4.5">
            <div className="text-[13px] font-semibold text-muted-foreground">{stat.label}</div>
            <div className="text-[26px] font-extrabold">{stat.value}</div>
          </Card>
        ))}
      </div>

      <Card className="px-6 py-5">
        <div className="mb-4.5 text-sm font-bold">ยอดขายสัปดาห์นี้</div>
        <div className="flex h-35 items-end gap-3.5">
          {WEEK_SALES.map((bar, idx) => {
            const isToday = idx === WEEK_SALES.length - 1;
            return (
              <div key={bar.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <div
                  className={cn("w-full max-w-9 rounded-t-md", isToday ? "bg-primary" : "bg-border")}
                  style={{ height: `${Math.round((bar.sales / maxSales) * 100)}%` }}
                />
                <div className={cn("text-[11px]", isToday ? "font-bold text-foreground" : "text-muted-foreground")}>{bar.day}</div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
