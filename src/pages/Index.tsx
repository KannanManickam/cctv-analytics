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
import axios from "axios";
import {
	LayoutDashboard,
	LogOut,

} from "lucide-react";

import data from "@/utils/data.json";

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

type SidebarProps = {
	open: boolean;
	onClose: () => void;
};
const Sidebar: React.FC<SidebarProps> = ({ open, onClose }) => (
	<div
		className={cn(
			"fixed inset-y-0 left-0 z-30 flex flex-col transition-transform duration-300 min-h-screen w-56",
			open ? "translate-x-0" : "-translate-x-full"
		)}
		style={{ background: "#DD3E62" }}
	>
		<div className="flex items-center justify-between h-16 px-4 border-b border-white/10">
			<span className="font-bold text-white text-lg">Menu</span>
			<button
				className="text-white hover:bg-white/10 rounded p-2 transition"
				onClick={onClose}
				aria-label="Close sidebar"
			>
				<svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor"
					strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-x">
					<line x1={18} y1={6} x2={6} y2={18} /><line x1={6} y1={6} x2={18} y2={18} />
				</svg>
			</button>
		</div>

		{/* Main content */}
		<nav className="flex-1 flex flex-col gap-2 px-2 py-4 text-white">
			<button
				className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition"
				onClick={() => window.location.pathname = "/dashboard"}
				style={{
					background: window.location.pathname === "/dashboard" || window.location.pathname === "/" ? "rgba(255,255,255,0.2)" : undefined,
				}}
			>
				<LayoutDashboard className="mr-2" />
				Dashboard
			</button>
		</nav>

		{/* Logout at bottom */}
		<div className="px-2 pb-4 mt-auto">
			<button
				className="flex items-center gap-2 px-3 py-2 rounded hover:bg-white/20 transition w-full text-white"
				onClick={() => {
					localStorage.removeItem("accessToken"); // ✅ clear the token
					window.location.href = "/"; // ✅ redirect to login
				}}
			>
				<LogOut className="mr-2" />
				Logout
			</button>
		</div>
	</div>
);

