"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Trash } from "lucide-react";
import FileUpload from "@/components/file-upload";

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
  icon?: string | null;
  isMainCategory: boolean;
  children: SubCategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
const [editingId, setEditingId] = useState<string | null>(null);
const [editTitle, setEditTitle] = useState("");
const [editIcon, setEditIcon] = useState<string | null>(null);
// For editing subcategory
const [editingSub, setEditingSub] = useState<{ catId: string; index: number } | null>(null);
const [editSubTitle, setEditSubTitle] = useState("");

// For editing service items
const [editingItem, setEditingItem] = useState<{ catId: string; subIndex: number; itemIndex: number } | null>(null);
const [editItemTitle, setEditItemTitle] = useState("");

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

const updateCategory = async (catId: string, data: Partial<MainCategory>) => {
  try {
    const res = await fetch(`/api/service-categories/${catId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();

    if (!res.ok || !result.success) {
      console.error("Update failed:", result.message || "Unknown error");
      return false;
    }

    return result.data; // Return updated category
  } catch (error) {
    console.error("Update error:", error);
    return false;
  }
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

  {/* ICON + UPLOAD */}
  <div className="flex flex-col items-center w-32">
    <img
      src={editingId === cat._id ? editIcon || "/images/placeholder.png" : cat.icon || "/images/placeholder.png"}
      className="w-16 h-16 object-cover rounded-full border mb-2"
    />

    {editingId === cat._id && (
      <FileUpload
        onChange={(url) => {
          setEditIcon(url); // store locally, don't update DB yet
        }}
      />
    )}
  </div>

  {/* TITLE OR INPUT */}
  <div className="flex-1 ml-4">
    {editingId === cat._id ? (
      <Input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
        className="text-lg font-semibold"
      />
    ) : (
      <h2 className="text-xl font-semibold">{cat.title}</h2>
    )}
  </div>

  {/* ACTION BUTTONS */}
  <div className="flex items-center gap-3">

    {editingId === cat._id ? (
      <>
        {/* SAVE */}
        <Button
          size="sm"
          onClick={async () => {
            const updated = {
              ...cat,
              title: editTitle,
              slug: slugify(editTitle),
              icon: editIcon || cat.icon || null, // update icon at save time
            };

            await updateCategory(cat._id!, updated);

            setEditingId(null);
            setEditIcon(null);
            fetchCategories(); // refresh UI
          }}
        >
          Save
        </Button>

        {/* CANCEL */}
        <Button
          size="sm"
          variant="outline"
          onClick={() => {
            setEditingId(null);
            setEditIcon(null);
          }}
        >
          Cancel
        </Button>
      </>
    ) : (
      <Button
        size="sm"
        variant="outline"
        onClick={() => {
          setEditingId(cat._id!);
          setEditTitle(cat.title);
          setEditIcon(cat.icon || null);
        }}
      >
        Edit
      </Button>
    )}

    {/* DELETE */}
    <Trash
      className="w-5 h-5 cursor-pointer text-red-600"
      onClick={() => removeCategory(cat._id!)}
    />
  </div>
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

      {/* SUBCATEGORY TITLE */}
      <div className="flex justify-between items-center">
        {editingSub?.catId === cat._id && editingSub?.index === subIndex ? (
          <Input
            value={editSubTitle}
            onChange={(e) => setEditSubTitle(e.target.value)}
            className="font-medium text-gray-700 w-64"
          />
        ) : (
          <h3 className="font-medium text-gray-700">{sub.title}</h3>
        )}

        {/* SUBCATEGORY ACTION BUTTONS */}
        <div className="flex gap-2">
          {editingSub?.catId === cat._id && editingSub?.index === subIndex ? (
            <>
              <Button
                size="sm"
                onClick={async () => {
                  const updated = { ...cat };
                  updated.children[subIndex].title = editSubTitle;
                  updated.children[subIndex].slug = slugify(editSubTitle);

                  await updateCategory(cat._id!, updated);
                  setEditingSub(null);
                  fetchCategories();
                }}
              >
                Save
              </Button>

              <Button
                size="sm"
                variant="outline"
                onClick={() => setEditingSub(null)}
              >
                Cancel
              </Button>
            </>
          ) : (
            <Button
              size="sm"
              variant="outline"
              onClick={() => {
                setEditingSub({ catId: cat._id!, index: subIndex });
                setEditSubTitle(sub.title);
              }}
            >
              Edit Subcategory
            </Button>
          )}
        </div>
      </div>

      {/* ADD SERVICE ITEM */}
      <AddInput
        placeholder="Add service item..."
        onAdd={(val) => addServiceItem(cat._id!, subIndex, val)}
      />

      {/* SERVICE ITEMS LIST */}
      <div className="flex flex-wrap gap-2 mt-3">
        {sub.items.map((item, itemIndex) => (
          <div key={itemIndex} className="flex items-center gap-2">

            {/* SERVICE ITEM TITLE / INPUT */}
            {editingItem?.catId === cat._id &&
             editingItem?.subIndex === subIndex &&
             editingItem?.itemIndex === itemIndex ? (
              <Input
                value={editItemTitle}
                onChange={(e) => setEditItemTitle(e.target.value)}
                className="h-8 w-48"
              />
            ) : (
              <Badge className="bg-white text-black border px-3 py-2 rounded-xl shadow">
                {item.title}
              </Badge>
            )}

            {/* SERVICE ITEM ACTION BUTTONS */}
            {editingItem?.catId === cat._id &&
            editingItem?.subIndex === subIndex &&
            editingItem?.itemIndex === itemIndex ? (
              <>
                <Button
                  size="sm"
                  onClick={async () => {
                    const updated = { ...cat };
                    updated.children[subIndex].items[itemIndex].title =
                      editItemTitle;
                    updated.children[subIndex].items[itemIndex].slug =
                      slugify(editItemTitle);

                    await updateCategory(cat._id!, updated);
                    setEditingItem(null);
                    fetchCategories();
                  }}
                >
                  Save
                </Button>

                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setEditingItem(null)}
                >
                  Cancel
                </Button>
              </>
            ) : (
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setEditingItem({
                    catId: cat._id!,
                    subIndex,
                    itemIndex,
                  });
                  setEditItemTitle(item.title);
                }}
              >
                Edit
              </Button>
            )}

            {/* DELETE SERVICE ITEM */}
            <Trash
              className="w-4 h-4 text-red-600 cursor-pointer"
              onClick={async () => {
                const updated = { ...cat };
                updated.children[subIndex].items.splice(itemIndex, 1);

                await updateCategory(cat._id!, updated);
                fetchCategories();
              }}
            />
          </div>
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
