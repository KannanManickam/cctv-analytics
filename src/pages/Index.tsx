import React, { useState, useEffect } from "react";
import Header from "@/components/Header";
import CountCard from "@/components/CountCard";
import DemographicsChart from "@/components/DemographicsChart";
import LocationFilter from "@/components/LocationFilter";
import DateTimeFilter from "@/components/DateTimeFilter";
import { Camera, ChevronUp, AreaChart as AreaChartIcon, UserSquare, Users } from "lucide-react";
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
	AreaChart,
	Area
} from "recharts";
import { cn } from "@/lib/utils";

// Format hourly data for the chart
const formatHourlyData = (dateRange = { preset: "today" }) => {
	// In a real app, we would filter by date range here
	// For demo purposes, we'll just return the full dataset
	return trafficData.hourlyData.map((item) => ({
		name: `${item.hour}:00`,
		In: item.in,
		Out: item.out,
		Total: item.in + item.out,
	}));
};

// Mock function to get filtered traffic data based on location and date range
const getFilteredTrafficData = (location, locationType, dateRange) => {
	let multiplier = 1;

	// Apply location-based filtering
	if (locationType === 'store') {
		// Each store has a different traffic pattern
		if (location === 'Store 001') multiplier = 1;
		else if (location === 'Store 002') multiplier = 0.8;
		else if (location === 'Store 003') multiplier = 1.2;
		else multiplier = 0.9;
	} else if (locationType === 'city') {
		// Cities have their own patterns
		if (location === 'New York') multiplier = 1.5;
		else if (location === 'Los Angeles') multiplier = 1.3;
		else if (location === 'Chicago') multiplier = 0.9;
		else multiplier = 1.1;
	} else if (locationType === 'region') {
		// Regions have broader patterns
		if (location === 'Northeast') multiplier = 1.4;
		else if (location === 'West') multiplier = 1.2;
		else if (location === 'Midwest') multiplier = 0.8;
		else multiplier = 1;
	}

	// Apply date-based filtering
	let dateMultiplier = 1;
	if (dateRange.preset === 'yesterday') dateMultiplier = 0.9;
	else if (dateRange.preset === '7days') dateMultiplier = 1.1;
	else if (dateRange.preset === '30days') dateMultiplier = 1.3;
	else if (dateRange.preset === '90days') dateMultiplier = 1.5;
	else if (dateRange.preset === 'ytd') dateMultiplier = 1.7;

	// Apply the multipliers to traffic data but maintain the full structure
	const finalMultiplier = multiplier * dateMultiplier;

	return {
		totalIn: Math.round(trafficData.totalIn * finalMultiplier),
		totalOut: Math.round(trafficData.totalOut * finalMultiplier),
		today: {
			in: Math.round(trafficData.today.in * finalMultiplier),
			out: Math.round(trafficData.today.out * finalMultiplier)
		},
		yesterday: {
			in: Math.round(trafficData.yesterday.in * finalMultiplier * 0.9),
			out: Math.round(trafficData.yesterday.out * finalMultiplier * 0.9)
		},
		hourlyData: trafficData.hourlyData.map(hour => ({
			hour: hour.hour,
			in: Math.round(hour.in * finalMultiplier),
			out: Math.round(hour.out * finalMultiplier)
		})),
		weeklyData: trafficData.weeklyData.map(day => ({
			day: day.day,
			in: Math.round(day.in * finalMultiplier),
			out: Math.round(day.out * finalMultiplier)
		}))
	};
};

// Mock function to get filtered demographic data
const getFilteredDemographicData = (location, locationType, dateRange) => {
	let malePercentage = genderData.male;

	// Apply location-based adjustments
	if (locationType === 'store') {
		if (location === 'Store 001') malePercentage = 55;
		else if (location === 'Store 002') malePercentage = 48;
		else if (location === 'Store 003') malePercentage = 52;
	} else if (locationType === 'city') {
		if (location === 'New York') malePercentage = 49;
		else if (location === 'Los Angeles') malePercentage = 51;
		else if (location === 'Chicago') malePercentage = 47;
	}

	return {
		gender: {
			male: malePercentage,
			female: 100 - malePercentage,
			weeklyTrend: genderData.weeklyTrend.map(trend => ({
				male: Math.min(60, Math.max(40, trend.male + (location.charCodeAt(0) % 5 - 2))),
				female: Math.min(60, Math.max(40, trend.female + (location.charCodeAt(0) % 5 - 2)))
			}))
		},
		age: {
			"0-17": Math.max(5, Math.min(25, ageData["0-17"] + (location.charCodeAt(0) % 5))),
			"18-24": Math.max(10, Math.min(30, ageData["18-24"] + (location.charCodeAt(1) % 6))),
			"25-34": Math.max(15, Math.min(35, ageData["25-34"] + (location.charCodeAt(0) % 4))),
			"35-44": Math.max(15, Math.min(30, ageData["35-44"] + (location.charCodeAt(1) % 3))),
			"45-54": Math.max(10, Math.min(25, ageData["45-54"] + (location.charCodeAt(0) % 4))),
			"55+": Math.max(5, Math.min(20, ageData["55+"] + (location.charCodeAt(1) % 5))),
			weeklyTrend: ageData.weeklyTrend.map(trend => ({
				"0-17": Math.max(5, Math.min(15, trend["0-17"] + (location.charCodeAt(0) % 3))),
				"18-24": Math.max(15, Math.min(25, trend["18-24"] + (location.charCodeAt(1) % 3))),
				"25-34": Math.max(20, Math.min(30, trend["25-34"] + (location.charCodeAt(0) % 3))),
				"35-44": Math.max(10, Math.min(20, trend["35-44"] + (location.charCodeAt(1) % 3))),
				"45-54": Math.max(5, Math.min(15, trend["45-54"] + (location.charCodeAt(0) % 3))),
				"55+": Math.max(5, Math.min(15, trend["55+"] + (location.charCodeAt(1) % 3)))
			}))
		}
	};
};

