import React, { useState } from "react";
import { cn } from "../../utils/cn";

const Sheet = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      {React.Children.map(children, child =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
  );
};

const SheetTrigger = ({ children, setOpen, ...props }) => (
  <div onClick={() => setOpen(true)} {...props}>
    {children}
  </div>
);

const SheetContent = ({ className, open, setOpen, children, ...props }) => {
  if (!open) return null;
  
  return (
    <div className="fixed inset-0 z-50">
      <div className="fixed inset-0 bg-black/80" onClick={() => setOpen(false)} />
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-80 sm:w-96 border-l bg-background p-4 sm:p-6 shadow-lg overflow-y-auto",
          className
        )}
        {...props}
      >
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 text-neutral-400 hover:text-neutral-100 transition-colors"
          aria-label="Close menu"
        >
          ✕
        </button>
        {children}
      </div>
    </div>
  );
};

const SheetHeader = ({ className, ...props }) => (
  <div
    className={cn("flex flex-col space-y-2 text-center sm:text-left", className)}
    {...props}
  />
);

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2
    ref={ref}
    className={cn("text-lg font-semibold", className)}
    {...props}
  />
));
SheetTitle.displayName = "SheetTitle";

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle };