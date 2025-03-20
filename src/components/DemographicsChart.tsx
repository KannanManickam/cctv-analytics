
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend } from "recharts";
import { cn } from "@/lib/utils";

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

  return (
    <Card className={cn(
      "perspective-hover border overflow-hidden shadow-md",
      "bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/30 dark:to-gray-900/80",
      "border-gray-100 dark:border-gray-800/30",
      className
    )}>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
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
