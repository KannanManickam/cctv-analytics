
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AnimatedNumber from "./AnimatedNumber";
import { ArrowDown, ArrowUp, Users, UserMinus, UserPlus } from "lucide-react";

interface CountCardProps {
  title: string;
  value: number;
  change?: number;
  description?: string;
  type?: "in" | "out" | "total";
  className?: string;
  icon?: "in" | "out" | "total";
}

const CountCard: React.FC<CountCardProps> = ({
  title,
  value,
  change,
  description,
  type = "total",
  className,
  icon = "total"
}) => {
  const iconMap = {
    in: <UserPlus className="h-5 w-5 text-emerald-500" />,
    out: <UserMinus className="h-5 w-5 text-blue-500" />,
    total: <Users className="h-5 w-5 text-primary" />
  };

  const selectedIcon = iconMap[icon];

  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  // Background styles based on type
  const bgStyles = {
    in: "bg-gradient-to-br from-emerald-50 to-white dark:from-emerald-950/30 dark:to-gray-900/80",
    out: "bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-gray-900/80",
    total: "bg-gradient-to-br from-gray-50 to-white dark:from-gray-950/30 dark:to-gray-900/80"
  };

  // Border styles based on type
  const borderStyles = {
    in: "border-emerald-100 dark:border-emerald-900/30",
    out: "border-blue-100 dark:border-blue-900/30",
    total: "border-gray-100 dark:border-gray-800/30"
  };

  return (
    <Card className={cn(
      "perspective-hover overflow-hidden border shadow-md", 
      bgStyles[type],
      borderStyles[type],
      className
    )}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
          <div className="rounded-full p-1 bg-secondary/80">{selectedIcon}</div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">
            <AnimatedNumber value={value} />
          </h2>
          {change !== undefined && (
            <p className={cn(
              "text-sm flex items-center gap-1",
              isPositive ? "text-emerald-600 dark:text-emerald-400" : "",
              isNegative ? "text-red-600 dark:text-red-400" : "",
              !isPositive && !isNegative ? "text-gray-500 dark:text-gray-400" : ""
            )}>
              {isPositive && <ArrowUp className="h-3 w-3" />}
              {isNegative && <ArrowDown className="h-3 w-3" />}
              <span>{Math.abs(change).toFixed(1)}% from yesterday</span>
            </p>
          )}
          {description && (
            <p className="text-xs text-muted-foreground mt-2">{description}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CountCard;
