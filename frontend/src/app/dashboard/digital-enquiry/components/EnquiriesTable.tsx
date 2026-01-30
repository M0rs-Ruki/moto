"use client";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Edit2, Loader2 } from "lucide-react";
import Link from "next/link";

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
  modelText?: string | null; // Raw model name when not found in DB
  sourceText?: string | null; // Raw source name when not found in DB
  createdAt: string;
}

interface PhoneLookup {
  dailyWalkins: boolean;
  digitalEnquiry: boolean;
  deliveryUpdate: boolean;
  visitorId: string | null;
  enquiryId: string | null;
  ticketId: string | null;
}

interface EnquiriesTableProps {
  enquiries: DigitalEnquiry[];
  phoneLookups: Record<string, PhoneLookup>;
  editingLeadScope: string | null;
  updatingLeadScope: boolean;
  onEditLeadScope: (enquiryId: string) => void;
  onUpdateLeadScope: (enquiryId: string, newLeadScope: string) => void;
  formatDate: (dateString: string) => string;
  getLeadScopeColor: (scope: string) => string;
}

export default function EnquiriesTable({
  enquiries,
  phoneLookups,
  editingLeadScope,
  updatingLeadScope,
  onEditLeadScope,
  onUpdateLeadScope,
  formatDate,
  getLeadScopeColor,
}: EnquiriesTableProps) {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Enquiry
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
              {enquiries.map((enquiry) => {
                const initials = `${enquiry.firstName.charAt(
                  0,
                )}${enquiry.lastName.charAt(0)}`.toUpperCase();

                return (
                  <tr
                    key={enquiry.id}
                    className="border-b hover:bg-muted/30 transition-colors"
                  >
                    {/* Enquiry Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-sm flex-shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">
                            {enquiry.firstName} {enquiry.lastName}
                          </p>
                          {enquiry.email && (
                            <p className="text-xs text-muted-foreground truncate">
                              {enquiry.email}
                            </p>
                          )}
                          {enquiry.reason && (
                            <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                              {enquiry.reason.length > 50
                                ? enquiry.reason.substring(0, 50) + "..."
                                : enquiry.reason}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Contact Column */}
                    <td className="py-3 px-4">
                      <p className="text-sm">
                        {enquiry.whatsappNumber || "No phone"}
                      </p>
                    </td>

                    {/* Lead Scope Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-1.5 group">
                        {editingLeadScope === enquiry.id ? (
                          <Select
                            value={enquiry.leadScope}
                            onValueChange={(value) => {
                              onUpdateLeadScope(enquiry.id, value);
                            }}
                            disabled={updatingLeadScope}
                          >
                            <SelectTrigger className="h-7 w-20 text-xs">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="hot">Hot</SelectItem>
                              <SelectItem value="warm">Warm</SelectItem>
                              <SelectItem value="cold">Cold</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          <>
                            <Badge
                              className={getLeadScopeColor(enquiry.leadScope)}
                              variant="secondary"
                            >
                              {enquiry.leadScope?.toUpperCase() || "N/A"}
                            </Badge>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                              onClick={(e) => {
                                e.stopPropagation();
                                onEditLeadScope(enquiry.id);
                              }}
                              disabled={updatingLeadScope}
                            >
                              <Edit2 className="h-3 w-3" />
                            </Button>
                          </>
                        )}
                        {updatingLeadScope &&
                          editingLeadScope === enquiry.id && (
                            <Loader2 className="h-3 w-3 animate-spin" />
                          )}
                      </div>
                    </td>

                    {/* Lead Source Column */}
                    <td className="py-3 px-4">
                      {enquiry.leadSource ? (
                        <Badge variant="outline" className="text-xs">
                          {enquiry.leadSource.name}
                        </Badge>
                      ) : enquiry.sourceText ? (
                        <Badge variant="outline" className="text-xs">
                          {enquiry.sourceText}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </td>

                    {/* Model Column */}
                    <td className="py-3 px-4">
                      {enquiry.model ? (
                        <div className="space-y-1">
                          <p className="text-xs text-muted-foreground">
                            {enquiry.model.category.name}
                          </p>
                          <p className="text-sm font-medium">
                            {enquiry.model.name}
                          </p>
                        </div>
                      ) : enquiry.modelText ? (
                        <p className="text-sm font-medium">
                          {enquiry.modelText}
                        </p>
                      ) : enquiry.reason &&
                        enquiry.reason !== "Bulk imported enquiry" ? (
                        <p className="text-sm font-medium">{enquiry.reason}</p>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          None
                        </span>
                      )}
                    </td>

                    {/* Created Column */}
                    <td className="py-3 px-4">
                      <p className="text-sm">{formatDate(enquiry.createdAt)}</p>
                    </td>

                    {/* Actions Column */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        {phoneLookups[enquiry.whatsappNumber]?.dailyWalkins && (
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
                        {phoneLookups[enquiry.whatsappNumber]
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
