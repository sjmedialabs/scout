"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function ContentManagementPage() {
  const [formData, setFormData] = useState({
    key: "",
    type: "page",
    title: "",
    subtitle: "",
    description: "",
    image: "",
    icon: "",
    link: "",
    content: "{}",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("/api/cms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          content: JSON.parse(formData.content || "{}"),
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Content saved successfully!");
        setFormData({
          key: "",
          type: "page",
          title: "",
          subtitle: "",
          description: "",
          image: "",
          icon: "",
          link: "",
          content: "{}",
        });
      } else {
        setMessage("Error: " + data.error);
      }
    } catch (error) {
      console.error(error);
      setMessage("Failed to save content.");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-6 space-y-4">
      <h1 className="text-2xl font-bold">Content Management</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <Input
          name="key"
          placeholder="Unique key (e.g., about_us)"
          value={formData.key}
          onChange={handleChange}
          required
        />

        {/* Content Type */}
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          className="border p-2 rounded w-full"
        >
          <option value="page">Page</option>
          <option value="hero">Hero</option>
          <option value="category">Category</option>
          <option value="feature">Feature</option>
          <option value="testimonial">Testimonial</option>
          <option value="faq">FAQ</option>
          <option value="setting">Setting</option>
        </select>

        <Input
          name="title"
          placeholder="Title"
          value={formData.title}
          onChange={handleChange}
        />

        <Input
          name="subtitle"
          placeholder="Subtitle"
          value={formData.subtitle}
          onChange={handleChange}
        />

        <Textarea
          name="description"
          placeholder="Short description"
          value={formData.description}
          onChange={handleChange}
        />

        <Input
          name="image"
          placeholder="Image URL"
          value={formData.image}
          onChange={handleChange}
        />

        <Input
          name="icon"
          placeholder="Icon name (optional)"
          value={formData.icon}
          onChange={handleChange}
        />

        <Input
          name="link"
          placeholder="Link URL"
          value={formData.link}
          onChange={handleChange}
        />

        {/* JSON content */}
        <Textarea
          name="content"
          placeholder='JSON content (e.g. {"sections": []})'
          rows={5}
          value={formData.content}
          onChange={handleChange}
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Content"}
        </Button>
      </form>

      {message && <p className="text-sm mt-3">{message}</p>}
    </div>
  );
}
