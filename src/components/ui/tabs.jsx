import React, { useState, createContext, useContext } from "react";
import { cn } from "../../utils/cn";

const TabsContext = createContext();

const Tabs = ({ className, defaultValue, value, onValueChange, children, ...props }) => {
  const [activeTab, setActiveTab] = useState(value || defaultValue);
  
  const handleValueChange = (newValue) => {
    setActiveTab(newValue);
    onValueChange && onValueChange(newValue);
  };

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab: handleValueChange }}>
      <div className={cn("w-full", className)} {...props}>
        {children}
      </div>
    </TabsContext.Provider>
  );
};

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground",
      className
    )}
    {...props}
  />
));
TabsList.displayName = "TabsList";

const TabsTrigger = React.forwardRef(({ className, value, onClick, children, ...props }, ref) => {
  const { activeTab, setActiveTab } = useContext(TabsContext) || {};
  
  const handleClick = (e) => {
    setActiveTab && setActiveTab(value);
    onClick && onClick(e);
  };

  return (
    <button
      ref={ref}
      className={cn(
        // Base button
        "relative inline-flex items-center justify-center whitespace-nowrap px-3 py-2 text-sm font-medium text-muted-foreground transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50",
        // Underline indicator (inactive -> height 0)
        "after:absolute after:left-2 after:right-2 after:-bottom-1 after:h-0 after:rounded-full after:bg-emerald-500/80 after:transition-all",
        // Active state
        activeTab === value && "text-emerald-700 dark:text-emerald-300 after:h-0.5",
        className
      )}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
});
TabsTrigger.displayName = "TabsTrigger";

const TabsContent = React.forwardRef(({ className, value, children, ...props }, ref) => {
  const { activeTab } = useContext(TabsContext) || {};
  
  if (activeTab !== value) return null;
  
  return (
    <div
      ref={ref}
      className={cn(
        "mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});
TabsContent.displayName = "TabsContent";

export { Tabs, TabsList, TabsTrigger, TabsContent };
