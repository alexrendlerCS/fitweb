"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Send, Loader2, AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface FeatureRequestFormProps {
  isOpen: boolean;
  onClose: () => void;
  clientEmail: string;
  subscriptionTier: string;
  onRequestSubmitted?: () => void;
}

export default function FeatureRequestForm({ 
  isOpen, 
  onClose, 
  clientEmail, 
  subscriptionTier,
  onRequestSubmitted
}: FeatureRequestFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<any>(null);
  const [formData, setFormData] = useState({
    pageUrl: "",
    feedbackType: "",
    description: "",
    priority: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.feedbackType || !formData.description || !formData.priority) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/feature-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          clientEmail,
          subscriptionTier
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setSubmittedRequest(result.featureRequest);
        setFormData({
          pageUrl: "",
          feedbackType: "",
          description: "",
          priority: ""
        });
        // Close the form dialog first, then show success dialog
        onClose();
        // Call the callback to refresh requests
        if (onRequestSubmitted) {
          onRequestSubmitted();
        }
        // Small delay to ensure form dialog is closed before showing success
        setTimeout(() => {
          console.log('Showing success dialog');
          setShowSuccessDialog(true);
        }, 100);
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to submit request');
      }
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: error instanceof Error ? error.message : "Failed to submit request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white text-xl font-bold">
              Website Development Feedback
            </DialogTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <p className="text-gray-300 text-sm mt-2">
            This form is used to give feedback, suggest edits, or report bugs for our website.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Page/Feature of the Feedback */}
          <div className="space-y-2">
            <Label htmlFor="pageUrl" className="text-white font-semibold">
              Page/Feature of the Feedback
            </Label>
            <p className="text-gray-400 text-sm">
              (e.g. <span className="text-blue-400 underline cursor-pointer">https://yourwebsite.com/trainer/dashboard</span> would be trainer dashboard)
            </p>
            <Input
              id="pageUrl"
              type="text"
              placeholder="e.g., coachkilday.com/trainer or /dashboard"
              value={formData.pageUrl}
              onChange={(e) => handleInputChange('pageUrl', e.target.value)}
              className="bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]"
            />
          </div>

          {/* Type of Feedback */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">Type of Feedback</Label>
            <RadioGroup
              value={formData.feedbackType}
              onValueChange={(value) => handleInputChange('feedbackType', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="edit" id="edit" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="edit" className="text-white cursor-pointer">Suggest an Edit</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="feature" id="feature" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="feature" className="text-white cursor-pointer">Request New Feature</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="bug" id="bug" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="bug" className="text-white cursor-pointer">Bug/Issue</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="comment" id="comment" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="comment" className="text-white cursor-pointer">General Comment</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Feature Request Warning */}
          {formData.feedbackType === 'feature' && (
            <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-400 mt-0.5 flex-shrink-0" />
                <div className="text-yellow-100">
                  <h4 className="font-semibold mb-2">Additional Features May Incur Costs</h4>
                  <p className="text-sm text-yellow-200 leading-relaxed">
                    New features typically cost additional money. The typical price of a new feature is no more than $250. 
                    I will review this request and provide an accurate cost before implementing and will wait for approval 
                    and agreement on the price before implementing.
                  </p>
                  <p className="text-sm text-yellow-200 leading-relaxed mt-2">
                    <strong>Tip:</strong> Feel free to suggest a price in your feedback below if you have a budget in mind!
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Describe Feedback */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white font-semibold">
              Describe Feedback
            </Label>
            <Textarea
              id="description"
              placeholder="Please provide a detailed description of your feedback, suggestion, or bug report..."
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="min-h-[120px] bg-gray-800 border-gray-600 text-white placeholder-gray-400 focus:border-[#004d40] focus:ring-[#004d40]"
              required
            />
          </div>

          {/* Priority Level */}
          <div className="space-y-3">
            <Label className="text-white font-semibold">Priority Level</Label>
            <RadioGroup
              value={formData.priority}
              onValueChange={(value) => handleInputChange('priority', value)}
              className="space-y-3"
            >
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="high" id="high" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="high" className="text-white cursor-pointer">High</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="medium" id="medium" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="medium" className="text-white cursor-pointer">Medium</Label>
              </div>
              <div className="flex items-center space-x-3">
                <RadioGroupItem value="low" id="low" className="text-[#004d40] border-gray-600" />
                <Label htmlFor="low" className="text-white cursor-pointer">Low</Label>
              </div>
            </RadioGroup>
          </div>

          {/* Subscription Tier Info */}
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <p className="text-gray-300 text-sm">
              <span className="font-semibold text-[#004d40]">Your Subscription:</span> {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}
            </p>
            <p className="text-gray-400 text-xs mt-1">
              Requests are prioritized by subscription tier (Elite → Pro → Starter) then by selected priority level.
            </p>
          </div>

          {/* Submit Button */}
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 border-red-500 text-black bg-red-500 hover:bg-red-600 hover:border-red-600"
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white shadow-lg hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

    {/* Success Dialog */}
    <Dialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
      <DialogContent className="max-w-md bg-gray-900 border-green-600">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-shrink-0">
              <CheckCircle className="h-8 w-8 text-green-400" />
            </div>
            <div>
              <DialogTitle className="text-white text-xl font-bold">
                Request Submitted Successfully!
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
            <h4 className="font-semibold text-white mb-2">Request Details:</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Type:</span>
                <span className="text-white capitalize">{submittedRequest?.feedback_type}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Priority:</span>
                <span className="text-white capitalize">{submittedRequest?.priority}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className="text-white capitalize">{submittedRequest?.status}</span>
              </div>
              {submittedRequest?.page_url && (
                <div className="flex justify-between">
                  <span className="text-gray-400">Page:</span>
                  <span className="text-white text-xs">{submittedRequest.page_url}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-600/30 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <ExternalLink className="h-5 w-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-blue-100">
                <h4 className="font-semibold mb-2">Track Your Request</h4>
                <p className="text-sm text-blue-200 leading-relaxed">
                  You can track the progress of this request in your dashboard. 
                  {submittedRequest?.feedback_type === 'feature' && (
                    <span className="block mt-1">
                      For feature requests, you'll be notified when a price estimate is ready for your approval.
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                setShowSuccessDialog(false);
              }}
              className="flex-1 bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
    </>
  );
} 