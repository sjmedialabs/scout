"use client";
import React, { useState,useEffect, useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { headers } from "next/headers";
import { HomeHero } from "@/app/home-hero";
import {
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
  ChevronLeft, ChevronRight,
  Star,
  CheckCircle2,
} from "lucide-react";
import { authFetch } from "@/lib/auth-fetch";
import { useRouter } from "next/navigation";
import RatingStars from "@/components/rating -star-servicesPage";

interface ServiceChild {
  _id: string;
  title: string;
  slug?: string;
}

export interface ServiceCategory {
  _id: string;
  title: string;
  slug?: string;
  icon: string | null;
  color: string;
  order: number;
  children: ServiceChild[];
}

// Icon mapping
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code,
  Palette,
  TrendingUp,
  Megaphone,
  Briefcase,
  Shield,
};

// Color mapping
const colorMap: Record<string, { bg: string; hover: string; text: string }> = {
  green: {
    bg: "from-green-100 to-green-200",
    hover: "hover:border-green-200",
    text: "text-green-600",
  },
  purple: {
    bg: "from-purple-100 to-purple-200",
    hover: "hover:border-purple-200",
    text: "text-purple-600",
  },
  blue: {
    bg: "from-blue-100 to-blue-200",
    hover: "hover:border-blue-200",
    text: "text-blue-600",
  },
  orange: {
    bg: "from-orange-100 to-orange-200",
    hover: "hover:border-orange-200",
    text: "text-orange-600",
  },
  teal: {
    bg: "from-teal-100 to-teal-200",
    hover: "hover:border-teal-200",
    text: "text-teal-600",
  },
  indigo: {
    bg: "from-indigo-100 to-indigo-200",
    hover: "hover:border-indigo-200",
    text: "text-indigo-600",
  },
};



