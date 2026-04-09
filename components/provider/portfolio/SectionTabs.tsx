"use client";

import { useState, useEffect, useRef } from "react";

const tabs = [
  { label: "Overview", id: "overview" },
   { label: "Portfolio & Awards", id: "portfolio" },
  { label: "Case Studies", id: "case-studies" },
  { label: "Reviews", id: "reviews" },
 
];

export default function SectionTabs() {
  const [active, setActive] = useState("overview");
  const isClickScrolling = useRef(false); 

  const handleTabClick = (id: string) => {
    console.log("Recived Prop Id", id);

    isClickScrolling.current = true; // block scroll listener
    setActive(id);

    const el = document.getElementById(id);
    if (!el) return;

    const tabsHeight = 100;
    const y =
      el.getBoundingClientRect().top + window.scrollY - tabsHeight;

    window.scrollTo({
      top: y,
      behavior: "smooth",
    });

    setTimeout(() => {
      isClickScrolling.current = false;
    }, 500);
  };

  useEffect(() => {
  const handleScroll = () => {
    if (isClickScrolling.current) return;

    let current = "overview";

    for (let i = 0; i < tabs.length; i++) {
      const section = document.getElementById(tabs[i].id);
      if (!section) continue;

      const rect = section.getBoundingClientRect();

      // section is in viewport near top
      if (rect.top <= 120 && rect.bottom >= 120) {
        current = tabs[i].id;
        break;
      }
    }

    setActive(current);
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
            onClick={() => handleTabClick(tab.id)}
            className={`whitespace-nowrap pb-2 border-b-2 transition text-sm cursor-pointer ${
              active === tab.id
                ? "border-black font-semibold text-black"
                : "border-transparent text-gray-500 font-semibold"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}