const Index = () => {
	const [isScrolled, setIsScrolled] = useState(false);

	// Add state for filters
	const [selectedLocation, setSelectedLocation] = useState('Store 001');
	const [selectedLocationType, setSelectedLocationType] = useState('store');
	const [selectedDateRange, setSelectedDateRange] = useState({
		from: new Date(new Date().setHours(0, 0, 0, 0)),
		to: new Date(),
		preset: "today"
	});

	// Filtered data states
	const [filteredTraffic, setFilteredTraffic] = useState(trafficData);
	const [filteredChartData, setFilteredChartData] = useState(formatHourlyData(selectedDateRange));
	const [filteredGender, setFilteredGender] = useState(genderData);
	const [filteredAge, setFilteredAge] = useState(ageData);

	// Update data when filters change
	useEffect(() => {
		// Get filtered traffic data
		const newTrafficData = getFilteredTrafficData(
			selectedLocation,
			selectedLocationType,
			selectedDateRange
		);
		setFilteredTraffic(newTrafficData);

		// Update chart data
		const newChartData = newTrafficData.hourlyData.map((item) => ({
			name: `${item.hour}:00`,
			In: item.in,
			Out: item.out,
			Total: item.in + item.out,
		}));
		setFilteredChartData(newChartData);

		// Get filtered demographic data
		const demographicData = getFilteredDemographicData(
			selectedLocation,
			selectedLocationType,
			selectedDateRange
		);
		setFilteredGender(demographicData.gender);
		setFilteredAge(demographicData.age);

	}, [selectedLocation, selectedLocationType, selectedDateRange]);

	// Gender chart data
	const genderChartData = [
		{ name: "Male", value: filteredGender.male, color: "#3b82f6" },
		{ name: "Female", value: filteredGender.female, color: "#ec4899" },
	];

	// Age chart data
	const ageChartData = [
		{ name: "0-17", value: filteredAge["0-17"], color: "#60a5fa" },
		{ name: "18-24", value: filteredAge["18-24"], color: "#34d399" },
		{ name: "25-34", value: filteredAge["25-34"], color: "#a78bfa" },
		{ name: "35-44", value: filteredAge["35-44"], color: "#fbbf24" },
		{ name: "45-54", value: filteredAge["45-54"], color: "#f87171" },
		{ name: "55+", value: filteredAge["55+"], color: "#6b7280" }
	];

	// Calculate daily change percentage
	const calculateChange = (type: "in" | "out") => {
		const today = filteredTraffic.today[type];
		const yesterday = filteredTraffic.yesterday[type];
		const change = ((today - yesterday) / yesterday) * 100;
		return change;
	};

	// Handle location filter change
	const handleLocationChange = (location: string, type: 'store' | 'city' | 'region' | 'global') => {
		setSelectedLocation(location);
		setSelectedLocationType(type);
	};

	// Handle date filter change
	const handleDateChange = (dateRange: any) => {
		setSelectedDateRange(dateRange);
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
							<LocationFilter onChange={handleLocationChange} />
							<DateTimeFilter onChange={handleDateChange} />
						</div>
					</div>

					{/* Stats cards */}
					<div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
						<CountCard
							title="Total In"
							value={filteredTraffic.today.in}
							change={calculateChange("in")}
							type="in"
							icon="in"
						/>
						<CountCard
							title="Total Out"
							value={filteredTraffic.today.out}
							change={calculateChange("out")}
							type="out"
							icon="out"
						/>
						<CountCard
							title="Total Visitors"
							value={filteredTraffic.today.in + filteredTraffic.today.out}
							change={(calculateChange("in") + calculateChange("out")) / 2}
							type="total"
							icon="total"
						/>
					</div>

					{/* Traffic flow chart */}
					<div className="space-y-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
						<div className="flex items-center">
							<AreaChartIcon className="h-5 w-5 mr-2 text-primary" />
							<h2 className="text-lg font-semibold tracking-tight">Traffic Flow</h2>
						</div>
						<Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm overflow-hidden border border-gray-100 dark:border-gray-800/50 shadow-md">
							<CardContent className="p-1 sm:p-3 md:p-6">
								<div className="h-[300px] w-full">
									<ResponsiveContainer width="100%" height="100%">
										<AreaChart
											data={filteredChartData}
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
