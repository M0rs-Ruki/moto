"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Loader2, MessageSquare } from "lucide-react";

interface DigitalEnquiry {
  id: string;
  firstName: string;
  lastName: string;
  whatsappNumber: string;
  email: string | null;
  reason: string;
  leadScope: string;
  leadSource: {
    id: string;
    name: string;
  } | null;
  model: {
    name: string;
    category: {
      name: string;
    };
  } | null;
  createdAt: string;
}

export default function DigitalEnquiryPage() {
  const router = useRouter();
  const [enquiries, setEnquiries] = useState<DigitalEnquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const fetchEnquiries = async () => {
    try {
      const response = await axios.get("/api/digital-enquiry");
      setEnquiries(response.data.enquiries);
    } catch (error) {
      console.error("Failed to fetch enquiries:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const getLeadScopeColor = (scope: string) => {
    switch (scope) {
      case "high":
        return "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400";
      case "medium":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400";
      case "low":
        return "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400";
      default:
        return "bg-gray-100 dark:bg-gray-900/30 text-gray-600 dark:text-gray-400";
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="pb-2 border-b">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
          Digital Enquiry
        </h1>
        <p className="text-xs sm:text-sm lg:text-base text-muted-foreground mt-2">
          Manage digital lead inquiries
        </p>
      </div>

      <div className="flex justify-end">
        <Button onClick={() => router.push("/dashboard/digital-enquiry/create")}>
          <Plus className="mr-2 h-4 w-4" />
          Create Inquiry
        </Button>
      </div>

      {enquiries.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="text-sm sm:text-base">
                No digital enquiries yet. Create your first inquiry to get started.
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {enquiries.map((enquiry) => (
            <Card
              key={enquiry.id}
              className="hover:shadow-lg transition-shadow"
            >
              <CardHeader>
                <CardTitle className="text-base sm:text-lg">
                  {enquiry.firstName} {enquiry.lastName}
                </CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  {enquiry.whatsappNumber}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-xs sm:text-sm">
                  {enquiry.email && (
                    <div className="text-muted-foreground">{enquiry.email}</div>
                  )}
                  <div className="text-muted-foreground line-clamp-2">
                    {enquiry.reason}
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge
                      className={getLeadScopeColor(enquiry.leadScope)}
                      variant="secondary"
                    >
                      {enquiry.leadScope.toUpperCase()}
                    </Badge>
                    {enquiry.leadSource && (
                      <Badge variant="outline">
                        {enquiry.leadSource.name}
                      </Badge>
                    )}
                    {enquiry.model && (
                      <Badge variant="outline">
                        {enquiry.model.category.name} - {enquiry.model.name}
                      </Badge>
                    )}
                  </div>
                  <div className="text-xs text-muted-foreground pt-2">
                    {new Date(enquiry.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