const Index = () => {
	const [isScrolled, setIsScrolled] = useState(false);
	const [sidebarOpen, setSidebarOpen] = useState(false);

	// Add state for filters
	const [selectedLocation, setSelectedLocation] = useState('Store 001');

	const [selectedLocationId, setSelectedLocationId] = useState<string>(""); // store the ID
	const [selectedLocationType, setSelectedLocationType] = useState<'store' | 'city' | 'region' | 'global'>("store");

	const [selectedDateRange, setSelectedDateRange] = useState({
		from: new Date(new Date().setHours(0, 0, 0, 0)),
		to: new Date(),
		preset: "today"
	});

	// Filtered data states
	const [filteredTraffic, setFilteredTraffic] = useState(null);
	const [filteredChartData, setFilteredChartData] = useState([]);
	const [filteredAge, setFilteredAge] = useState({});
	const [genderChartData, setGenderChartData] = useState([]);

	// Age chart data
	const ageChartData = [
		{ id: 1, name: "0-19", value: filteredAge["0-19"], color: "#B8335A" }, // Darkest
		{ id: 2, name: "20-29", value: filteredAge["20-29"], color: "#D96D7B" },
		{ id: 3, name: "30-39", value: filteredAge["30-39"], color: "#F29A8B" },
		{ id: 4, name: "40-49", value: filteredAge["40-49"], color: "#F7BBB6" },
		{ id: 5, name: "50+", value: filteredAge["50+"], color: "#FFD7D2" },   // Lightest
	].sort((a, b) => a.id - b.id); // Ensure data stays in proper order


	// Handle location filter change
	const handleLocationChange = (locationId: string, type: 'store' | 'city' | 'region' | 'global') => {
		setSelectedLocationId(locationId); // store ID
		setSelectedLocationType(type);     // store type
	};

	// Handle date filter change
	const handleDateChange = (dateRange: any) => {
		console.log("Selected date range:", dateRange);
		setSelectedDateRange(dateRange);
	};

	useEffect(() => {
		const fetchTrafficData = async () => {
			try {
				const fromDate = new Date(selectedDateRange.from).toISOString().slice(0, 10);
				const toDate = new Date(selectedDateRange.to).toISOString().slice(0, 10);

				// params: {
				// 	store_id: 1,
				// 	region_id: 1,
				// 	city_id: 1,
				// 	global_id: 1,
				// 	from: fromDate,
				// 	to: toDate
				// }

				const params: any = {
					from: fromDate,
					to: toDate,
				};

				if (selectedLocationId && selectedLocationType) {
					params[`${selectedLocationType}_id`] = selectedLocationId;
				}

				const response = await axios.get('https://sfs-dashboard-api-production.up.railway.app/traffic', { params });

				const { age, gender, graph, summary } = response.data;

				const genderData = [
					{ name: "Male", value: parseFloat(gender?.male), color: "#DD3E62" },
					{ name: "Female", value: parseFloat(gender?.female), color: "#e8748e" },
				];
				setGenderChartData(genderData);

				const rangeValue = {};
				age.forEach(item => {
					rangeValue[item.range] = parseFloat(item.percent);
				});

				const newChartData = graph.map((item) => ({
					name: item.hour,
					In: item.in,
					Out: item.out,
					Total: item.in + item.out,
				}));

				setFilteredAge(rangeValue);
				setFilteredTraffic(summary);
				setFilteredChartData(newChartData);
			} catch (error) {
				console.error('Error fetching traffic data:', error);
			}
		};

		fetchTrafficData();
	}, [selectedLocationId, selectedLocationType, selectedDateRange]);


	// Listen for scroll events
	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const hasValidData = (data: ChartData[] = []) => {
		return data.some(item => item?.value && item.value > 0);
	};

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
		<div className="flex min-h-screen w-full">
			<Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
			<div className="flex-1 flex flex-col" style={{ marginLeft: sidebarOpen ? 224 : 0, transition: "margin-left 0.3s" }}>
				<header className="w-full sticky top-0 z-30 bg-background flex items-center h-16 border-b">
					<button
						className="ml-4 p-2 rounded-md hover:bg-[#DD3E62]/20 active:bg-[#DD3E62]/30 focus:outline-none transition group"
						aria-label="Open sidebar"
						style={{
							color: "#DD3E62",
							background: "none",
							border: "none",
						}}
						onClick={() => setSidebarOpen(true)}
					>
						{/* hamburger icon */}
						<svg className="h-7 w-7" stroke="currentColor" fill="none" strokeWidth={2} viewBox="0 0 24 24">
							<line x1={4} y1={6} x2={20} y2={6} />
							<line x1={4} y1={12} x2={20} y2={12} />
							<line x1={4} y1={18} x2={20} y2={18} />
						</svg>
					</button>
					<div className="flex flex-col">
						<h1 className="text-lg font-semibold tracking-tight" >
							CCTV Analytics
						</h1>
						<p className="text-xs text-muted-foreground">
							Real-time monitoring dashboard
						</p>
					</div>
				</header>

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
						{filteredTraffic && (
							<div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: "0.1s" }}>
								<CountCard
									title="Total In"
									value={Number(filteredTraffic?.total_in?.count)}
									change={parseFloat(filteredTraffic?.total_in?.change)}
									type="in"
									icon="in"
									preset={selectedDateRange.preset}
								/>
								<CountCard
									title="Total Out"
									value={filteredTraffic.total_out.count}
									change={parseFloat(filteredTraffic?.total_out?.change)}
									type="out"
									icon="out"
									preset={selectedDateRange.preset}
								/>
								<CountCard
									title="Total Visitors"
									value={filteredTraffic.total_visitors.count}
									change={parseFloat(filteredTraffic?.total_visitors?.change)}
									type="total"
									icon="total"
									preset={selectedDateRange.preset}
								/>
							</div>
						)}

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
														<stop offset="5%" stopColor="#DD3E62" stopOpacity={0.3} />
														<stop offset="95%" stopColor="#DD3E62" stopOpacity={0} />
													</linearGradient>
													<linearGradient id="colorOut" x1="0" y1="0" x2="0" y2="1">
														<stop offset="5%" stopColor="#A91F40" stopOpacity={0.3} />
														<stop offset="95%" stopColor="#A91F40" stopOpacity={0} />
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
													stroke="#A91F40"
													strokeWidth={2}
													fillOpacity={1}
													fill="url(#colorIn)"
													activeDot={{ r: 6 }}
												/>
												<Area
													type="monotone"
													dataKey="Out"
													stroke="#ff4771"
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
								{genderChartData && <DemographicsChart
									title="Gender Distribution"
									data={genderChartData}
									type="gender"
								/>}
								{ageChartData && <DemographicsChart
									title="Age Distribution"
									data={ageChartData}
									type="age"
								/>}
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
		</div>
	);
};

export default Index;
