"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle,Plus,Pencil,X, Trash } from "lucide-react";
import FileUpload from "@/components/file-upload";
import { authFetch } from "@/lib/auth-fetch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
   status?: "active" | "inactive"
  children: SubCategory[];
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<MainCategory[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editIcon, setEditIcon] = useState<string | null>(null);
  const [editStatus, setEditStatus] = useState<"active" | "inactive">("active");

  // For editing subcategory
  const [editingSub, setEditingSub] = useState<{
    catId: string;
    index: number;
  } | null>(null);
  const [editSubTitle, setEditSubTitle] = useState("");


const [openEditCategory, setOpenEditCategory] = useState(false);
const [selectedCategory, setSelectedCategory] = useState<MainCategory | null>(null);


  const [openAddCategory, setOpenAddCategory] = useState(false);
const [openAddSub, setOpenAddSub] = useState(false);
const [openEdit, setOpenEdit] = useState(false);

const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);


  // For editing service items
  const [editingItem, setEditingItem] = useState<{
    catId: string;
    subIndex: number;
    itemIndex: number;
  } | null>(null);
  const [editItemTitle, setEditItemTitle] = useState("");

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const res = await authFetch("/api/service-categories");
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

    const res = await authFetch("/api/service-categories", {
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
        : cat,
    );

    setCategories(updatedCats);
    await updateCategory(catId, updatedCats.find((c) => c._id === catId)!);
  };

  // Add service item to subcategory
  const addServiceItem = async (
    catId: string,
    subIndex: number,
    title: string,
  ) => {
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
    await authFetch(`/api/service-categories/${catId}`, { method: "DELETE" });
  };

  const updateCategory = async (catId: string, data: Partial<MainCategory>) => {
    try {
      const res = await authFetch(`/api/service-categories/${catId}`, {
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
    <div className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-bold text-orangeButton my-custom-class">
          Category Management
        </h1>
        <p className="text-gray-500 my-custom-class">
          Create, edit, and manage content categories
        </p>
      </div>

      {/* TOP ACTION BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-gray-600 my-custom-class">
          Total Categories: {categories.length}
        </p>

        <div className="flex gap-3">
          <Button className="bg-orangeButton rounded-2xl hover:bg-orange-400 flex items-center gap-2"
          onClick={() => setOpenAddCategory(true)}
          >
            <Plus className="w-4 h-4" />
            Add Category
          </Button>

          <Button className="bg-blueButton rounded-2xl hover:bg-indigo-700 flex items-center gap-2"
          onClick={() => setOpenAddSub(true)}
          >
            <Plus className="w-4 h-4" />
            Add sub Category
          </Button>
        </div>
      </div>

      {/* CATEGORY LIST */}
      <div className="space-y-4">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="bg-white border rounded-2xl px-6 py-5 shadow-sm
             grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] items-center gap-40">
            {/* LEFT */}
            <div>
              <h3 className="font-semibold text-gray-900 my-custom-class">{cat.title}</h3>
              <p className="text-sm text-gray-500 my-custom-class">
                {cat.slug.replace(/-/g, " ")}
              </p>
            </div>

            {/* MIDDLE */}
            <div>
              <p className="text-sm font-bold text-gray-900 my-custom-class">
                Sub Categories
              </p>
              <p className="text-sm text-gray-500 my-custom-class">
                {cat.children.length}
              </p>
            </div>

            {/* RIGHT */}
            <div className="flex items-center gap-6">
              <div>
              <Badge className="bg-green-100 text-green-700 px-4 py-1 font-bold rounded-full cursor-pointer my-custom-class">
                Active
              </Badge>
              </div>
              <div className="grid grid-cols-2 gap-6">
              <Pencil 
              className="w-4 h-4 cursor-pointer text-gray-600 hover:text-black" 
              onClick={() => {
                setSelectedCategory(cat);
                setEditTitle(cat.title);
                setEditStatus((cat.status as "active" | "inactive") ?? "active");
                setOpenEditCategory(true);
              }}
              />

              <X className="w-4 h-4 cursor-pointer text-gray-600 hover:text-red-600" />
            </div>
          </div>
          </div>
        ))}
      </div>
      
      {/* Category  */}
      <Dialog open={openAddCategory} onOpenChange={setOpenAddCategory}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Category</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="Category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />

          <Button
            className="w-full mt-4"
            onClick={() => {
              addMainCategory();
              setOpenAddCategory(false);
            }}
          >
            Save & Submit
          </Button>
        </DialogContent>
      </Dialog>


       {/* Sub Category */}
      <Dialog open={openAddSub} onOpenChange={setOpenAddSub}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Add Sub Category</DialogTitle>
          </DialogHeader>

          <select
            className="w-full border rounded-xl px-3 py-2"
            onChange={(e) => {
              const cat = categories.find(c => c._id === e.target.value);
              setSelectedCategory(cat || null);
            }}
          >
            <option>Select Category</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>
                {cat.title}
              </option>
            ))}
          </select>

          <Input
            placeholder="Sub-category name"
            onChange={(e) => setEditSubTitle(e.target.value)}
          />

          <Button
            className="w-full mt-4"
            onClick={() => {
              if (!selectedCategory) return;
              addSubcategory(selectedCategory._id!, editSubTitle);
              setOpenAddSub(false);
            }}
          >
            Save & Submit
          </Button>
        </DialogContent>
      </Dialog>

      {/* Edit Modal */}
      <Dialog open={openEditCategory} onOpenChange={setOpenEditCategory}>
  <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto rounded-2xl">
    <DialogHeader>
      <DialogTitle className="text-orangeButton">
        Edit Category
      </DialogTitle>
    </DialogHeader>

    {/* CATEGORY NAME */}
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">
        Category Name
      </label>
      <Input
        value={editTitle}
        onChange={(e) => setEditTitle(e.target.value)}
      />
    </div>

    {/* STATUS */}
    <div className="space-y-2 mt-4">
      <label className="text-sm font-medium text-gray-700">
        Status
      </label>
      <select
        className="w-full border rounded-xl px-3 py-2"
        value={editStatus}
        onChange={(e) =>
          setEditStatus(e.target.value as "active" | "inactive")
        }
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>
    </div>

    {/* SUB CATEGORIES */}
    <div className="mt-6">
      <h4 className="text-sm font-semibold text-gray-800 mb-2">
        Sub Categories
      </h4>

      <div className="space-y-3">
        {selectedCategory?.children.map((sub, index) => (
          <div key={index} className="flex items-center gap-2">
            <Input
              value={sub.title}
              onChange={(e) => {
                const updated = { ...selectedCategory };
                updated.children[index].title = e.target.value;
                updated.children[index].slug = slugify(e.target.value);
                setSelectedCategory(updated);
              }}
            />

            <Trash
              className="w-4 h-4 cursor-pointer text-red-600"
              onClick={() => {
                const updated = { ...selectedCategory };
                updated.children.splice(index, 1);
                setSelectedCategory(updated);
              }}
            />
          </div>
        ))}
      </div>
    </div>

    {/* SAVE BUTTON */}
    <Button
      className="w-full mt-6 bg-orangeButton"
      onClick={async () => {
        if (!selectedCategory) return;

        await updateCategory(selectedCategory._id!, {
          ...selectedCategory,
          title: editTitle,
          slug: slugify(editTitle),
          status: editStatus, // backend-ready
        });

        fetchCategories();
        setOpenEditCategory(false);
      }}
    >
      Update Category
    </Button>
  </DialogContent>
</Dialog>



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
