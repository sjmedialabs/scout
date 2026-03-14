"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ContentPoliciesPage() {
  // Last saved version (mock – later comes from backend)
  const [savedPolicy, setSavedPolicy] = useState(
    ""
  );

  // Current editable text
  const [policyText, setPolicyText] = useState(savedPolicy);

  const handleSave = () => {
    setSavedPolicy(policyText);
    console.log("Saved content policy:", policyText);
    alert("Content policies saved successfully.");
  };

  const handleCancel = () => {
    setPolicyText(savedPolicy);
  };

  return (
    <div className="space-y-3">
      {/* HEADER */}
      <div>
        <h1 className="text-xl font-bold text-orangeButton ">
          Content Policies
        </h1>
        <p className="text-gray-500 text-md ">
          Define and manage the platform’s content guidelines. These policies
          help users understand what is allowed, restricted, or prohibited on
          the platform.
        </p>
      </div>

      {/* EDITOR CARD */}
      <div className="rounded-2xl border shadow-md bg-white">
        <div className="px-3 space-y-2 py-3">
          {/* Section Title */}
          <div>
            <h2 className="text-lg font-semibold text-orangeButton ">
              Policy Description
            </h2>
            <p className="text-sm text-gray-500 ">
              Write or update your platform’s content rules and moderation
              guidelines.
            </p>
          </div>

          {/* TEXT EDITOR */}
          <Textarea
            value={policyText}
            onChange={(e) => setPolicyText(e.target.value)}
            rows={14}
            placeholder="Start writing your content policies here..."
            className="resize-none rounded-xl border-gray-200 text-sm leading-relaxed placeholder:text-gray-500"
          />

          {/* ACTIONS */}
          <div className="flex justify-end gap-4">
            {/* <Button
              variant="outline"
              className="rounded-xl bg-[#ff0505] text-white"
              onClick={handleCancel}
              disabled={policyText === savedPolicy}
            >
              Cancel
            </Button> */}

            <Button
              className="btn-blackButton h-[30px]"
              onClick={handleSave}
              disabled={policyText.trim() === ""}
            >
              Save Policies
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
