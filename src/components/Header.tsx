
import React from "react";
import { cn } from "@/lib/utils";
import { Camera, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  className?: string;
  toggleSidebar?: () => void;
}

const Header: React.FC<HeaderProps> = ({ className, toggleSidebar }) => {
  return (
    <header className={cn(
      "sticky top-0 z-30 h-16 flex items-center justify-between px-4 md:px-6 bg-white/70 dark:bg-gray-950/70 backdrop-blur-lg border-b border-gray-100 dark:border-gray-800/30",
      className
    )}>
      <div className="flex items-center gap-2 md:gap-4">
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
        <div className="flex items-center gap-2 md:gap-3">
          <div className="bg-primary/10 rounded-md p-1.5">
            <Camera className="h-5 w-5 text-primary" />
          </div>
          <div className="flex flex-col">
            <h1 className="text-lg font-semibold tracking-tight">
              CCTV Analytics
            </h1>
            <p className="text-xs text-muted-foreground">
              Real-time monitoring dashboard
            </p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse-slow"></div>
        <span className="text-xs font-medium text-muted-foreground">Live</span>
      </div>
    </header>
  );
};

export default Header;
