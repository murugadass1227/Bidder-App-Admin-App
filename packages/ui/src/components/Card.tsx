"use client";

import * as React from "react";

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  as?: "div" | "article" | "section";
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className = "", as: Component = "div", ...props }, ref) => (
    <Component
      ref={ref}
      className={`rounded-xl border border-gray-200 bg-white shadow-sm ${className}`}
      {...props}
    />
  )
);

Card.displayName = "Card";

export const CardHeader: React.FC<
  React.HTMLAttributes<HTMLDivElement> & { title?: string; subtitle?: string }
> = ({ className = "", title, subtitle, children, ...props }) => (
  <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
    {title && <h3 className="text-lg font-semibold text-gray-900">{title}</h3>}
    {subtitle && <p className="mt-1 text-sm text-gray-500">{subtitle}</p>}
    {children}
  </div>
);

export const CardContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => <div className={`px-6 py-4 ${className}`} {...props} />;

export const CardFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className = "",
  ...props
}) => (
  <div
    className={`px-6 py-4 border-t border-gray-100 bg-gray-50/50 rounded-b-xl ${className}`}
    {...props}
  />
);
