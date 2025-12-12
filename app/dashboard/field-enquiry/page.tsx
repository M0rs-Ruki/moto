"use client";

import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Construction } from "lucide-react";

export default function FieldEnquiryPage() {
  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Field Enquiry
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Coming soon
        </p>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col items-center justify-center py-12 sm:py-16 text-center">
            <div className="mb-6 p-4 bg-muted rounded-full">
              <Construction className="h-12 w-12 sm:h-16 sm:w-16 text-muted-foreground" />
            </div>
            <h2 className="text-xl sm:text-2xl font-semibold mb-2">
              Coming Soon
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground max-w-md">
              The Field Enquiry section is currently under development. Check
              back soon for updates!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

