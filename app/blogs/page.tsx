"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function BlogPage() {
  const [search, setSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(8);

  //  Mock Data (CMS-ready structure)
  const blogs = [
    {
      id: 1,
      slug: "startup-productivity",
      title: "10 Tips to Skyrocket Your Startup’s Productivity",
      description:
        "Boost your team's efficiency with these 10 actionable productivity tips for startups.",
      image: "/blog1.jpg",
      category: "PRODUCTIVITY",
      author: "Emily Roberts",
      date: "Apr 22, 2024",
      readTime: "5 min read",
    },
    {
      id: 2,
      slug: "saas-scaling",
      title: "How to Scale Your SaaS Business in 2024",
      description:
        "Discover the essential steps to successfully scale your SaaS business.",
      image: "/blog2.jpg",
      category: "BUSINESS",
      author: "Mark Anderson",
      date: "Apr 18, 2024",
      readTime: "5 min read",
    },
    {
      id: 3,
      slug: "api-integrations",
      title: "A Beginner’s Guide to API Integrations",
      description:
        "Learn the basics of API integrations and how they can streamline your SaaS product.",
      image: "/blog3.jpg",
      category: "DEVELOPMENT",
      author: "Sarah Johnson",
      date: "Apr 15, 2024",
      readTime: "5 min read",
    },
    {
      id: 4,
      slug: "startup-challenges",
      title: "The Top 5 Challenges Facing New Startups",
      description:
        "Explore the biggest challenges new startups face and how to overcome them.",
      image: "/blog4.jpg",
      category: "STARTUPS",
      author: "David Kim",
      date: "Apr 10, 2024",
      readTime: "5 min read",
    },
    {
      id: 5,
      slug: "saas-metrics",
      title: "Essential SaaS Metrics for Startup Success",
      description:
        "Track these key SaaS metrics to ensure your startup grows effectively.",
      image: "/blog5.jpg",
      category: "SAAS",
      author: "Jessica Lee",
      date: "Apr 1, 2024",
      readTime: "6 min read",
    },
    {
      id: 6,
      slug: "team-efficiency-tools",
      title: "5 Tools to Enhance Your Team’s Efficiency",
      description:
        "These tools will help your team collaborate and work faster.",
      image: "/blog6.jpg",
      category: "PRODUCTIVITY",
      author: "Jessica Lee",
      date: "Apr 05, 2024",
      readTime: "4 min read",
    },
    {
      id: 7,
      slug: "marketing-2024",
      title: "Marketing Strategies for 2024",
      description: "Top marketing trends you should follow this year.",
      image: "/blog1.jpg",
      category: "MARKETING",
      author: "John Doe",
      date: "Apr 06, 2024",
      readTime: "5 min read",
    },
    {
      id: 8,
      slug: "startup-funding",
      title: "Startup Funding Guide",
      description: "How to raise funds for your startup.",
      image: "/blog2.jpg",
      category: "STARTUP",
      author: "Jane Smith",
      date: "Apr 07, 2024",
      readTime: "6 min read",
    },
    {
      id: 9,
      slug: "scaling-teams",
      title: "Scaling Teams Efficiently",
      description: "Build and scale high-performing teams.",
      image: "/blog3.jpg",
      category: "BUSINESS",
      author: "Alex",
      date: "Apr 08, 2024",
      readTime: "4 min read",
    },
    {
      id: 10,
      slug: "ui-ux-trends",
      title: "UI/UX Trends",
      description: "Latest UI/UX design trends.",
      image: "/blog4.jpg",
      category: "DESIGN",
      author: "Chris",
      date: "Apr 09, 2024",
      readTime: "3 min read",
    },
  ];

  //  Search Filter
  const filteredBlogs = blogs.filter((blog) =>
    blog.title.toLowerCase().includes(search.toLowerCase())
  );

  //  Slice based on visible count
  const visibleBlogs = filteredBlogs.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-gray-50 px-10 py-4">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-orangeButton">Blog</h1>
          <p className="text-gray-500">
            Insights, tips & stories to help you grow your business
          </p>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search blog posts..."
          className="border rounded-full px-5 py-2 w-full md:w-80 outline-none focus:ring-2 focus:ring-orange-500"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setVisibleCount(8); 
          }}
        />
      </div>

      {/* Blog Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
        {visibleBlogs.map((blog) => (
            <Link href={`/blogs/${blog.slug}`} key={blog.id}>
                <div className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer">
            {/* Image */}
            <div className="relative w-full h-40">
              <Image
                src={blog.image}
                alt={blog.title}
                fill
                className="object-cover"
              />
            </div>

            {/* Content */}
            <div className="p-5">
              {/* Category */}
              {/* <span className="text-xs bg-gray-100 px-3 py-1 rounded-full text-gray-600">
                {blog.category}
              </span> */}

              {/* Title */}
              <h2 className="text-lg font-semibold mt-2 mb-1 leading-tight ">
                {blog.title}
              </h2>

              <p className="text-sm mb-1">
                Posted Date:{" "}
                <span className="text-gray-500">{blog.date}</span>
              </p>

              {/* Author + Date */}
              {/* <p className="text-sm text-gray-500 mb-2">
                {blog.author} • {blog.date} • {blog.readTime}
              </p> */}

              {/* Description */}
              <p className="text-sm text-gray-600 line-clamp-2">
                {blog.description}
              </p>
            </div>
          </div>
          </Link>
        ))}
      </div>

      {/* Load More */}
      {/* Load More */}
      {visibleCount < filteredBlogs.length && (
        <div className="flex justify-center mt-10">
          <button
            disabled={visibleCount >= filteredBlogs.length}
            onClick={() => setVisibleCount((prev) => prev + 4)}
            className="primary-button h-[30px] w-[120px] disabled:opacity-50"
            >
            Load More
            </button>
        </div>
      )}

      {/* Newsletter Section */}
      {/* <div className="bg-white rounded-xl shadow-sm p-6 mt-12 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-xl font-semibold">
            Subscribe to our newsletter
          </h3>
          <p className="text-gray-500 text-sm">
            Stay updated with the latest blog posts
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="email"
            placeholder="Enter your email address"
            className="border px-4 py-2 rounded-full w-full md:w-72 outline-none"
          />
          <button className="bg-orange-500 text-white px-5 py-2 rounded-full hover:bg-orange-600">
            Subscribe
          </button>
        </div>
      </div> */}
    </div>
  );
}