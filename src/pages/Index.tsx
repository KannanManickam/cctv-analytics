
import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CountCard from "@/components/CountCard";
import DemographicsChart from "@/components/DemographicsChart";
import LocationFilter from "@/components/LocationFilter";
import DateTimeFilter from "@/components/DateTimeFilter";
import { Camera, ChevronUp, AreaChart, UserSquare, Users } from "lucide-react";
import { trafficData, genderData, ageData } from "@/utils/mockData";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  AreaSeries,
  Area
} from "recharts";
import { cn } from "@/lib/utils";

// Format hourly data for the chart
const formatHourlyData = () => {
  return trafficData.hourlyData.map((item) => ({
    name: `${item.hour}:00`,
    In: item.in,
    Out: item.out,
    Total: item.in + item.out,
  }));
};

const Index = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [chartData, setChartData] = useState(formatHourlyData());
  
  // Gender chart data
  const genderChartData = [
    { name: "Male", value: genderData.male, color: "#3b82f6" },
    { name: "Female", value: genderData.female, color: "#ec4899" },
  ];
  
  // Age chart data
  const ageChartData = [
    { name: "0-17", value: ageData["0-17"], color: "#60a5fa" },
    { name: "18-24", value: ageData["18-24"], color: "#34d399" },
    { name: "25-34", value: ageData["25-34"], color: "#a78bfa" },
    { name: "35-44", value: ageData["35-44"], color: "#fbbf24" },
    { name: "45-54", value: ageData["45-54"], color: "#f87171" },
    { name: "55+", value: ageData["55+"], color: "#6b7280" }
  ];

  // Calculate daily change percentage
  const calculateChange = (type: "in" | "out") => {
    const today = trafficData.today[type];
    const yesterday = trafficData.yesterday[type];
    const change = ((today - yesterday) / yesterday) * 100;
    return change;
  };

  // Listen for scroll events
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="fancy-blur rounded-lg p-3 text-sm border border-gray-200 dark:border-gray-800 shadow-lg">
          <p className="font-medium">{label}</p>
          <div className="mt-1 space-y-1">
            {payload.map((entry: any, index: number) => (
              <div key={`item-${index}`} className="flex items-center gap-2">
                <div
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: entry.color }}
                />
                <span className="text-xs text-muted-foreground">{entry.name}:</span>
                <span className="font-medium">{entry.value.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1 px-4 md:px-6 pb-8">
        <div className="py-6 space-y-8 animate-fade-in">
          {/* Filters section */}
          <div className={cn(
            "sticky top-16 pt-4 pb-3 z-20 bg-background/80 backdrop-blur-sm transition-all duration-200",
            isScrolled && "shadow-sm border-b border-gray-100 dark:border-gray-800/50"
          )}>
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <LocationFilter />
              <DateTimeFilter />
            </div>
          </div>

          {/* Stats cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <CountCard 
              title="Total In" 
              value={trafficData.today.in} 
              change={calculateChange("in")} 
              type="in"
              icon="in"
            />
            <CountCard 
              title="Total Out" 
              value={trafficData.today.out} 
              change={calculateChange("out")} 
              type="out"
              icon="out"
            />
            <CountCard 
              title="Total Visitors" 
              value={trafficData.today.in + trafficData.today.out} 
              change={(calculateChange("in") + calculateChange("out")) / 2} 
              type="total"
              icon="total"
            />
          </div>

          {/* Traffic flow chart */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center">
              <AreaChart className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Traffic Flow</h2>
            </div>
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden border border-gray-100 dark:border-gray-800/50 shadow-md">
              <CardContent className="p-1 sm:p-3 md:p-6">
                <div className="h-[300px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={chartData}
                      margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="colorIn" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis 
                        tickLine={false} 
                        axisLine={false} 
                        tick={{ fontSize: 12 }}
                        width={40}
                      />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="In"
                        stroke="#34d399"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorIn)"
                        activeDot={{ r: 6 }}
                      />
                      <Area
                        type="monotone"
                        dataKey="Out"
                        stroke="#3b82f6"
                        strokeWidth={2}
                        fillOpacity={1}
                        fill="url(#colorOut)"
                        activeDot={{ r: 6 }}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Demographics charts */}
          <div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.3s" }}>
            <div className="flex items-center">
              <Users className="h-5 w-5 mr-2 text-primary" />
              <h2 className="text-lg font-semibold tracking-tight">Demographics</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <DemographicsChart 
                title="Gender Distribution" 
                data={genderChartData} 
                type="gender"
              />
              <DemographicsChart 
                title="Age Distribution" 
                data={ageChartData} 
                type="age"
              />
            </div>
          </div>

          {/* Back to top button */}
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className={cn(
              "fixed bottom-6 right-6 p-3 rounded-full bg-primary shadow-lg text-white transform transition-all duration-300",
              isScrolled ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10 pointer-events-none"
            )}
          >
            <ChevronUp className="h-5 w-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
