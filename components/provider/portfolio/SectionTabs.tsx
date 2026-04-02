"use client";

import { useState, useEffect } from "react";

const tabs = [
  { label: "Overview", id: "overview" },
  { label: "Case Studies", id: "case-studies" },
  { label: "Reviews", id: "reviews" },
  
];

export default function SectionTabs() {
  const [active, setActive] = useState("overview");

  const handleScroll = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const tabsHeight = 100; 
  const y =
    el.getBoundingClientRect().top + window.scrollY - tabsHeight;

  window.scrollTo({
    top: y,
    behavior: "smooth",
  });

  setActive(id);
};

useEffect(() => {
  const handleScroll = () => {
    const scrollPosition = window.scrollY + 100; // offset for header/tabs

    for (let i = tabs.length - 1; i >= 0; i--) {
      const section = document.getElementById(tabs[i].id);
      if (!section) continue;

      if (scrollPosition >= section.offsetTop) {
        setActive(tabs[i].id);
        break;
      }
    }
  };

  window.addEventListener("scroll", handleScroll);

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}, []);

const visibleTabs = tabs.filter((tab) => {
  if (typeof window === "undefined") return true;
  return document.getElementById(tab.id);
});

  return (
    <div className="sticky top-14 z-50 bg-white border-b shadow-sm">
      <div className="flex gap-6 overflow-x-auto items-center justify-center px-4 py-3">
        {visibleTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => handleScroll(tab.id)}
            className={`whitespace-nowrap pb-2 border-b-2 transition text-sm cursor-pointer ${
              active === tab.id
                ? "border-black font-semibold text-black"
                : "border-transparent text-gray-500 font-semiblod"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}