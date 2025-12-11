"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { adminMenu } from "../sidebar-config";
import { useState } from "react";

export function AdminSidebar() {
  const pathname = usePathname();
  const current = pathname.split("/")[2]; // admin/<section>
  const [open, setOpen] = useState<string[]>(["dashboard"]);

  const toggle = (label: string) => {
    setOpen(prev => prev.includes(label) ? prev.filter(v => v !== label) : [...prev, label]);
  };

  return (
    <aside className="fixed left-0 top-0 w-72 h-full bg-white border-r z-20">
      <div className="p-5 border-b">
        <h2 className="text-xl font-bold">Super Admin Dashboard</h2>
        <p className="text-sm text-gray-500">Welcome back</p>
      </div>

      <div className="p-4 overflow-y-auto h-full">
        {adminMenu.map(section => (
          <div key={section.label} className="mb-4">
            <button
              onClick={() => toggle(section.label)}
              className="w-full flex justify-between items-center text-gray-600 hover:text-black"
            >
              <div className="flex items-center gap-3">
                <section.icon className="w-4 h-4" />
                <span className="text-sm font-medium">{section.label}</span>
              </div>

              {open.includes(section.label)
                ? <ChevronDown className="w-4 h-4" />
                : <ChevronRight className="w-4 h-4" />}
            </button>

            {open.includes(section.label) && (
              <div className="ml-6 mt-2 space-y-1">
                {section.children.map(item => {
                  const active = current === item.id;
                  return (
                    <Link
                      key={item.id}
                      href={`/admin/${item.id}`}
                      className={`flex items-center gap-2 px-2 py-2 rounded-lg text-sm transition 
                        ${active ? "bg-blue-600 text-white" : "text-gray-500 hover:bg-gray-100"}
                      `}
                    >
                      <item.icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
