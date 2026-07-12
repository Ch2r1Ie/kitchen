"use client";

import { useMemo, useState } from "react";
import { Trash2, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { CATEGORIES, INITIAL_MENU, categoryName, type Category, type MenuItem } from "../data";

export default function MenuPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>(INITIAL_MENU);
  const [categories, setCategories] = useState<Category[]>(CATEGORIES);

  const [showAddItem, setShowAddItem] = useState(false);
  const [newItemName, setNewItemName] = useState("");
  const [newItemCategory, setNewItemCategory] = useState("noodles");
  const [newItemPrice, setNewItemPrice] = useState("");

  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    menuItems.forEach((m) => {
      counts[m.category] = (counts[m.category] ?? 0) + 1;
    });
    return counts;
  }, [menuItems]);

  function addMenuItem() {
    const name = newItemName.trim();
    if (!name) return;
    const price = parseInt(newItemPrice, 10) || 0;
    const item: MenuItem = {
      id: `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`,
      name,
      category: newItemCategory,
      price,
      available: true,
    };
    setMenuItems((prev) => [item, ...prev]);
    setShowAddItem(false);
    setNewItemName("");
    setNewItemPrice("");
  }

  function setItemPrice(id: string, price: number) {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, price } : m)));
  }

  function toggleItemAvailable(id: string) {
    setMenuItems((prev) => prev.map((m) => (m.id === id ? { ...m, available: !m.available } : m)));
  }

  function deleteItem(id: string) {
    setMenuItems((prev) => prev.filter((m) => m.id !== id));
  }

  function addCategory() {
    const name = newCategoryName.trim();
    if (!name) return;
    const id = `${name.toLowerCase().replace(/\s+/g, "_")}_${Date.now()}`;
    setCategories((prev) => [...prev, { id, name }]);
    setNewCategoryName("");
    setShowAddCategory(false);
  }

  function removeCategory(id: string) {
    if (categoryCounts[id]) return;
    setCategories((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <div className="px-8 pt-7 pb-15">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <div className="mb-0.5 text-[22px] font-extrabold">จัดการเมนู</div>
          <div className="text-sm text-muted-foreground">
            {menuItems.length} รายการ · เปิด/ปิดสถานะ แก้ไขราคา หรือเพิ่มเมนูใหม่
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAddCategory((v) => !v)}>
            จัดการหมวดหมู่
          </Button>
          <Button onClick={() => setShowAddItem((v) => !v)}>+ เพิ่มเมนู</Button>
        </div>
      </div>

      {showAddCategory && (
        <Card className="mb-5 px-5 py-4.5">
          <div className="mb-3 text-[13px] font-bold">หมวดหมู่ทั้งหมด</div>
          <div className="mb-4 flex flex-wrap gap-2">
            {categories.map((c) => {
              const count = categoryCounts[c.id] ?? 0;
              const canRemove = !count;
              return (
                <Badge key={c.id} variant="secondary" className="h-auto gap-1.5 rounded-full py-1.5 pr-1.5 pl-3.5 text-[13px] font-semibold">
                  {c.name}
                  <span className="font-medium text-muted-foreground">({count})</span>
                  {canRemove && (
                    <button
                      onClick={() => removeCategory(c.id)}
                      className="flex size-4.5 items-center justify-center rounded-full bg-border text-[11px] text-foreground/70"
                    >
                      <X className="size-2.5" />
                    </button>
                  )}
                </Badge>
              );
            })}
          </div>
          <div className="flex gap-2.5">
            <Input
              type="text"
              placeholder="ชื่อหมวดหมู่ใหม่"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              className="h-auto max-w-60 py-2.25"
            />
            <Button onClick={addCategory}>+ เพิ่มหมวดหมู่</Button>
          </div>
        </Card>
      )}

      {showAddItem && (
        <Card className="mb-5 flex-row flex-wrap items-end gap-3 px-5 py-4.5">
          <div className="min-w-40 flex-1">
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">ชื่อเมนู</div>
            <Input
              type="text"
              placeholder="เช่น แกงเขียวหวาน"
              value={newItemName}
              onChange={(e) => setNewItemName(e.target.value)}
              className="h-auto py-2.25"
            />
          </div>
          <div className="w-32.5">
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">หมวดหมู่</div>
            <Select
              value={newItemCategory}
              onValueChange={(value) => value && setNewItemCategory(value)}
            >
              <SelectTrigger className="h-auto w-full py-2.25">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="w-27.5">
            <div className="mb-1.5 text-xs font-semibold text-muted-foreground">ราคา (฿)</div>
            <Input
              type="number"
              placeholder="0"
              value={newItemPrice}
              onChange={(e) => setNewItemPrice(e.target.value)}
              className="h-auto py-2.25"
            />
          </div>
          <Button onClick={addMenuItem}>บันทึก</Button>
        </Card>
      )}

      <Card className="gap-0 overflow-hidden py-0">
        <Table>
          <TableHeader className="sr-only">
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Available</TableHead>
              <TableHead>Delete</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.map((m) => (
              <TableRow key={m.id} className="hover:bg-transparent">
                <TableCell className="w-16 py-3.5 pl-5">
                  <div className="size-13 rounded-lg bg-[repeating-linear-gradient(45deg,var(--muted),var(--muted)_8px,var(--border)_8px,var(--border)_16px)]" />
                </TableCell>
                <TableCell>
                  <div className="text-sm font-semibold">{m.name}</div>
                  <div className="text-xs text-muted-foreground capitalize">{categoryName(categories, m.category)}</div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <span className="text-[13px] text-muted-foreground">฿</span>
                    <Input
                      type="number"
                      value={m.price}
                      onChange={(e) => setItemPrice(m.id, parseInt(e.target.value, 10) || 0)}
                      className="h-auto w-16 py-1.5 text-[13px]"
                    />
                  </div>
                </TableCell>
                <TableCell className="w-30">
                  <div className="flex items-center gap-2">
                    <Switch checked={m.available} onCheckedChange={() => toggleItemAvailable(m.id)} />
                    <span className={cn("text-xs font-semibold", m.available ? "text-green-700" : "text-muted-foreground")}>
                      {m.available ? "พร้อมขาย" : "หมด"}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="w-12 pr-5">
                  <Button variant="ghost" size="icon-sm" onClick={() => deleteItem(m.id)}>
                    <Trash2 className="size-4 text-muted-foreground" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
