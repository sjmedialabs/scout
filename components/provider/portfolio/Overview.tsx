"use client";

import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import { useState,useEffect,useRef } from "react";

export default function Overview({ provider }: any) {

  const [showAllServices, setShowAllServices] = useState(false);
  const[showAllTechnologies,setShowAllTechnologies]= useState(false);

  const servicesRef = useRef<HTMLDivElement | null>(null);
const [isOverflowing, setIsOverflowing] = useState(false);

useEffect(() => {
  if (servicesRef.current) {
    const el = servicesRef.current;

    setIsOverflowing(
      el.scrollHeight > el.clientHeight
    );
  }
}, [provider?.services]);

const technologiesRef = useRef<HTMLDivElement | null>(null);
const [isTechOverflowing, setIsTechOverflowing] = useState(false);

useEffect(() => {
  if (technologiesRef.current) {
    const el = technologiesRef.current;

    setIsTechOverflowing(
      el.scrollHeight > el.clientHeight
    );
  }
}, [provider?.technologies]);

  // ================= MANUAL TOP SERVICES =================

  const topServices =
    (provider?.topServicesManual || [])
      .slice(0, 5)
      .map((item: any) => ({
        name: item.service,
        value: Number(item.percentage),
        percent: item.percentage,
      }));

  // ================= MANUAL CLIENTS =================

  const clients =
    (provider?.clients || [])
      .slice(0, 5)
      .map((item: any) => ({
        name: item.client,
        value: Number(item.percentage),
        percent: item.percentage,
      }));

  const hasServiceData =
    topServices.length > 0;

  const hasClientData =
    clients.length > 0;

  const hasAnyChartData =
    hasServiceData || hasClientData;

  return (

    <section className="px-6 sm:px-6 lg:px-0 py-12 max-w-7xl mx-auto bg-white">

      <h2 className="text-lg font-bold text-orangeButton mb-2">
        AGENCY PROFILE
      </h2>

      <div className="grid lg:grid-cols-2 gap-6 items-stretch">

        {/* LEFT */}
        <div className="border rounded-xl p-6 bg-white h-full flex flex-col">

          <h3 className="font-semibold mb-4 text-sm">
            COMPANY DETAILS
          </h3>

          <Row label="Founded" value={provider?.foundedYear || "N/A"} />
          <Row label="HQ" value={provider?.location || "N/A"} />
          <Row label="Team size" value={`${provider?.teamSize || "N/A"}`} />

          <Row
            label="Hourly rate"
            value={
              provider?.hourlyRate
                ? `₹${provider.hourlyRate}`
                : "N/A"
            }
          />

          <Row
            label="Min. project"
            value={
              provider?.minProjectSize
                ? `₹${provider.minProjectSize}`
                : "N/A"
            }
          />

        </div>

        {/* RIGHT */}
        <div className="border rounded-xl p-6 bg-white h-full flex flex-col justify-between">

          <div>

            <h3 className="font-semibold mb-2 text-sm">
              SERVICES
            </h3>

            {provider?.services?.length === 0 ? (
              <div className="text-center text-gray-500">
                No services data available for this agency.
              </div>
            ) : (

              <div>

                <div
                ref={servicesRef}
                  className={`flex flex-wrap gap-3 ${
                    showAllServices
                      ? ""
                      : "max-h-[70px] overflow-hidden"
                  }`}
                >

                  {(provider?.services || []).map(
                    (s: string, i: number) => (

                      <span
                        key={i}
                        className="bg-blue-300/20 text-blue-700 px-3 py-1 rounded-full text-xs"
                      >
                        {s}
                      </span>

                    )
                  )}

                </div>

                {isOverflowing && (

                  <div className="text-right">

                    <button
                      onClick={() =>
                        setShowAllServices(!showAllServices)
                      }
                      className="text-xs font-semibold text-black underline"
                    >
                      {showAllServices
                        ? "Show Less"
                        : "View More"}
                    </button>

                  </div>

                )}

              </div>

            )}

            {provider?.focusArea && (

              <div className="mt-3">

                <h3 className="font-semibold mb-0 text-sm">
                  FOCUS AREAS
                </h3>

                <p className="text-sm text-gray-600">
                  {provider?.focusArea}
                </p>

              </div>

            )}

            {/* ===================Technologies==================== */}
            {provider?.technologies && provider?.technologies.length > 0 && (
              <div className="mt-3">
                <h3 className="font-semibold mb-2 text-sm">
                    TECHNOLOGIES
                </h3>
                <div>

                <div
                ref={technologiesRef}
                  className={`flex flex-wrap gap-3 ${
                    showAllTechnologies
                      ? ""
                      : "max-h-[70px] overflow-hidden"
                  }`}
                >

                  {(provider?.technologies || []).map(
                    (t: string, i: number) => (

                      <span
                        key={i}
                        className="bg-blue-300/20 text-blue-700 px-3 py-1 rounded-full text-xs"
                      >
                        {t}
                      </span>

                    )
                  )}

                </div>

                {isTechOverflowing  && (

                  <div className="text-right">

                    <button
                      onClick={() =>
                        setShowAllTechnologies(!showAllTechnologies)
                      }
                      className="text-xs font-semibold text-black underline"
                    >
                      {showAllTechnologies
                        ? "Show Less"
                        : "View More"}
                    </button>

                  </div>

                )}

              </div>

              </div>
            )}

          </div>

        </div>

      </div>

      {/* ================= CHARTS ================= */}

      {hasAnyChartData && (

        <div className="grid lg:grid-cols-2 gap-6 mt-6">

          {/* TOP SERVICES */}

          {hasServiceData && (

            <ChartCard
              title="Service focus breakdown"
              subtitle="% of team capacity allocated"
              data={topServices}
              colors={[
                "#14532D",
                "#15803D",
                "#34D399",
                "#6EE7B7",
                "#A7F3D0",
              ]}
            />

          )}

          {/* CLIENTS */}

          {hasClientData && (

            <ChartCard
              title="Client type distribution"
              subtitle="By company stage"
              data={clients}
              colors={[
                "#1E3A8A",
                "#2563EB",
                "#60A5FA",
                "#93C5FD",
                "#BFDBFE",
              ]}
            />

          )}

        </div>

      )}

    </section>

  );
}

