"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumb() {
  const pathname = usePathname();

  // Define breadcrumb mapping
  const breadcrumbMap: { [key: string]: string } = {
    "/dashboard": "Dashboard",
    "/dashboard/daily-walkins": "Daily Walkins",
    "/dashboard/digital-enquiry": "Digital Enquiry",
    "/dashboard/field-inquiry": "Field Inquiry",
    "/dashboard/delivery-update": "Delivery Update",
    "/dashboard/global-settings": "Settings",
  };

  const generateBreadcrumbs = () => {
    const breadcrumbs = [{ label: "Home", href: "/dashboard" }];

    // Get the label for current path
    const currentLabel = breadcrumbMap[pathname];

    if (currentLabel) {
      breadcrumbs.push({ label: currentLabel, href: pathname });
    }

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  return (
    <nav className="flex items-center space-x-2 text-sm">
      {breadcrumbs.map((breadcrumb, index) => (
        <div key={index} className="flex items-center space-x-2">
          {index > 0 && (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          {index === breadcrumbs.length - 1 ? (
            <span className="text-foreground font-medium">
              {breadcrumb.label}
            </span>
          ) : (
            <Link
              href={breadcrumb.href}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              {breadcrumb.label}
            </Link>
          )}
        </div>
      ))}
    </nav>
  );
}
