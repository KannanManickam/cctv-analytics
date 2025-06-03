
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Calendar, TrendingUp, Users } from 'lucide-react';

interface AttendanceData {
    [key: string]: {
        in: number;
        out: number;
    };
}

interface ChartDataPoint {
    date: string;
    displayDate: string;
    In: number;
    Out: number;
}

interface CustomTooltipProps {
    active?: boolean;
    payload?: Array<{
        color: string;
        dataKey: string;
        value: number;
    }>;
    label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white/95 backdrop-blur-sm border border-gray-200 rounded-lg shadow-lg p-3">
                <p className="font-medium text-gray-900 mb-2">{label}</p>
                {payload.map((entry, index) => (
                    <p key={index} className="text-sm" style={{ color: entry.color }}>
                        {entry.dataKey}: {entry.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

interface AttendanceChartProps {
    data: AttendanceData;
}

const AttendanceChart: React.FC<AttendanceChartProps> = ({ data }) => {
    // Transform the data for the chart
    const chartData: ChartDataPoint[] = Object.entries(data).map(([date, values]) => {
        const dateObj = new Date(date);
        const displayDate = dateObj.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });

        return {
            date,
            displayDate,
            In: values.in,
            Out: values.out,
        };
    });

    // Calculate totals
    const totalIn = Object.values(data).reduce((sum, day) => sum + day.in, 0);
    const totalOut = Object.values(data).reduce((sum, day) => sum + day.out, 0);
    const averageIn = totalIn / Object.keys(data).length;

    return (
        <div className="space-y-6">

            {/* Main Chart */}
            <Card className="bg-white/80 backdrop-blur-sm overflow-hidden border border-gray-100 shadow-lg">
                <CardHeader className="pb-4">
                    <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                        <Calendar className="h-5 w-5 text-rose-500" />
                        Datewise Overview
                    </CardTitle>
                    <p className="text-sm text-gray-600">Daily check-in and check-out activity</p>
                </CardHeader>
                <CardContent className="p-1 sm:p-3 md:p-6">
                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart
                                data={chartData}
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
                                <CartesianGrid
                                    strokeDasharray="3 3"
                                    vertical={false}
                                    stroke="#f1f5f9"
                                />
                                <XAxis
                                    dataKey="displayDate"
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
    );
};

export default AttendanceChart;