function Row({ label, value }: any) {

  return (

    <div className="flex justify-between border-b py-2 text-sm">

      <span className="text-gray-500">{label}</span>

      <span className="font-medium">
        {value || "-"}
      </span>

    </div>

  );
}

function ChartCard({
  title,
  subtitle,
  data,
  colors,
}: any) {

  return (

    <div className="border rounded-xl p-6 bg-white">

      <h3 className="font-semibold mb-1 text-sm">
        {title}
      </h3>

      <p className="text-xs text-gray-500 mb-4">
        {subtitle}
      </p>

      <div className="flex flex-col lg:flex-row items-center gap-6">

        <DonutChart
          data={data}
          colors={colors}
        />

        <div className="text-sm space-y-2">

          {data.map((item: any, i: number) => (

            <LegendItem
              key={i}
              label={item.name}
              value={`${item.percent}%`}
              color={colors[i]}
            />

          ))}

        </div>

      </div>

    </div>

  );
}

function DonutChart({ data, colors }: any) {

  const [activeIndex, setActiveIndex] =
    useState<number | null>(null);

  return (

    <div className="w-[220px] h-[220px] mx-auto">

      <ResponsiveContainer width="100%" height="100%">

        <PieChart>

          <Tooltip
            formatter={(value, name) => [
              `${value}%`,
              name,
            ]}
          />

          <Pie
            data={data}
            dataKey="value"
            innerRadius={70}
            outerRadius={95}
            paddingAngle={2}
            onMouseEnter={(_, index) =>
              setActiveIndex(index)
            }
            onMouseLeave={() =>
              setActiveIndex(null)
            }
          >

            {data.map(
              (_: any, index: number) => (

                <Cell
                  key={index}
                  fill={colors[index]}
                  style={{
                    transform:
                      activeIndex === index
                        ? "scale(1.08)"
                        : "scale(1)",
                    transformOrigin: "center",
                    transition: "0.2s",
                    cursor: "pointer",
                  }}
                />

              )
            )}

          </Pie>

        </PieChart>

      </ResponsiveContainer>

    </div>

  );
}

function LegendItem({ label, value, color }: any) {

  return (

    <div className="flex items-center gap-2">

      <span
        className="w-2 h-2 rounded-full"
        style={{ backgroundColor: color }}
      />

      <span className="text-gray-700">
        {label} — {value}
      </span>

    </div>

  );
}