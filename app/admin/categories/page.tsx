"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash } from "lucide-react";

const initialCategories = ["Web Development", "Marketing", "Branding", "Mobile Apps"];

export default function CategoriesPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");

  const addCategory = () => {
    if (!newCategory.trim()) return;
    setCategories((prev) => [...prev, newCategory.trim()]);
    setNewCategory("");
  };

  const removeCategory = (cat: string) => {
    setCategories((prev) => prev.filter((c) => c !== cat));
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Category Management</h1>
      <p className="text-gray-500">Add, update or remove service categories.</p>

      <div className="bg-white p-6 rounded-2xl border shadow space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="New category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button className="flex items-center gap-2" onClick={addCategory}>
            <PlusCircle className="w-4 h-4" /> Add
          </Button>
        </div>

        <div className="flex flex-wrap gap-3">
          {categories.map((cat) => (
            <Badge
              key={cat}
              className="bg-white border px-3 py-2 flex items-center gap-2 rounded-xl shadow"
            >
              {cat}
              <Trash
                className="w-4 h-4 cursor-pointer text-red-600"
                onClick={() => removeCategory(cat)}
              />
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
