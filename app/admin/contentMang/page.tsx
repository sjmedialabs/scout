"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import FileUpload from "@/components/file-upload";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function ContentManagementPage() {
  const [cms, setCMS] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Load existing CMS data
  useEffect(() => {
    async function load() {
      const res = await fetch("/api/cms");
      const data = await res.json();
      setCMS(data.data || {});
    }
    load();
  }, []);

  const updateField = (field: string, value: any) => {
    setCMS((prev: any) => ({ ...prev, [field]: value }));
  };

  const updateNested = (group: string, field: string, value: any) => {
    setCMS((prev: any) => ({
      ...prev,
      [group]: { ...prev[group], [field]: value },
    }));
  };

  const handleAdd = (field: string, item: any) => {
    setCMS((prev: any) => ({
      ...prev,
      [field]: [...prev[field], item],
    }));
  };

  const handleRemove = (field: string, index: number) => {
    setCMS((prev: any) => ({
      ...prev,
      [field]: prev[field].filter((_: any, i: number) => i !== index),
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setMessage("");

    const res = await fetch("/api/cms", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ key: "home", ...cms }),
    });

    const data = await res.json();
    setMessage(data.success ? "Saved Successfully!" : data.error);
    setLoading(false);
  };

  if (!cms) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="bg-white rounded-lg shadow p-6 space-y-6">
      <h1 className="text-2xl font-bold">CMS Management</h1>

      <Tabs defaultValue="home" className="w-full">
        <TabsList className="grid grid-cols-4 mb-6">
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="about">About</TabsTrigger>
          <TabsTrigger value="team">Team</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
        </TabsList>

        {/* ─────────────────────────────── HOME TAB ─────────────────────────────── */}
        <TabsContent value="home" className="space-y-6">

          {/* HERO SECTION */}
          <section className="space-y-4 border p-4 rounded">
            <h2 className="text-xl font-semibold">Hero Section</h2>

            <FileUpload
              value={cms.homeBannerImg}
              onChange={(url) => updateField("homeBannerImg", url)}
              accept="image/*"
            />

            <Input
              placeholder="Home Banner Title"
              value={cms.homeBannerTitle}
              onChange={(e) => updateField("homeBannerTitle", e.target.value)}
            />

            <Input
              placeholder="Home Banner Subtitle"
              value={cms.homeBannerSubtitle}
              onChange={(e) => updateField("homeBannerSubtitle", e.target.value)}
            />
          </section>

          {/* HOME WORK SECTION */}
          <section className="space-y-4 border p-4 rounded">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">How Spark Works</h2>
              <Button
                onClick={() =>
                  handleAdd("homeWorkSection", { title: "", description: "", image: "" })
                }
              >
                + Add Step
              </Button>
            </div>

            {cms.homeWorkSection?.map((item: any, index: number) => (
              <div key={index} className="border p-3 rounded space-y-2">

                <Input
                  placeholder="Title"
                  value={item.title}
                  onChange={(e) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].title = e.target.value;
                    updateField("homeWorkSection", updated);
                  }}
                />

                <FileUpload
                  value={item.image}
                  onChange={(url) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].image = url;
                    updateField("homeWorkSection", updated);
                  }}
                  accept="image/*"
                />

                <Textarea
                  placeholder="Description"
                  value={item.description}
                  onChange={(e) => {
                    const updated = [...cms.homeWorkSection];
                    updated[index].description = e.target.value;
                    updateField("homeWorkSection", updated);
                  }}
                />

                <Button variant="destructive" onClick={() => handleRemove("homeWorkSection", index)}>
                  Remove
                </Button>
              </div>
            ))}

          </section>

          {/* HOME SERVICE CATEGORIES */}
          <section className="space-y-4 border p-4 rounded">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Home Service Categories</h2>
              <Button onClick={() => handleAdd("homeServicesCategories", "")}>
                + Add Category
              </Button>
            </div>

            {cms.homeServicesCategories?.map((cat: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={cat}
                  onChange={(e) => {
                    const updated = [...cms.homeServicesCategories];
                    updated[index] = e.target.value;
                    updateField("homeServicesCategories", updated);
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("homeServicesCategories", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>

          {/* GET STARTED */}
          <section className="space-y-4 border p-4 rounded">
            <h2 className="text-xl font-semibold">Get Started Section</h2>

            <Input
              placeholder="Title"
              value={cms.getStartedTitle}
              onChange={(e) => updateField("getStartedTitle", e.target.value)}
            />

            <Input
              placeholder="Subtitle"
              value={cms.getStartedSubtitle}
              onChange={(e) => updateField("getStartedSubtitle", e.target.value)}
            />
          </section>
        </TabsContent>

        {/* ─────────────────────────────── ABOUT TAB ─────────────────────────────── */}
        <TabsContent value="about" className="space-y-6">

          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">About Banner</h2>

            <FileUpload
              value={cms.aboutBannerImage}
              onChange={(url) => updateField("aboutBannerImage", url)}
            />

            <Input
              placeholder="About Banner Title"
              value={cms.aboutBannerTitle}
              onChange={(e) => updateField("aboutBannerTitle", e.target.value)}
            />

            <Input
              placeholder="About Banner Subtitle"
              value={cms.aboutBannerSubtitle}
              onChange={(e) => updateField("aboutBannerSubtitle", e.target.value)}
            />
          </section>

          {/* ABOUT DESCRIPTION */}
          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">About Content</h2>

            <Textarea
              placeholder="Description 1"
              value={cms.aboutDescription1}
              onChange={(e) => updateField("aboutDescription1", e.target.value)}
            />

            <Textarea
              placeholder="Description 2"
              value={cms.aboutDescription2}
              onChange={(e) => updateField("aboutDescription2", e.target.value)}
            />
          </section>

          {/* ABOUT POINTS */}
          <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">About Points</h2>
              <Button onClick={() => handleAdd("aboutPoints", "")}>+ Add</Button>
            </div>

            {cms.aboutPoints?.map((point: string, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={point}
                  onChange={(e) => {
                    const updated = [...cms.aboutPoints];
                    updated[index] = e.target.value;
                    updateField("aboutPoints", updated);
                  }}
                />
                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutPoints", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>

        </TabsContent>

        {/* ─────────────────────────────── TEAM TAB ─────────────────────────────── */}
        <TabsContent value="team" className="space-y-6">

          <section className="border p-4 rounded space-y-4">
            <h2 className="text-xl font-semibold">Team Section</h2>

            <Input
              placeholder="Team Title"
              value={cms.aboutTeamTitle}
              onChange={(e) => updateField("aboutTeamTitle", e.target.value)}
            />

            <Input
              placeholder="Team Subtitle"
              value={cms.aboutTeamSubtitle}
              onChange={(e) => updateField("aboutTeamSubtitle", e.target.value)}
            />
          </section>

          {/* TEAM LIST */}
          <section className="border p-4 rounded space-y-4">
            <div className="flex justify-between">
              <h2 className="text-xl font-semibold">Team Members</h2>
              <Button
                onClick={() =>
                  handleAdd("aboutTeam", {
                    image: "",
                    name: "",
                    role: "",
                  })
                }
              >
                + Add Member
              </Button>
            </div>

            {cms.aboutTeam?.map((member: any, index: number) => (
              <div key={index} className="border p-4 rounded space-y-3">

                <FileUpload
                  value={member.image}
                  onChange={(url) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].image = url;
                    updateField("aboutTeam", updated);
                  }}
                />

                <Input
                  placeholder="Name"
                  value={member.name}
                  onChange={(e) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].name = e.target.value;
                    updateField("aboutTeam", updated);
                  }}
                />

                <Input
                  placeholder="Role"
                  value={member.role}
                  onChange={(e) => {
                    const updated = [...cms.aboutTeam];
                    updated[index].role = e.target.value;
                    updateField("aboutTeam", updated);
                  }}
                />

                <Button
                  variant="destructive"
                  onClick={() => handleRemove("aboutTeam", index)}
                >
                  Remove
                </Button>
              </div>
            ))}
          </section>

        </TabsContent>

        {/* ─────────────────────────────── CONTACT TAB ─────────────────────────────── */}
        <TabsContent value="contact" className="space-y-6">
          <section className="space-y-4 border p-4 rounded">
            <h2 className="text-xl font-semibold">Contact Details</h2>

            <Input
              placeholder="Email"
              value={cms.contact?.email}
              onChange={(e) => updateNested("contact", "email", e.target.value)}
            />

            <Input
              placeholder="Phone"
              value={cms.contact?.phone}
              onChange={(e) => updateNested("contact", "phone", e.target.value)}
            />

            <Textarea
              placeholder="Address"
              value={cms.contact?.address}
              onChange={(e) => updateNested("contact", "address", e.target.value)}
            />

            <Input
              placeholder="Map URL"
              value={cms.contact?.locationMapUrl}
              onChange={(e) => updateNested("contact", "locationMapUrl", e.target.value)}
            />

            <Input
              placeholder="Facebook URL"
              value={cms.contact?.facebookUrl}
              onChange={(e) => updateNested("contact", "facebookUrl", e.target.value)}
            />

            <Input
              placeholder="LinkedIn URL"
              value={cms.contact?.linkedinUrl}
              onChange={(e) => updateNested("contact", "linkedinUrl", e.target.value)}
            />

            <Input
              placeholder="Twitter URL"
              value={cms.contact?.twitterUrl}
              onChange={(e) => updateNested("contact", "twitterUrl", e.target.value)}
            />

            <Input
              placeholder="Youtube URL"
              value={cms.contact?.youtubeUrl}
              onChange={(e) => updateNested("contact", "youtubeUrl", e.target.value)}
            />
          </section>
        </TabsContent>
      </Tabs>

      <Button className="w-full mt-3" onClick={handleSave} disabled={loading}>
        {loading ? "Saving..." : "Save Changes"}
      </Button>

      {message && <p className="text-center text-sm mt-4">{message}</p>}
    </div>
  );
}
