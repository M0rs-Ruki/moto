export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30 p-4 sm:p-6 md:p-8">
      <div className="max-w-2xl mx-auto">
        {/* Logo */}
        <div className="mb-12 flex items-center justify-center">
          <img
            src={"/Autopluse Black1.png"}
            alt="Logo"
            className="h-16 w-auto object-contain dark:hidden"
          />
          <img
            src={"/Autopluse White1.png"}
            alt="Logo"
            className="h-16 w-auto object-contain hidden dark:block"
          />
        </div>

        {/* Content */}
        <div className="bg-card rounded-lg border shadow-sm p-8 space-y-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              About This Project
            </h1>
            <p className="text-muted-foreground">
              Project Information & Credits
            </p>
          </div>

          <hr className="border-border" />

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Project Name
            </h2>
            <p className="text-muted-foreground">Showroom Management System</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Created By
            </h2>
            <p className="text-muted-foreground">Rolefic Idea</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Description
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              A comprehensive showroom management system designed to streamline
              operations, manage leads, track deliveries, and monitor walkins
              efficiently. This system provides a complete solution for
              automotive dealerships to manage their sales operations, customer
              interactions, and inventory tracking.
            </p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Technology Stack
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Built with modern web technologies including:
            </p>
            <ul className="list-disc list-inside text-muted-foreground mt-2 space-y-1">
              <li>Next.js - React framework</li>
              <li>TypeScript - Type-safe development</li>
              <li>Prisma - Database ORM</li>
              <li>Tailwind CSS - Styling</li>
              <li>PostgreSQL - Database</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Version
            </h2>
            <p className="text-muted-foreground">1.0.0</p>
          </div>

          <div>
            <h2 className="text-xl font-semibold text-foreground mb-3">
              Features
            </h2>
            <ul className="list-disc list-inside text-muted-foreground space-y-1">
              <li>Dashboard with key metrics</li>
              <li>Daily walkins management</li>
              <li>Digital enquiry tracking</li>
              <li>Field inquiry management</li>
              <li>Delivery update tracking</li>
              <li>User authentication and authorization</li>
              <li>Theme switching (Light/Dark mode)</li>
              <li>Responsive design</li>
            </ul>
          </div>

          <hr className="border-border" />

          <div className="pt-4">
            <p className="text-xs text-muted-foreground text-center">
              © 2026 Rolefic Idea. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
