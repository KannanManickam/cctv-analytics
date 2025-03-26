
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { cn } from "@/lib/utils";
import { Info } from "lucide-react";
import {
  Tooltip as TooltipUI,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface ChartData {
  name: string;
  value: number;
  color: string;
}

interface DemographicsChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  className?: string;
  type?: "gender" | "age";
}

const DemographicsChart: React.FC<DemographicsChartProps> = ({
  title,
  description,
  data,
  className,
  type = "gender"
}) => {
  // Custom legend renderer
  const renderCustomizedLegend = ({ payload }: any) => {
    return (
      <div className="flex flex-col gap-2 text-xs">
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center gap-2">
            <div
              className={cn(
                "h-3 w-3 rounded-full",
                type === "gender" ? "rounded-full" : "rounded"
              )}
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-muted-foreground">{entry.value}</span>
            <span className="font-medium">{entry.payload.value}%</span>
          </div>
        ))}
      </div>
    );
  };

  // Custom tooltip component for pie chart
  const CustomPieTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="fancy-blur rounded-lg p-2 text-sm shadow-md border border-gray-200 dark:border-gray-800 min-w-[120px]">
          <p className="font-medium">{data.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-muted-foreground text-xs">Percentage:</span>
            <span className="font-medium">{data.value}%</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className={cn(
      "perspective-hover border overflow-hidden shadow-md",
      "bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/30 dark:to-gray-900/80",
      "border-gray-100 dark:border-gray-800/30",
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <TooltipProvider>
            <TooltipUI>
              <TooltipTrigger asChild>
                <Info className="h-4 w-4 text-muted-foreground/70 hover:text-primary cursor-help transition-colors" />
              </TooltipTrigger>
              <TooltipContent side="top" className="max-w-[200px] text-xs">
                {type === "gender" 
                  ? "Gender distribution of visitors based on AI detection" 
                  : "Age distribution of visitors based on AI detection"}
              </TooltipContent>
            </TooltipUI>
          </TooltipProvider>
        </div>
        {description && <p className="text-xs text-muted-foreground">{description}</p>}
      </CardHeader>
      <CardContent className="p-3">
        <div className="h-[180px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={60}
                innerRadius={type === "gender" ? 40 : 0}
                dataKey="value"
                animationBegin={100}
                animationDuration={1000}
                animationEasing="ease-out"
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.color} 
                    stroke="none"
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomPieTooltip />} />
              <Legend 
                content={renderCustomizedLegend}
                layout="vertical"
                verticalAlign="middle"
                align="right"
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DemographicsChart;
