"use client";

import type React from "react";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation";
import { useState,useEffect } from "react";
import { useRouter } from "next/navigation";
import { Twitter } from "lucide-react";

export function Footer() {
  const pathname = usePathname();
  const isAgencyDashboard = pathname?.startsWith("/agency/dashboard");
  const [email, setEmail] = useState("");

  const [cms, setCms] = useState<any>(null);
   const router = useRouter();
  const [loading, setLoading] = useState(false);
   useEffect(() => {
    const fetchCMS = async () => {
      const res = await fetch("/api/cms");
      const data = await res.json();
      setCms(data.data);
    };
    fetchCMS();
  }, []);

  console.log("Footer cms",cms)

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    try {
      const response = await fetch("/api/newsletter/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setEmail("");
        alert("Successfully subscribed to newsletter!");
      } else {
        alert("Email Already Existed");
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      alert("Failed to subscribe. Please try again.");
    }
  };

  return (
    <footer className="bg-[url('/images/background-footer.jpg')] bg-cover bg-no-repeat bg-center] dark">
      <div
        className={`max-w-6xl mx-auto px-4 py-0 ${isAgencyDashboard ? "ml-80" : ""}`}
      >
        {/* <div className="grid grid-cols-1 md:grid-cols-4 md:gap-6 justify-center">
          <Link href={"/"}>
            <img
              src="/scoutFooterLogo.png"
              alt=""
              className="col-span-1 py-2 h-24"
            />
          </Link>
          <div className="md:items-center md:col-span-3 flex md:flex-row flex-col md:gap-4 md:border-l border-gray-300 lg:mr-36">
            <div className="basis-1/3 flex md:justify-end">
              <h3 className="text-white font-semibold text-2xl">Subscribe</h3>
            </div>
            <div className="basis-2/3">
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 relative rounded-full items-center px-1 w-full h-full"
              >
                <Input
                  placeholder="Enter email address"
                  className="text-sm rounded-full h-13 min-w-72 px-4 py-0"
                  style={{ backgroundColor: "white" }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  size="sm"
                  type="submit"
                  className="absolute right-1.5 rounded-full bg-orangeButton text-white h-auto py-3.5"
                >
                  Subscribe Now
                </Button>
              </form>
            </div>
          </div>
        </div> */}
        <div className="grid md:grid-cols-4 gap-12 md:justify-center pt-4 md:pt-4">
          {/* Creative Design Sudio */}
          <div className="">
            <Link href={"/"}>
              <img
                src="/scoutFooterLogo.png"
                alt=""
                className="col-span-1 py-2 -ml-2 h-24"
              />
            </Link>
            <ul className="space-y-2 text-lg text-white">
              <li>
                <Link href="/browse" className=" hover:text-foreground">
                  <span className="flex flex-col font-semibold text-[15px]">
                    Address{" "}
                    <span className="font-normal">
                     {cms?.contact?.address || "123 Business Ave San Fancisco, CA 94105"}
                    </span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/providers" className=" hover:text-foreground">
                  <span className="flex text-[15px] flex-col font-semibold">
                    Phone <span className="font-normal">{cms?.contact?.phone}</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/register" className=" hover:text-foreground">
                  <span className="flex flex-col text-[15px] font-semibold">
                    Email <span className="font-normal">{cms?.contact?.email || "hello@spark.com"}</span>
                  </span>
                </Link>
              </li>
            </ul>
            {/* <ul className="space-y-2 text-lg text-white">
              <li>
                <Link href="/browse" className=" hover:text-foreground">
                  Browse Requirements
                </Link>
              </li>
              <li>
                <Link href="/providers" className=" hover:text-foreground">
                  Find Agencies
                </Link>
              </li>
              <li>
                <Link href="/register" className=" hover:text-foreground">
                  Post a Project
                </Link>
              </li>
              <li>
                <Link
                  href="/register?type=provider"
                  className=" hover:text-foreground"
                >
                  Become an Agency
                </Link>
              </li>
            </ul> */}
          </div>

          {/* Company */}
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-orangeButton text-xl">
              Company
            </h4>
            <ul className="space-y-2 text-[15px] text-white">
              <li>
                <Link href="/about" className=" hover:text-foreground">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className=" hover:text-foreground">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/careers" className=" hover:text-foreground">
                  Careers
                </Link>
              </li>
              {/* <li>
                <Link href="/press" className=" hover:text-foreground">
                  Press
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Support */}
          <div className="mt-8">
            <h4 className="font-semibold mb-4 text-orangeButton text-xl">
              Support
            </h4>
            <ul className="space-y-2 text-[15px] text-white">
              <li>
                <Link href="/help-center" className=" hover:text-foreground">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className=" hover:text-foreground">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className=" hover:text-foreground">
                  Terms of Service
                </Link>
              </li>
              {/* <li>
                <Link href="/cookies" className=" hover:text-foreground">
                  Cookie Policy
                </Link>
              </li> */}
            </ul>
          </div>

          {/* Contact */}
          <div className="mt-8">
            {/* <h4 className="font-semibold mb-4 text-orangeButton text-xl">
              Contact
            </h4> */}
            <div className="basis-2/3">
              <form
                onSubmit={handleSubscribe}
                className="flex gap-2 relative rounded-full items-center px-1 w-full h-full"
              >
                <Input
                  placeholder="Enter email address"
                  className="text-sm rounded-full h-13 min-w-72 px-4 py-0"
                  style={{ backgroundColor: "white" }}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <Button
                  size="sm"
                  type="submit"
                  className="absolute -right-11 rounded-full bg-orangeButton text-white h-auto py-3.5"
                >
                  Subscribe Now
                </Button>
              </form>
            </div>
            <div className="flex flex-col mt-5 gap-1 justify-between items-center text-lg text-white font-medium">
          <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <Link
              href={`${cms?.contact?.facebookUrl || "https://facebook.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/Facebook.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.twitterUrl || "https://twitter.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/twitter.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.linkedinUrl || "https://linkedin.com/company/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/Linkedin.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.youtubeUrl || "https://youtube.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/youtube.png" alt="" className="h-8" />
            </Link>
          </div>
          {/* <p className="text-right text-[16px]">&copy; {cms?.contact?.footerCopyRightMsg || "2025 Spark. All rights reserved."} </p> */}
        </div>
            {/* <ul className="space-y-2 text-lg text-white">
              <li>
                <Link href="/browse" className=" hover:text-foreground">
                  <span className="flex flex-col font-semibold">
                    Address{" "}
                    <span className="font-normal">
                     {cms?.contact?.address || "123 Business Ave San Fancisco, CA 94105"}
                    </span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/providers" className=" hover:text-foreground">
                  <span className="flex flex-col font-semibold">
                    Phone <span className="font-normal">{cms?.contact?.phone}</span>
                  </span>
                </Link>
              </li>
              <li>
                <Link href="/register" className=" hover:text-foreground">
                  <span className="flex flex-col font-semibold">
                    Email <span className="font-normal">{cms?.contact?.email || "hello@spark.com"}</span>
                  </span>
                </Link>
              </li>
            </ul> */}
          </div>
        </div>

        <Separator className="my-1  bg-gray-700" />

        <div className="flex flex-col gap-0 justify-between items-center text-xs text-white font-medium">
          {/* <div className="flex flex-wrap gap-6 mt-4 md:mt-0">
            <Link
              href={`${cms?.contact?.facebookUrl || "https://facebook.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/Facebook.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.twitterUrl || "https://twitter.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/twitter.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.linkedinUrl || "https://linkedin.com/company/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/Linkedin.png" alt="" className="h-8" />
            </Link>
            <Link
              
              href={`${cms?.contact?.youtubeUrl || "https://youtube.com/sparkplatform"}`}
              className="hover:text-foreground"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img src="/images/youtube.png" alt="" className="h-8" />
            </Link>
          </div> */}
          <p className="mb-2">&copy; {cms?.contact?.footerCopyRightMsg || "2025 Spark. All rights reserved."} </p>
        </div>
      </div>
    </footer>
  );
}
