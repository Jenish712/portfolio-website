import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";

const Sheet = ({ children, ...props }) => {
  const [open, setOpen] = useState(false);
  return (
    <div {...props}>
      {React.Children.map(children, (child) =>
        React.cloneElement(child, { open, setOpen })
      )}
    </div>
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
      <div
        className="fixed inset-0 bg-black/60"
        onClick={() => setOpen(false)}
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "fixed inset-y-0 right-0 z-[101] flex h-full w-full max-w-sm sm:max-w-md bg-neutral-950 text-neutral-100 border-l border-emerald-800/40 p-4 sm:p-6 shadow-2xl overflow-y-auto overflow-x-hidden",
          className
        )}
        {...props}
      >
        {React.Children.map(children, (child) =>
          React.isValidElement(child) ? React.cloneElement(child, { setOpen }) : child
        )}
      </div>
    </div>,
    document.body
  );
};

const SheetHeader = ({ className, open, setOpen, children, ...props }) => (
  <div
    className={cn(
      "sticky top-0 z-10 -mx-4 sm:-mx-6 px-4 sm:px-6 py-3 mb-4 flex items-center justify-between border-b border-emerald-800/30 bg-neutral-950/95 backdrop-blur",
      className
    )}
    {...props}
  >
    <div className="min-w-0">{children}</div>
    <button
      type="button"
      onClick={() => setOpen?.(false)}
      className="ml-4 inline-flex h-8 w-8 items-center justify-center rounded-md text-neutral-400 hover:text-neutral-100 hover:bg-emerald-500/10 border border-transparent hover:border-emerald-700/40 transition-colors"
      aria-label="Close"
    >
      <X className="h-4 w-4" />
    </button>
  </div>
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
