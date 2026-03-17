"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Facebook, Twitter, Linkedin, Share2, Link as LinkIcon } from "lucide-react";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  //  Mock Blog Data (CMS READY)
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
      content: [
        {
          heading: "Set Clear Goals",
          text: "Start by defining clear and achievable goals for your team.",
        },
        {
          heading: "Use Productivity Tools",
          text: "Leverage tools like Notion, Slack, and Trello to streamline work.",
        },
      ],
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
      content: [
        {
          heading: "Build Scalable Systems",
          text: "Ensure your backend can handle increasing users.",
        },
      ],
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
      content: [
        {
          heading: "Understand APIs",
          text: "APIs allow systems to communicate with each other.",
        },
      ],
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
      content: [
        {
          heading: "Funding",
          text: "Securing funding is one of the biggest hurdles.",
        },
      ],
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
      content: [
        {
          heading: "MRR",
          text: "Monthly Recurring Revenue is crucial for SaaS growth.",
        },
      ],
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
      content: [
        {
          heading: "Collaboration Tools",
          text: "Use Slack and Zoom for better communication.",
        },
      ],
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
      content: [
        {
          heading: "Digital Marketing",
          text: "Focus on SEO and paid ads for growth.",
        },
      ],
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
      content: [
        {
          heading: "Seed Funding",
          text: "Start with angel investors or seed funds.",
        },
      ],
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
      content: [
        {
          heading: "Hiring Strategy",
          text: "Hire the right people at the right time.",
        },
      ],
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
      content: [
        {
          heading: "Minimal Design",
          text: "Clean UI is trending in modern apps.",
        },
      ],
    },
  ];

  //  Find blog by slug
  const blog = blogs.find((b) => b.slug === slug);

  //  Related Blogs (exclude current)
  const relatedBlogs = blogs.filter((b) => b.slug !== slug);

  const currentUrl =
  typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
  const shareData = {
    title: blog.title,
    text: blog.description,
    url: window.location.href,
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      // fallback if not supported
      navigator.clipboard.writeText(shareData.url);
      alert("Link copied!");
    }
  } catch (error) {
    console.log("Share cancelled or failed");
  }
};

const shareLinks = {
  facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
  twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${blog.title}`,
  linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
};

  if (!blog) {
    return <div className="p-10">Blog not found</div>;
  }

  return (
    <div className="bg-gray-50 min-h-screen px-10 py-4">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            {blog.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            {/* <div className="w-8 h-8 rounded-full bg-gray-300" /> */}
            <p className="text-sm mb-1">
                Posted Date:{" "}
                <span className="text-gray-500">{blog.date}</span>
              </p>
            {/* <p>
              {blog.author} • {blog.date} • {blog.readTime}
            </p> */}
          </div>

          {/* Image */}
          <div className="relative w-full h-[200px] rounded-xl overflow-hidden mb-2">
            <Image
              src={blog.image}
              alt={blog.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Category */}
          {/* <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full">
            {blog.category}
          </span> */}

          {/* Description */}
          <p className="text-gray-600 mt-4 leading-relaxed">
            {blog.description}
          </p>

          {/* Content Sections */}
          {/* <div className="mt-6 space-y-6">
            {blog.content.map((item, index) => (
              <div key={index}>
                <h2 className="text-xl font-semibold mb-2">
                  {index + 1}. {item.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div> */}

          {/* Share */}
          <div className="mt-8">
            <p className="mb-3 font-medium">Share this article</p>
            <div className="flex gap-3">
            {/* Facebook */}
            <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition"
            >
                <Facebook size={18} />
            </a>

            {/* Twitter */}
            <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white hover:scale-110 transition"
            >
                <Twitter size={18} />
            </a>

            {/* LinkedIn */}
            <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-800 text-white hover:scale-110 transition"
            >
                <Linkedin size={18} />
            </a>

            {/* Copy Link */}
            <button
                onClick={handleShare}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-orangeButton cursor-pointer text-white hover:scale-105 transition"
            >
                <Share2 size={18} />
    
            </button>
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR */}
        <div className="space-y-6">
          {/* Newsletter */}
          <div className="bg-white p-2 rounded-xl shadow-sm">
            <h3 className="font-semibold text-orangeButton ">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-gray-500 mb-2">
              Stay updated with the latest blog posts
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="border px-3 py-1 rounded-full w-full"
              />
              <button className="primary-button w-[100px] h-[30px]">
                Subscribe
              </button>
            </div>
          </div>

          {/* Related Articles */}
          <div>
            <h3 className="font-semibold mb-4 text-orangeButton">Related Articles</h3>
            <div className="space-y-4">
              {relatedBlogs.map((item) => (
                <div key={item.slug} className="flex gap-3">
                  <div className="relative w-20 h-16 rounded-md overflow-hidden">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium leading-tight">
                      {item.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {item.author} • {item.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share */}
          {/* <div>
            <h3 className="font-semibold mb-3">Share this post</h3>
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-full bg-blue-500" />
              <div className="w-9 h-9 rounded-full bg-sky-400" />
              <div className="w-9 h-9 rounded-full bg-blue-700" />
              <div className="w-9 h-9 rounded-full bg-orange-400" />
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}