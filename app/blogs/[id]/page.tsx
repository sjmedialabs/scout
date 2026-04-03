"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { Facebook, Twitter, Linkedin, Share2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BlogDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const [blogs, setBlogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // ✅ FETCH CMS BLOGS
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/cms");
        const data = await res.json();

        // 👇 assuming structure: { data: { blogs: [] } }
        setBlogs(data?.data?.blogs || []);
      } catch (error) {
        console.log("Failed to fetch CMS blogs", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // ✅ Find blog by ID
  const blog = blogs.find((b) => String(b._id) === String(id));

  // ✅ Related Blogs
  // const relatedBlogs = blogs.filter((b) => String(b.id) !== String(id));
  const relatedBlogs = blogs.filter(
  (b) => String(b._id) !== String(id)
);

  const currentUrl =
    typeof window !== "undefined" ? window.location.href : "";

  const handleShare = async () => {
    if (!blog) return;

    const shareData = {
      title: blog.title,
      text: blog.description,
      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        navigator.clipboard.writeText(shareData.url);
        alert("Link copied!");
      }
    } catch (error) {
      console.log("Share cancelled or failed");
    }
  };

  const shareLinks = blog
    ? {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${currentUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${currentUrl}&text=${blog.title}`,
        linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${currentUrl}`,
      }
    : {};

  if (loading) {
    return <div className="p-10">Loading...</div>;
  }

  if (!blog) {
    return <div className="p-10">Blog not found</div>;
  }

  return (
    <div className=" min-h-screen max-w-7xl mx-auto md:px-8 xl:px-0 px-6 py-4">
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT CONTENT */}
        <div className="lg:col-span-2">
          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold mb-1">
            {blog.title}
          </h1>

          {/* Author */}
          <div className="flex items-center gap-3 text-sm text-gray-500 mb-6">
            <p className="text-sm mb-1">
              Posted Date:{" "}
              <span className="text-gray-500">
                {new Date(blog.postedDate).toLocaleDateString("en-GB")}
              </span>
            </p>
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

          {/* Description */}
          <div className="text-gray-600 mt-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: blog.description }}
          />
          
                
                
            

          {/* Share */}
          <div className="mt-8">
            <p className="mb-3 font-medium">Share this article</p>
            <div className="flex gap-3">
              <a
                href={shareLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-600 text-white hover:scale-110 transition"
              >
                <Facebook size={18} />
              </a>

              <a
                href={shareLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-sky-500 text-white hover:scale-110 transition"
              >
                <Twitter size={18} />
              </a>

              <a
                href={shareLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-800 text-white hover:scale-110 transition"
              >
                <Linkedin size={18} />
              </a>

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
          {/* <div className="bg-white p-2 rounded-xl shadow-sm">
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
          </div> */}

          {/* Related Articles */}
          <div
          >
            <h3 className="font-semibold mb-4 text-orangeButton">
              Related Articles
            </h3>
            <div className="space-y-4">
              {relatedBlogs.map((item) => (
                <div
                  onClick={() => {
                    console.log(item._id);
                    router.push(`/blogs/${item._id}`);
                  }}
                 key={item._id} className="flex gap-3 cursor-pointer">
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
                     <p className="text-sm mb-1">
                    Posted Date:{" "}
                    <span className="text-gray-500">
                      {new Date(item.postedDate).toLocaleDateString("en-GB")}
                    </span>
                  </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}