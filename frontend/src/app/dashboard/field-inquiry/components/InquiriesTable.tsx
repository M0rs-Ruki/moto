"use client";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

interface FieldInquiry {
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

interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  fieldInquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  fieldInquiryId: string | null;
  ticketId: string | null;
}

interface InquiriesTableProps {
  inquiries: FieldInquiry[];
  phoneLookups: Record<string, PhoneLookup>;
  formatDate: (dateString: string) => string;
  getLeadScopeColor: (scope: string) => string;
}

export default function InquiriesTable({
  inquiries,
  phoneLookups,
  formatDate,
  getLeadScopeColor,
}: InquiriesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Inquiry
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Contact
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Lead Scope
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Lead Source
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Model
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Created
                </th>
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {inquiries.map((inquiry) => {
                const initials =
                  `${inquiry.firstName.charAt(0)}${inquiry.lastName.charAt(0)}`.toUpperCase();

                return (
                  <tr
                    key={inquiry.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    {/* Inquiry Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {inquiry.firstName} {inquiry.lastName}
                          </p>
                          {inquiry.email && (
                            <p className="text-xs text-muted-foreground truncate">
                              {inquiry.email}
                            </p>
                          )}
                          {inquiry.reason && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {inquiry.reason.length > 50
                                ? inquiry.reason.substring(0, 50) + "..."
                                : inquiry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {inquiry.whatsappNumber || "No phone"}
                      </p>
                    </td>

                    {/* Lead Scope Column */}
                    <td className="py-3 px-4">
                      <Badge
                        className={getLeadScopeColor(inquiry.leadScope)}
                        variant="secondary"
                      >
                        {inquiry.leadScope.toUpperCase()}
                      </Badge>
                    </td>

                    {/* Lead Source Column */}
                    <td className="py-3 px-4">
                      {inquiry.leadSource ? (
                        <Badge variant="outline" className="text-xs">
                          {inquiry.leadSource.name}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </td>

                    {/* Model Column */}
                    <td className="py-3 px-4">
                      {inquiry.model ? (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {inquiry.model.category.name}
                          </p>
                          <p className="text-sm font-medium">
                            {inquiry.model.name}
                          </p>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </td>

                    {/* Created Column */}
                    <td className="py-3 px-4">
                      <p className="text-sm">{formatDate(inquiry.createdAt)}</p>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {phoneLookups[inquiry.whatsappNumber]?.dailyWalkins && (
                          <Link
                            href="/dashboard/daily-walkins"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                            >
                              Walkins
                            </Badge>
                          </Link>
                        )}
                        {phoneLookups[inquiry.whatsappNumber]
                          ?.deliveryUpdate && (
                          <Link
                            href="/dashboard/delivery-update"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Badge
                              variant="outline"
                              className="text-xs cursor-pointer hover:bg-primary/10 transition-colors"
                            >
                              Delivery
                            </Badge>
                          </Link>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
