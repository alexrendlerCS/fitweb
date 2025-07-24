"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  ExternalLink,
  Mail,
  X,
} from "lucide-react";
import { supabase, TrainerApplication } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface TrainerApplicationTableProps {
  applications: TrainerApplication[];
  onUpdate: () => void;
}

export default function TrainerApplicationTable({
  applications,
  onUpdate,
}: TrainerApplicationTableProps) {
  const { toast } = useToast();
  const [filteredApplications, setFilteredApplications] =
    useState<TrainerApplication[]>(applications);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedApplication, setSelectedApplication] =
    useState<TrainerApplication | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [stripeLink, setStripeLink] = useState("");
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    let filtered = applications;

    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status === statusFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (app) =>
          app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.business_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          app.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredApplications(filtered);
  }, [applications, statusFilter, searchTerm]);

  const updateApplicationStatus = async (
    id: string,
    status: string,
    zoomLink?: string
  ) => {
    console.log('updateApplicationStatus called with:', { id, status, zoomLink });
    setIsUpdating(true);
    try {
      const requestBody = {
        id,
        status,
        zoomLink
      };
      
      console.log('Sending request to API:', requestBody);
      
      const response = await fetch('/api/admin/update-application', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('Response status:', response.status);
      const result = await response.json();
      console.log('Response result:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update application');
      }

      console.log('Application updated successfully, refreshing data...');
      
      // Close the dialog first
      console.log('Closing dialog...');
      setSelectedApplication(null);
      setStripeLink("");
      console.log('Dialog should be closed now');
      
      // Then refresh the data
      console.log('Refreshing data...');
      await onUpdate();
      console.log('Data refresh completed');
      
      // Show success message after a small delay to ensure data is refreshed
      setTimeout(() => {
        setSuccessMessage(`Application ${status} successfully! Email sent to ${result.application?.email || 'applicant'}.`);
        setShowSuccessDialog(true);
      }, 500);
    } catch (error) {
      console.error("Error updating application:", error);
      alert(`Error updating application: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: "bg-yellow-500", text: "Pending" },
      approved: { color: "bg-green-500", text: "Approved" },
      paid: { color: "bg-green-500", text: "Paid" },
      rejected: { color: "bg-red-500", text: "Rejected" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.color} text-white`}>{config.text}</Badge>
    );
  };

  const getTierBadge = (tier: string) => {
    const tierConfig = {
      starter: { color: "bg-gray-500", text: "Starter" },
      pro: { color: "bg-[#004d40]", text: "Pro" },
      elite: { color: "bg-purple-500", text: "Elite" },
    };

    const config =
      tierConfig[tier as keyof typeof tierConfig] || tierConfig.starter;

    return (
      <Badge className={`${config.color} text-white`}>{config.text}</Badge>
    );
  };

  return (
    <>
      <Card className="bg-gray-900 border-gray-700">
      <CardHeader>
        <CardTitle className="text-2xl text-white">
          Trainer Applications
        </CardTitle>
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by name, business, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-black border-gray-600 text-white placeholder-gray-400"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-black border-gray-600 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-gray-600">
              <SelectItem value="all" className="text-white">
                All Statuses
              </SelectItem>
              <SelectItem value="pending" className="text-white">
                Pending
              </SelectItem>
              <SelectItem value="approved" className="text-white">
                Approved
              </SelectItem>
              <SelectItem value="paid" className="text-white">
                Paid
              </SelectItem>
              <SelectItem value="rejected" className="text-white">
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left p-3 text-white">Name</th>
                <th className="text-left p-3 text-white">Business</th>
                <th className="text-left p-3 text-white">Tier</th>
                <th className="text-left p-3 text-white">Status</th>
                <th className="text-left p-3 text-white">Date</th>
                <th className="text-left p-3 text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredApplications.map((app) => (
                <tr
                  key={app.id}
                  className="border-b border-gray-800 hover:bg-gray-800/50"
                >
                  <td className="p-3">
                    <div>
                      <div className="text-white font-medium">
                        {app.full_name}
                      </div>
                      <div className="text-gray-400 text-sm">{app.email}</div>
                    </div>
                  </td>
                  <td className="p-3 text-white">{app.business_name}</td>
                  <td className="p-3">{getTierBadge(app.selected_tier)}</td>
                  <td className="p-3">{getStatusBadge(app.status)}</td>
                  <td className="p-3 text-gray-300 text-sm">
                    {new Date(app.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Dialog open={selectedApplication?.id === app.id} onOpenChange={(open) => {
                        if (!open) {
                          setSelectedApplication(null);
                          setStripeLink("");
                        }
                      }}>
                        <DialogTrigger asChild>
                          <Button
                            size="sm"
                            onClick={() => setSelectedApplication(app)}
                            className="bg-[#004d40] hover:bg-[#00695c] text-white"
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="text-white">
                              Application Details
                            </DialogTitle>
                            <DialogClose asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-4 top-4 text-gray-400 hover:text-white"
                                onClick={() => {
                                  setSelectedApplication(null);
                                  setStripeLink("");
                                }}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </DialogClose>
                          </DialogHeader>
                          {selectedApplication && (
                            <div className="space-y-4 text-white">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Full Name
                                  </label>
                                  <p>{selectedApplication.full_name}</p>
                                </div>
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Email
                                  </label>
                                  <p>{selectedApplication.email}</p>
                                </div>
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Business Name
                                  </label>
                                  <p>{selectedApplication.business_name}</p>
                                </div>
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Selected Tier
                                  </label>
                                  <div>
                                    {getTierBadge(
                                      selectedApplication.selected_tier
                                    )}
                                  </div>
                                </div>
                              </div>

                              <div>
                                <label className="text-gray-400 text-sm">
                                  Business Goals
                                </label>
                                <p className="mt-1">
                                  {selectedApplication.goals}
                                </p>
                              </div>

                              {selectedApplication.instagram_url && (
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Instagram
                                  </label>
                                  <a
                                    href={selectedApplication.instagram_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#004d40] hover:underline flex items-center gap-1"
                                  >
                                    View Profile{" "}
                                    <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}

                              {selectedApplication.referral_name && (
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Referral
                                  </label>
                                  <p className="text-white">
                                    {selectedApplication.referral_name}
                                  </p>
                                </div>
                              )}

                              {selectedApplication.zoom_link && (
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Zoom Link
                                  </label>
                                  <a
                                    href={selectedApplication.zoom_link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#004d40] hover:underline flex items-center gap-1"
                                  >
                                    View Meeting Link <ExternalLink className="h-3 w-3" />
                                  </a>
                                </div>
                              )}

                              {selectedApplication.preferred_times && selectedApplication.preferred_times.length > 0 && (
                                <div>
                                  <label className="text-gray-400 text-sm">
                                    Preferred Call Times
                                  </label>
                                  <div className="mt-1 space-y-1">
                                    {selectedApplication.preferred_times.map((time, index) => (
                                      <div key={index} className="text-white text-sm">
                                        {index + 1}. {time.day} - {time.time}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div className="border-t border-gray-700 pt-4">
                                <label className="text-gray-400 text-sm">
                                  Zoom Call Link (Optional)
                                </label>
                                <div className="flex gap-2 mt-1">
                                  <Input
                                    value={stripeLink}
                                    onChange={(e) =>
                                      setStripeLink(e.target.value)
                                    }
                                    placeholder="https://zoom.us/j/..."
                                    className="bg-black border-gray-600 text-white"
                                  />
                                  <Button
                                    size="sm"
                                    onClick={() =>
                                      updateApplicationStatus(
                                        selectedApplication.id,
                                        "approved",
                                        stripeLink
                                      )
                                    }
                                    disabled={isUpdating}
                                    className="bg-[#004d40] hover:bg-[#00695c]"
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <CheckCircle className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                <p className="text-gray-400 text-xs mt-1">
                                  Add Zoom link if you want to schedule a call,
                                  or leave empty to just approve
                                </p>
                              </div>

                              <div className="flex gap-2 pt-4">
                                <Button
                                  onClick={() => {
                                    console.log('Approve & Send Zoom clicked with zoom link:', stripeLink);
                                    updateApplicationStatus(
                                      selectedApplication.id,
                                      "approved",
                                      stripeLink
                                    );
                                  }}
                                  disabled={isUpdating}
                                  className="bg-[#004d40] hover:bg-[#00695c]"
                                >
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Approve & Send Zoom
                                </Button>
                                <Button
                                  onClick={() => {
                                    updateApplicationStatus(
                                      selectedApplication.id,
                                      "rejected"
                                    );
                                  }}
                                  disabled={isUpdating}
                                  variant="destructive"
                                >
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Reject
                                </Button>
                                <Button
                                  onClick={() =>
                                    updateApplicationStatus(
                                      selectedApplication.id,
                                      "paid"
                                    )
                                  }
                                  disabled={isUpdating}
                                  className="bg-[#004d40] hover:bg-[#00695c]"
                                >
                                  <Mail className="h-4 w-4 mr-2" />
                                  Mark Paid
                                </Button>
                              </div>
                            </div>
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-8 text-gray-400">
            No applications found matching your criteria.
          </div>
        )}
      </CardContent>
    </Card>

    {/* Success Dialog */}
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="bg-gray-900 border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-white flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-400" />
            Success!
          </DialogTitle>
        </DialogHeader>
        <div className="text-white">
          <p>{successMessage}</p>
        </div>
        <div className="flex justify-end">
          <Button
            onClick={() => setShowSuccessDialog(false)}
            className="bg-[#004d40] hover:bg-[#00695c]"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
}
