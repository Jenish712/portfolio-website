import React, { useEffect, useState, useContext, createContext } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const SheetContext = createContext({ open: false, setOpen: () => {} });

const Sheet = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      <div {...props}>
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { open, setOpen }) : child
        )}
      </div>
    </SheetContext.Provider>
  );
};

const SheetTrigger = ({ children, setOpen, asChild, ...props }) => {
  const triggerChild = asChild ? React.Children.only(children) : children;
  const handleClick = () => setOpen(true);

  if (asChild && React.isValidElement(triggerChild)) {
    return React.cloneElement(triggerChild, {
      ...props,
      onClick: (event) => {
        triggerChild.props.onClick?.(event);
        handleClick();
      },
    });
  }

  return (
    <div onClick={handleClick} {...props}>
      {children}
    </div>
  );
};

const SheetContent = ({ className, open, setOpen, children, ...props }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!open || !mounted || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed inset-0 z-[100]">
      <div className="fixed inset-0 bg-black/65" onClick={() => setOpen(false)} />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 right-0 z-[101] flex h-full w-full max-w-md sm:max-w-lg bg-background text-foreground border-l border dark:border-emerald-900/40 shadow-[0_0_60px_-15px_rgba(16,185,129,0.35)]",
          className
        )}
        {...props}
      >
        {children}
      </div>
    </div>,
    document.body
  );
};

const SheetHeader = ({ className, children, ...props }) => {
  const { setOpen } = useContext(SheetContext) || {};
  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4 border-b border bg-background/80 px-6 py-5 backdrop-blur",
        className
      )}
      {...props}
    >
      <div className="min-w-0">{children}</div>
      <button
        type="button"
        onClick={() => setOpen?.(false)}
        className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-all hover:border-emerald-700/40 hover:bg-emerald-500/10 hover:text-foreground"
        aria-label="Close menu"
      >
        <X className="h-4 w-4" aria-hidden="true" />
        <span className="sr-only">Close menu</span>
      </button>
    </div>
  );
};

const SheetTitle = React.forwardRef(({ className, ...props }, ref) => (
  <h2 ref={ref} className={cn("text-lg font-semibold", className)} {...props} />
));
SheetTitle.displayName = "SheetTitle";

const useSheet = () => useContext(SheetContext);

export { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, useSheet };

