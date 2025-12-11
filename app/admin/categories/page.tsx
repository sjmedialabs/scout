"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash } from "lucide-react";

interface ServiceItem {
  title: string;
  slug: string;
}

interface SubCategory {
  title: string;
  slug: string;
  items: ServiceItem[];
}

interface MainCategory {
  _id?: string;
  title: string;
  slug: string;
  isMainCategory: boolean;
  children: SubCategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/service-categories");
      const data = await res.json();
      if (data.success) setCategories(data.data);
    } catch (error) {
      console.error("Fetch failed:", error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create slug utility
  const slugify = (text: string) =>
    text.toLowerCase().trim().replace(/\s+/g, "-");

  // Add Main Category
  const addMainCategory = async () => {
    if (!newCategory.trim()) return;

    const newCat: MainCategory = {
      title: newCategory.trim(),
      slug: slugify(newCategory),
      isMainCategory: true,
      children: [],
    };

    const res = await fetch("/api/service-categories", {
      method: "POST",
      body: JSON.stringify(newCat),
    });

    const result = await res.json();
    if (result.success) {
      setCategories((prev) => [...prev, result.data]);
      setNewCategory("");
    }
  };

  // Add Subcategory
  const addSubcategory = async (catId: string, title: string) => {
    const updatedCats = categories.map((cat) =>
      cat._id === catId
        ? {
            ...cat,
            children: [
              ...cat.children,
              { title, slug: slugify(title), items: [] },
            ],
          }
        : cat
    );

    setCategories(updatedCats);
    await updateCategory(catId, updatedCats.find((c) => c._id === catId)!);
  };

  // Add service item to subcategory
  const addServiceItem = async (catId: string, subIndex: number, title: string) => {
    const updatedCats = [...categories];
    updatedCats.forEach((cat) => {
      if (cat._id === catId) {
        cat.children[subIndex].items.push({
          title,
          slug: slugify(title),
        });
      }
    });

    setCategories(updatedCats);
    const updated = updatedCats.find((c) => c._id === catId)!;
    await updateCategory(catId, updated);
  };

  // Remove anything (main category, subcategory or service item)
  const removeCategory = async (catId: string) => {
    const updated = categories.filter((c) => c._id !== catId);
    setCategories(updated);
    await fetch(`/api/service-categories/${catId}`, { method: "DELETE" });
  };

  const updateCategory = async (catId: string, data: MainCategory) => {
    await fetch(`/api/service-categories/${catId}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  };

  return (
    <div className="space-y-10">
      <h1 className="text-3xl font-bold">Service Category Management</h1>
      <p className="text-gray-500">Manage categories → subcategories → service items.</p>

      {/* ADD MAIN CATEGORY */}
      <div className="bg-white p-6 rounded-2xl border shadow space-y-6">
        <div className="flex gap-3">
          <Input
            placeholder="New main category name..."
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <Button className="flex items-center gap-2" onClick={addMainCategory}>
            <PlusCircle className="w-4 h-4" /> Add Category
          </Button>
        </div>
      </div>

      {/* DISPLAY CATEGORIES */}
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat._id} className="bg-white p-6 border rounded-xl shadow">
            {/* MAIN CATEGORY HEADER */}
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">{cat.title}</h2>

              <Trash
                className="w-5 h-5 cursor-pointer text-red-600"
                onClick={() => removeCategory(cat._id!)}
              />
            </div>

            {/* ADD SUBCATEGORY */}
            <AddInput
              placeholder="Add subcategory..."
              onAdd={(val) => addSubcategory(cat._id!, val)}
            />

            {/* SUBCATEGORIES LIST */}
            <div className="pl-6 mt-4 space-y-4">
              {cat.children.map((sub, subIndex) => (
                <div key={subIndex} className="border p-4 rounded-lg bg-gray-50">
                  <h3 className="font-medium text-gray-700">{sub.title}</h3>

                  {/* ADD SERVICE ITEM */}
                  <AddInput
                    placeholder="Add service item..."
                    onAdd={(val) =>
                      addServiceItem(cat._id!, subIndex, val)
                    }
                  />

                  {/* SERVICE ITEMS */}
                  <div className="flex flex-wrap gap-2 mt-3">
                    {sub.items.map((item, itemIndex) => (
                      <Badge
                        key={itemIndex}
                        className="bg-white text-black border px-3 py-2 flex items-center gap-2 rounded-xl shadow"
                      >
                        {item.title}
                        <Trash className="w-4 h-4 text-red-600 cursor-pointer" />
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 🟦 Reusable Add Input Component
function AddInput({
  placeholder,
  onAdd,
}: {
  placeholder: string;
  onAdd: (value: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <div className="flex gap-3 mt-3 text-black">
      <Input
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button
        className="flex items-center gap-2"
        onClick={() => {
          if (!value.trim()) return;
          onAdd(value);
          setValue("");
        }}
      >
        <PlusCircle className="w-4 h-4" /> Add
      </Button>
    </div>
  );
}
