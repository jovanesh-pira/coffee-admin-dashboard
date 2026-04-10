import  { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

type Tab = "Weekly" | "Monthly" | "5 Years" ;

const TABS: Tab[] = ["Weekly", "Monthly", "5 Years"];

const dataWeekly = [
  { date: "03-12", sales: 32000, revenue: 33500 },
  { date: "04-12", sales: 23000, revenue: 21000 },
  { date: "05-12", sales: 29500, revenue: 20500 },
  { date: "06-12", sales: 32500, revenue: 27500 },
  { date: "07-12", sales: 23500, revenue: 22000 },
  { date: "08-12", sales: 22500, revenue: 21000 },
  { date: "09-12", sales: 23500, revenue: 25500 },
];

function formatMoneyUSD(value: number) {
  return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function formatK(value: number) {
  if (value === 0) return "0";
  return `$${Math.round(value / 1000)}K`;
}

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: any[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  const sales = payload.find((p) => p.dataKey === "sales")?.value ?? 0;
  const revenue = payload.find((p) => p.dataKey === "revenue")?.value ?? 0;

  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-3 shadow-sm">
      <div className="text-sm font-semibold text-neutral-900">{label}</div>

      <div className="mt-2 space-y-1 text-sm text-neutral-700">
        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#F2D48B]" />
            <span>Sales</span>
          </div>
          <span className="font-medium text-neutral-900">
            {Math.round(sales / 1000)}K
          </span>
        </div>

        <div className="flex items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#8B6B52]" />
            <span>Revenue</span>
          </div>
          <span className="font-medium text-neutral-900">
            {Math.round(revenue / 1000)}K
          </span>
        </div>
      </div>
    </div>
  );
}

export default function SalesWidget() {
  const [tab, setTab] = useState<Tab>("Weekly");
  const [week, setWeek] = useState("Week 1");

  // فعلاً فقط weekly گذاشتیم، بعداً می‌تونی با tab دیتا عوض کنی
  const chartData = useMemo(() => {
    return dataWeekly;
  }, [tab, week]);

  const totalThisWeek = useMemo(() => {
    // جمع revenue یا sales؟ در تصویر عدد کلی هست؛ اینجا revenue رو جمع می‌کنیم
    const sum = chartData.reduce((acc, cur) => acc + cur.revenue, 0);
    return sum;
  }, [chartData]);

  return (
    <div className="w-full max-w-5xl">
      {/* Top Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between pt-10">
        {/* Left: Title + Amount */}
        <div>
          <div className="text-xl mb-10 text-neutral-500">Sales This Week</div>
          <div className="mt-1 text-3xl font-semibold text-neutral-900">
            {formatMoneyUSD(totalThisWeek)}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center gap-6 text-sm">
            <div className="flex items-center gap-2 text-neutral-700">
              <span className="h-3 w-3 rounded-full bg-[#F2D48B]" />
              <span>Sales</span>
            </div>
            <div className="flex items-center gap-2 text-neutral-700">
              <span className="h-3 w-3 rounded-full bg-[#8B6B52]" />
              <span>Revenue</span>
            </div>
          </div>
        </div>

        {/* Right: Tabs + Dropdown */}
        <div className="flex flex-col items-start gap-3 md:items-end">
          {/* Tabs */}
          <div className="inline-flex overflow-hidden rounded-md border border-[#B08A6A]">
            {TABS.map((t) => {
              const active = t === tab;
              return (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={[
                    "px-4 py-2 text-sm transition",
                    active
                      ? "bg-[#8B6B52] text-white"
                      : "bg-white text-[#8B6B52] hover:bg-[#F6EFE8]",
                    "border-r border-[#B08A6A] last:border-r-0",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>

          {/* Dropdown */}
          <select
            value={week}
            onChange={(e) => setWeek(e.target.value)}
            className="w-44 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-800 shadow-sm outline-none focus:border-[#8B6B52] focus:ring-2 focus:ring-[#8B6B52]/20"
          >
            <option>Week 1</option>
            <option>Week 2</option>
            <option>Week 3</option>
            <option>Week 4</option>
          </select>
        </div>
      </div>

      {/* Chart Card */}
      <div className="mt-6 rounded-xl border border-neutral-200 bg-white p-4">
        <div className="h-70 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barCategoryGap={20}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tickFormatter={formatK}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="sales" fill="#F2D48B" radius={[6, 6, 0, 0]} />
              <Bar dataKey="revenue" fill="#8B6B52" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Selling Products */}
      <div className="mt-8 rounded-xl border border-[#D9C2AE] bg-[#FBF6EF] p-5">
        <div className="text-lg font-semibold text-neutral-900">
          Top Selling Products
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { name: "Latte", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80" },
            { name: "Mocha", img: "https://images.unsplash.com/photo-1512568400610-62da28bc8a13?w=600&q=80" },
            { name: "Espresso", img: "https://images.unsplash.com/photo-1511920170033-f8396924c348?w=600&q=80" },
            { name: "Croissant", img: "https://images.unsplash.com/photo-1549903072-7d2d34d48f9a?w=600&q=80" },
          ].map((p) => (
            <div
              key={p.name}
              className="overflow-hidden rounded-xl border border-neutral-200 bg-white"
            >
              <div className="aspect-4/3 bg-neutral-100">
                <img
                  src={p.img}
                  alt={p.name}
                  className="h-full w-full object-cover"
                  loading="lazy"
                />
              </div>
              <div className="p-3">
                <div className="text-sm font-semibold text-neutral-900">
                  {p.name}
                </div>
                <div className="mt-1 text-xs text-neutral-500">
                  View details
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}