export default function HomePage() {
  const router=useRouter();
const [data, setData] = useState({
  cms: null,
  providers: [],
  projects: [],
  categories: [],
  blogs: [],
});

const [resLoading, setResLoading] = useState(false);

const scrollRef = useRef<HTMLDivElement>(null);

const scroll = (direction: "left" | "right") => {
  if (!scrollRef.current) return;

  const card = scrollRef.current.children[0] as HTMLElement;

  scrollRef.current.scrollBy({
    left: direction === "right"
      ? card.offsetWidth + 24
      : -(card.offsetWidth + 24),
    behavior: "smooth",
  });
};

const [currentIndex, setCurrentIndex] = useState(0);
const { cms, providers, projects, categories, blogs } = data;


const items = cms?.homeWorkSection || [];
const showArrows = (items?.length || 0) > 4;

const handlePrev = () => {
  setCurrentIndex((prev) => (prev === 0 ? items.length - 1 : prev - 1));
};

const handleNext = () => {
  setCurrentIndex((prev) => (prev === items.length - 1 ? 0 : prev + 1));
};

async function getData() {
  let baseUrl = process.env.NEXT_PUBLIC_APP_URL || "";

  const REVALIDATE_TIME = Number(process.env.CMS_REVALIDATE_TIME) || 10;
  const options = { next: { revalidate: REVALIDATE_TIME } };

  try {
    setResLoading(true);

    const [cmsRes, providersRes, projectsRes, categoriesRes] =
      await Promise.all([
        fetch(`/api/cms`, options),
        fetch(`/api/providers`, options),
        fetch(`/api/requirements`, options),
        fetch(`/api/service-categories`, options),
      ]);

    const cms = cmsRes.ok ? (await cmsRes.json()).data : null;

    const blogs = cms?.blogs?.slice(0, 4) || [];

    const providers = providersRes.ok
      ? (await providersRes.json()).providers?.slice(0, 4)
      : [];

    const projectsData = projectsRes.ok ? await projectsRes.json() : {};
    const projects = (projectsData.requirements || projectsData.data || [])
      .filter((eachItem: any) => eachItem.status.toLowerCase() === "open")
      .slice(0, 4);

    const categories = categoriesRes.ok
      ? (await categoriesRes.json()).data
      : [];
    
    console.log("Fetchjed Categories from api::::::", categories)

    return { cms, providers, projects, categories, blogs };
  } catch (error) {
    console.error("[HomePage] Data Fetch Error:", error);
    return { cms: null, providers: [], projects: [], categories: [] };
  } finally {
    setResLoading(false);
  }
}

useEffect(() => {
  async function fetchData() {
    const res = await getData();
    setData(res);
  }

  fetchData();
}, []);

if (resLoading) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <HomeHero cms={cms} />

      {/* Features */}
      <section className="py-6 px-6 md:px-10 bg-gradient-to-r">
        <div className="max-w-7xl mx-auto">

          <h2 className="text-4xl font-bold text-center mb-6">
            How Scout Works
          </h2>

          {/* MOBILE SLIDER */}
          <div className="relative md:hidden">
            
            {/* Card */}
            {items.length > 0 && (
              <div className="bg-[#0F2A2F] text-white rounded-3xl px-6 py-4 min-h-[420px]">
                
                <p className="text-green-400 text-sm font-semibold mb-2">
                  {items[currentIndex]?.tag || "Step"}
                </p>

                <h3 className="text-2xl font-bold mb-3">
                  {items[currentIndex]?.title}
                </h3>

                <p className="text-gray-300 text-sm">
                  {items[currentIndex]?.description}
                </p>

                <img
                  src={items[currentIndex]?.image}
                  className="mt-6 rounded-xl w-full"
                />
              </div>
            )}

            {/* Arrows */}
            {showArrows && (
              <>
                <button
                  onClick={handlePrev}
                  className="absolute -left-5 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
                >
                  <ChevronLeft />
                </button>

                <button
                  onClick={handleNext}
                  className="absolute -right-5 top-1/2 -translate-y-1/2 bg-white p-2 rounded-full shadow z-10"
                >
                  <ChevronRight />
                </button>
              </>
            )}
          </div>

          {/* DESKTOP GRID */}
          <div className="hidden md:block relative overflow-visible">

        {/* Grid Container */}
        <div className="grid grid-cols-4 gap-6">
          {items.map((section: any, index: number) => (
            <div
              key={index}
            >
              <div className="bg-[#0F2A2F] text-white rounded-3xl px-3 py-3 h-[420px] flex flex-col">
                <div>
                <p className="text-green-400 text-sm font-semibold mb-2">
                  {section?.tag || "Step"}
                </p>

                <h3 className="text-xl font-bold mb-2">
                  {section.title}
                </h3>

                <p className="text-gray-300 text-sm mb-4 line-clamp-3">
                  {section.description}
                </p>
                </div>

                <img
                  src={section.image}
                  className=" rounded-xl w-full mb-2 h-[250px]  mt-auto "
                />
              </div>
            </div>
          ))}
        </div>

      </div>

        </div>
      </section>

      {/* Service Categories - CMS Driven */}
      <section
        className="py-4 px-6 md:px-10"
        style={{
          backgroundImage: "url('/images/category-background.png')",
        }}
      >
        <div className="max-w-7xl mx-auto flex justify-center flex-col">
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] font-extrabold px-4 py-1 rounded-full mb-2">
              <span className="text-sm font-medium text-[#fff] capitalize">
                Service Categories
              </span>
            </div>
            <h2 className="text-md uppercase font-bold text-blueButton ">
             {cms?.homeServiceTitle}
              {/* <span className="text-blueButton font-bold ">
                any project
              </span> */}
            </h2>
            <p className="text-sm text-gray-500 max-w-lg mx-auto leading-relaxed">
             {cms?.homeServiceSubTitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {(categories && categories.length > 0 ? categories.slice(0,6) : []).map(
              (category: any) => {
                const colors = colorMap[category.color] || colorMap.blue;
                const serviceLink = `/services/${category._id}`;

                return (
                  <div
                    key={category._id}
                    
                    className={`group bg-white/70 h-[260px] backdrop-blur-sm rounded-4xl px-6 py-4 border lg:pl-8 ${colors.hover} hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col`}
                  >
                    {/* Top Content */}
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <img
                          src={category?.icon || "/images/icon-1.png"}
                          alt=""
                          className="h-10 rounded-full"
                        />
                        <h3
                          className={`text-xl font-bold text-blueButton group-hover:${colors.text} transition-colors`}
                        >
                          {category.title}
                        </h3>
                      </div>

                      {/* Subcategories */}
                      <div className="space-y-3">
                        {(category.children.slice(0, 4) || []).map(
                          (sub: any, index: number) => (
                            <p
                              key={index}
                              className={`block text-slate-500 text-md hover:${colors.text} hover:translate-x-2 transition-all duration-200 font-medium`}
                            >
                              → {sub.title}
                            </p>
                          )
                        )}
                      </div>
                    </div>

                    {/* Button pushed to bottom */}
                    <div className="mt-4">
                      <Button
                        size="sm"
                        className=" bg-blueButton cursor-pointer text-sm  text-white rounded-full"
                        onClick={() =>
                      router.push(`/services?category=${category._id}`)
                    }
                      >
                        {`Explore  →`}
                      </Button>
                    </div>
                  </div>
                );
              }
            )}
          </div>
          <div className="flex justify-center items-center">
            <Link href="/services">
              <Button
                size="lg"
                className="
                  rounded-full
                  text-sm sm:text-lg
                  px-5 sm:px-8
                  py-2 sm:py-3
                  font-bold
                  bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]
                "
              >
                Browse All Services →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Public Requirements - From API */}
      {projects.length > 0 && (
        <section className="py-6 px-6 md:px-10">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] font-extrabold px-4 py-1 rounded-full  mb-2">
                <span className="text-sm font-medium text-white capitalize">
                  Newly added
                </span>
              </div>
              <h2 className="text-md uppercase font-bold text-blueButton ">
                {cms?.recentRequirementTitle || "Requirements"}
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {cms?.recentRequirementSubTitle || "Discover opportunities from businesses lookking for your services"}
              </p>
            </div>
            {/* <div className="grid md:grid-cols-3 gap-6">
              {projects.map((project: any) => (
                <div key={project._id} className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300">
                  <div className="">
                    <div className="text-lg"><img src={project.image} alt="" className="rounded-t-3xl" /></div>
                    <div className="flex items-center justify-between mb-2 px-8 mt-4">
                      <Badge variant="outline" className="rounded-full px-2 bg-gray-100 font-semibold text-[10px]">{project.category}</Badge>
                      <span className="text-sm text-muted-foreground text-orangeButton font-semibold">{project.timeline}</span>
                    </div>
                    <h3 className="text-lg px-8 capitalize">{project.title}</h3>
                  </div>
                  <div className="pb-10 px-8">
                    <p className="text-sm text-gray-500 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-col gap-4">
                      <span className="font-bold text-lg text-blueButton">{project.budget}</span>
                     
                    </div>
                  </div>
                   <div className="pb-10 px-6">
                        <Button variant="outline" size="sm" asChild className="bg-blueButton text-white rounded-full text-xs">
                          <Link href="/login?to=project-enquiries">Submit Proposal →</Link>
                        </Button>
                      </div>
                </div>
              ))}
            </div> */}

            <div className="grid md:grid-cols-4 gap-3">
              {projects.map((project: any) => (
                <div
                  key={project._id}
                  className="rounded-3xl border border-slate-200 items-center bg-white hover:shadow-lg transition-shadow
                   flex flex-col h-full"
                >
                  {/* Image */}
                  <img
                    src={project.image || "/requirements.jpg"}
                    alt={project.title}
                    className="w-full h-[150px] object-cover border-b rounded-t-3xl"
                  />

                  {/* Category + Timeline */}
                 
                    <Badge
                      variant="outline"
                      className="rounded-full mt-3 mb-2 bg-gray-100 text-xs font-semibold py-1"
                    >
                      {project.category}
                    </Badge>
                    <p className="text-sm font-semibold text-blueButton">
                      Timeline - <span className="text-red-500">{project.timeline}</span>
                    </p>
                

                  {/* Title */}
                  <h3 className="px-6 mt-1 text-md font-semibold capitalize">
                    {project.title}
                  </h3>

                  {/* Description */}
                  {/* <div className="px-6 mt-1">
                    <p className="text-sm text-gray-500 line-clamp-2">
                      {project.description}
                    </p>
                  </div> */}

                  {/* Budget */}
                  <div className="mt-auto">
                    <div className="mt-0 text-center">
                      <span className="text-sm font-bold text-green-700">
                        ₹{project.budgetMin.toLocaleString()} - ₹
                        {project.budgetMax.toLocaleString()}
                      </span>
                    </div>

                    {/* Button */}
                    <div className="px-6 pb-3 mt-1">
                      <Link href={`/login?to=requirement-details&id=${project._id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          className="primary-button !text-xs w-[100px] h-[30px]"
                        >
                          View Details →
                        </Button>
                      </Link>

                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center items-center">
              <Link href="/browse">
                <Button
                  className="rounded-full
                    mt-8
                    text-sm sm:text-lg
                    px-5 sm:px-8
                    py-2 sm:py-3
                    font-bold
                    bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]
                  "
                  size={"lg"}
                >
                  Browse All Requirements →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Top Providers - From API */}
      {providers.length > 0 && (
        <section className="py-6 px-6 md:px-10 bg-blueBackground">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] font-extrabold px-4 py-1 rounded-full  mb-2">
                <span className="text-sm font-medium text-white capitalize">
                  Top Agencies
                </span>
              </div>
              <h2 className="text-md uppercase font-bold text-blueButton ">
                {cms?.topProvidersTitle}
              </h2>
              <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                {cms?.topProvidersSubTitle || "Discover opportunities from businesses lookking for your services"}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-3">
              {[...providers]
                .sort((a, b) => (b.rating || 0) - (a.rating || 0))
                .map((provider: any) => (
                <div
                  key={provider._id}
                  className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300 bg-white
                 flex flex-col h-full"
                >
                  <div className="">
                    <div className="w-full h-[160px] sm:h-[150px] overflow-hidden rounded-t-3xl">
                      <img
                        // src={provider.coverImage || "/requirements.jpg"}
                        src={`${provider.coverImage || "/requirements.jpg"}?v=${provider.updatedAt || Date.now()}`}
                        alt=""
                        className="rounded-t-3xl w-full h-full object-cover object-center"
                      />
                    </div>
                    <div className="py-3">
                    {/* Verified + Rating */}
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between -mt-1 px-2">

                          {/* LEFT — Verified */}
                          <div className="flex flex-wrap gap-1">
                            {provider?.isVerified && (
                              <Badge className="bg-green-100 text-green-700 rounded-full text-xs">
                                <CheckCircle2 className="h-3 w-3 mr-1" />
                                Verified
                              </Badge>
                            )}

                            {provider?.isFeatured && (
                              <Badge className="bg-blue-100 text-blue-700 rounded-full text-xs">
                                <Star className="h-3 w-3 mr-1 fill-blue-100" />
                                Featured
                              </Badge>
                            )}
                          </div>

                          {/* RIGHT — Rating */}
                          <div className="flex items-center gap-1.5 mt-1 lg:mt-0">
                            <div className="flex items-center gap-0.5">
                              <RatingStars rating={provider.rating} />
                            </div>

                            <span className="text-xs font-semibold text-[#0E0E0E]">
                              {provider.rating.toFixed(1)}
                            </span>
                          </div>

                        </div>
                    </div>

                    <h3 className="text-base text-base sm:text-lg px-4 sm:px-6 lg:px-4 font-bold capitalize">
                      {provider.name}
                    </h3>
                  </div>
                  <div className=" px-4 sm:px-6 lg:px-4 flex flex-col flex-1">
                    <p className="text-sm text-gray-500 leading-8 -mt-1 mb-0 line-clamp-1">
                        {provider.description}
                      </p>
                    <div className="flex flex-col h-full gap-4">
                      {/* SERVICES BADGES */}
                      <div className="flex gap-2 pt-2">
                        {provider.services?.length > 0 ? (
                          provider.services
                            .slice(0, 2)
                            .map((service: string, idx: number) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-800 px-2 py-1 rounded-full text-xs font-semibold"
                              >
                                {service}
                              </span>
                            ))
                        ) : (
                          <span className="text-sm text-gray-400 italic">
                            No services listed
                          </span>
                        )}
                      </div>

                      {/* VIEW DETAILS BUTTON */}
                      <div className="mt-auto pb-3">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="primary-button !text-xs w-[100px] h-[30px]"
                        >
                          <Link
                            href={`/provider/${provider.id || provider._id}`}
                          >
                            View Profile →
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="text-center mt-0">
              <Button
                variant="outline"
                className="rounded-full
                    mt-6
                    text-sm sm:text-lg
                    px-5 sm:px-8
                    py-2 sm:py-3
                    font-bold
                    bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]
                    text-white
                  "
                size={"lg"}
                asChild
              >
                <Link href="/services">View all providers →</Link>
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Blogs Section */}
      {(cms?.blogTitle || cms?.blogSubTitle || blogs.length > 0) && (
        <section className="py-6 px-6 md:px-10 border-b">
          <div className="max-w-7xl mx-auto">
            {/* Heading */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#F54A0C] to-[#2C34A1] font-extrabold px-4 py-1 rounded-full mb-2">
                <span className="text-sm font-medium text-white capitalize">
                  Latest Insights
                </span>
              </div>
              <h2 className="text-md uppercase font-bold text-blueButton">
                {cms?.blogSection?.title ?? "Latest Blogs"}
              </h2>
              <p className="text-sm text-gray-500 max-w-md mx-auto leading-relaxed">
                {cms?.blogSection?.subTitle ?? "Stay updated with insights"}
              </p>
            </div>

            {/* Grid */}
            <div className="grid md:grid-cols-4 gap-3">
              {blogs.map((blog: any) => (
                  <div className="hover:shadow-lg transition-shadow rounded-3xl border border-slate-300 bg-white flex flex-col h-full">
                    
                    {/* Image */}
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="w-full h-[150px] object-cover rounded-t-3xl"
                    />

                    {/* Content */}
                    <div className="py-3 px-4 sm:px-6 lg:px-4 flex flex-col flex-1">
                      {/* Title */}
                      <h3 className="text-base sm:text-[15px] font-semibold line-clamp-2 min-h-12">
                        {blog.title}
                      </h3>

                      <p className="text-xs text-black font-bold mt-1">
                       Posted Date: <span className="text-gray-500"> {new Date(blog.postedDate).toLocaleDateString("en-GB")} </span>
                      </p>

                      <div
                        className="text-sm text-gray-600 line-clamp-2 mt-1"
                        dangerouslySetInnerHTML={{ __html: blog.description }}
                      />

                      {/* Button */}
                      <div className="mt-auto pt-2">
                        <Button
                          size="sm"
                          className="primary-button !text-xs w-[110px] h-[30px]"
                        >
                        <Link href={`/blogs/${blog._id}`} key={blog._id}>
                          Read More →
                        </Link>
                        </Button>
                      </div>
                    </div>
                  </div>
              ))}
            </div>

            {/* View All */}
            <div className="flex justify-center items-center">
              <Link href="/blogs">
                <Button
                  size="lg"
                  className="rounded-full mt-8 text-sm sm:text-lg px-5 sm:px-8 py-2 sm:py-3 font-bold bg-gradient-to-r from-[#F54A0C] to-[#2C34A1]"
                >
                  View All Blogs →
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-4 px-6 md:px-10">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-2xl md:text-4xl font-extralight">
            {cms?.getStartedTitle || "Ready to Get Started?"}
          </h3>
          <p className="text-base max-w-sm mx-auto text-slate-500">
            {cms?.getStartedSubtitle || "Join thousands of businesses finding the right service providers on Scout."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mt-2">
            <Button
              size="lg"
              className="primary-button  h-[40px]"
              asChild
            >
              <Link className="!text-sm" href="/register?type=seeker">Post Requirement</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="btn-blackButton  h-[40px]"
              asChild
            >
              <Link className="!text-sm" href="/register?type=provider">Find Projects</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
