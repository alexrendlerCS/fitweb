"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { 
  MessageSquare, 
  ArrowLeft,
  Search,
  Filter,
  Edit,
  Plus,
  Bug,
  MessageSquare as Comment,
  Clock,
  CheckCircle,
  AlertTriangle,
  X,
  DollarSign,
  Eye,
  ChevronDown
} from "lucide-react";
import { useRouter } from "next/navigation";

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  feedback_type: string;
  priority: string;
  status: string;
  page_url?: string;
  created_at: string;
  client_email: string;
  subscription_tier: string;
  estimated_cost?: number;
  approved_cost?: number;
  admin_notes?: string;
  price_status?: string;
}

export default function AdminRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [isDescriptionDialogOpen, setIsDescriptionDialogOpen] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [priceValue, setPriceValue] = useState<string>('');
  const [adminNotes, setAdminNotes] = useState<string>('');
  const [declineReason, setDeclineReason] = useState<string>('');
  const [showDeclineDialog, setShowDeclineDialog] = useState(false);
  const [decliningRequestId, setDecliningRequestId] = useState<string | null>(null);

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    filterRequests();
  }, [requests, searchTerm, statusFilter, priorityFilter]);

  const fetchRequests = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/admin/feature-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching requests:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterRequests = () => {
    let filtered = [...requests];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(request =>
        request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.client_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter(request => request.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== "all") {
      filtered = filtered.filter(request => request.priority === priorityFilter);
    }

    setFilteredRequests(filtered);
  };

  const getPriorityScore = (tier: string, priority: string, status: string) => {
    // If status is completed or declined, return 0 to push to bottom
    if (status === 'completed' || status === 'declined') {
      return 0;
    }
    
    const tierScores = { elite: 100, pro: 50, starter: 10 };
    const priorityScores = { high: 30, medium: 20, low: 10 };
    return (tierScores[tier as keyof typeof tierScores] || 0) + (priorityScores[priority as keyof typeof priorityScores] || 0);
  };

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const scoreA = getPriorityScore(a.subscription_tier, a.priority, a.status);
    const scoreB = getPriorityScore(b.subscription_tier, b.priority, b.status);
    return scoreB - scoreA; // Highest priority first
  });

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit className="h-4 w-4 text-white" />;
      case 'feature': return <Plus className="h-4 w-4 text-white" />;
      case 'bug': return <Bug className="h-4 w-4 text-white" />;
      case 'comment': return <Comment className="h-4 w-4 text-white" />;
      default: return <MessageSquare className="h-4 w-4 text-white" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-500';
      case 'in_progress': return 'bg-blue-500';
      case 'pending': return 'bg-yellow-500';
      case 'declined': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in_progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'declined': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'elite': return 'bg-purple-500';
      case 'pro': return 'bg-blue-500';
      case 'starter': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const truncateDescription = (description: string, maxLength: number = 50) => {
    if (description.length <= maxLength) {
      return description;
    }
    return description.substring(0, maxLength) + '...';
  };

  const handleDescriptionClick = (request: FeatureRequest) => {
    setSelectedRequest(request);
    setIsDescriptionDialogOpen(true);
  };

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    if (newStatus === 'declined') {
      setDecliningRequestId(requestId);
      setShowDeclineDialog(true);
      return;
    }

    setUpdatingStatus(requestId);
    try {
      const response = await fetch('/api/admin/feature-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          status: newStatus
        })
      });

      if (response.ok) {
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { ...request, status: newStatus }
              : request
          )
        );
      } else {
        console.error('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleDeclineWithReason = async () => {
    if (!decliningRequestId || !declineReason.trim()) {
      alert('Please provide a reason for declining the request');
      return;
    }

    setUpdatingStatus(decliningRequestId);
    try {
      const response = await fetch('/api/admin/feature-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: decliningRequestId,
          status: 'declined',
          admin_notes: declineReason.trim()
        })
      });

      if (response.ok) {
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === decliningRequestId 
              ? { ...request, status: 'declined', admin_notes: declineReason.trim() }
              : request
          )
        );
        setShowDeclineDialog(false);
        setDeclineReason('');
        setDecliningRequestId(null);
      } else {
        console.error('Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleCancelDecline = () => {
    setShowDeclineDialog(false);
    setDeclineReason('');
    setDecliningRequestId(null);
  };

  const handlePriceEdit = (request: FeatureRequest) => {
    setEditingPrice(request.id);
    setPriceValue(request.estimated_cost?.toString() || '250');
    setAdminNotes(request.admin_notes || '');
  };

  const handlePriceSave = async (requestId: string) => {
    if (!priceValue || isNaN(Number(priceValue))) {
      alert('Please enter a valid price');
      return;
    }

    try {
      const response = await fetch('/api/admin/feature-requests', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId,
          estimated_cost: Number(priceValue),
          admin_notes: adminNotes,
          price_status: 'pending_approval'
        })
      });

      if (response.ok) {
        // Update the local state
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { 
                  ...request, 
                  estimated_cost: Number(priceValue),
                  admin_notes: adminNotes,
                  price_status: 'pending_approval'
                }
              : request
          )
        );
        setEditingPrice(null);
        setPriceValue('');
        setAdminNotes('');
      } else {
        console.error('Failed to update price');
      }
    } catch (error) {
      console.error('Error updating price:', error);
    }
  };

  const handlePriceCancel = () => {
    setEditingPrice(null);
    setPriceValue('');
    setAdminNotes('');
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-3xl font-bold">Feature Requests</h1>
                <p className="text-gray-400 mt-1">Manage and prioritize client requests</p>
              </div>
            </div>
            <Badge className="bg-green-500 text-white">
              {sortedRequests.length} requests
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Filters */}
        <Card className="bg-gray-900 border-gray-700 mb-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filters & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search requests..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="declined">Declined</option>
              </select>
              
              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className="bg-gray-800 border border-gray-600 text-white rounded-md px-3 py-2"
              >
                <option value="all">All Priority</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
              
              <Button
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setPriorityFilter("all");
                }}
                className="bg-[#004d40] hover:bg-[#00695c] text-white"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Pending Price Approval Section */}
        {sortedRequests.filter(req => req.price_status === 'pending_estimate').length > 0 && (
          <Card className="bg-gray-900 border-yellow-600 mb-6">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-400" />
                Pending Price Approval ({sortedRequests.filter(req => req.price_status === 'pending_estimate').length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sortedRequests
                  .filter(req => req.price_status === 'pending_estimate')
                  .map((request) => (
                    <div key={request.id} className="bg-gray-800 rounded-lg p-4 border border-yellow-600/30 shadow-lg shadow-yellow-600/10">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                              {request.priority}
                            </Badge>
                            <Badge className={`${getTierColor(request.subscription_tier)} text-white`}>
                              {request.subscription_tier}
                            </Badge>
                            <span className="text-sm text-gray-400">{request.client_email}</span>
                          </div>
                          <h3 className="font-medium text-white mb-1">{request.title}</h3>
                          <p className="text-sm text-gray-400 mb-3">
                            {truncateDescription(request.description, 100)}
                          </p>
                          
                          {editingPrice === request.id ? (
                            <div className="space-y-3">
                              <div className="flex gap-3">
                                <div className="flex-1">
                                  <label className="text-sm text-gray-300 mb-1 block">Estimated Cost ($)</label>
                                  <Input
                                    type="number"
                                    value={priceValue}
                                    onChange={(e) => setPriceValue(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="250"
                                  />
                                </div>
                                <div className="flex-1">
                                  <label className="text-sm text-gray-300 mb-1 block">Admin Notes</label>
                                  <Input
                                    value={adminNotes}
                                    onChange={(e) => setAdminNotes(e.target.value)}
                                    className="bg-gray-700 border-gray-600 text-white"
                                    placeholder="Explain the pricing..."
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => handlePriceSave(request.id)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  Save & Send for Approval
                                </Button>
                                <Button
                                  onClick={handlePriceCancel}
                                  className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="text-sm text-gray-300">
                                  <span className="text-yellow-400 font-medium">${request.estimated_cost}</span> estimated
                                </p>
                                {request.admin_notes && (
                                  <p className="text-xs text-gray-400 mt-1">{request.admin_notes}</p>
                                )}
                              </div>
                              <Button
                                onClick={() => handlePriceEdit(request)}
                                size="sm"
                                className="bg-green-600 hover:bg-green-700 text-white"
                              >
                                Edit Price
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Requests Table */}
        <Card className="bg-gray-900 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">All Feature Requests (Sorted by Priority)</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#004d40] mx-auto"></div>
                <p className="text-gray-400 mt-2">Loading requests...</p>
              </div>
            ) : sortedRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Priority</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Type</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Title</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Client</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Tier</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Status</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Cost</th>
                      <th className="text-left py-3 px-4 text-gray-300 font-medium">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                                         {sortedRequests.map((request) => (
                       <tr key={request.id} className={`border-b border-gray-800 hover:bg-gray-800/50 transition-all duration-200 ${
                         request.status === 'pending' || request.status === 'in_progress' || request.price_status === 'pending_estimate'
                           ? 'bg-gray-800/30 border-l-4 border-l-[#004d40] shadow-sm' 
                           : 'opacity-60'
                       }`}>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                              {request.priority}
                            </Badge>
                            <span className="text-xs text-gray-400">
                              ({getPriorityScore(request.subscription_tier, request.priority)})
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-2">
                            {getFeedbackTypeIcon(request.feedback_type)}
                            <span className="text-sm text-white">{request.feedback_type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-white">{request.title}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <p 
                                className={`text-sm text-gray-400 max-w-xs cursor-pointer hover:text-white transition-colors ${
                                  request.description.length > 50 ? 'hover:underline' : ''
                                }`}
                                onClick={() => handleDescriptionClick(request)}
                              >
                                {truncateDescription(request.description, 50)}
                              </p>
                              {request.description.length > 50 && (
                                <Eye className="h-3 w-3 text-gray-500 hover:text-white cursor-pointer" />
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-white">{request.client_email}</p>
                        </td>
                        <td className="py-4 px-4">
                          <Badge className={`${getTierColor(request.subscription_tier)} text-white`}>
                            {request.subscription_tier}
                          </Badge>
                        </td>
                                                 <td className="py-4 px-4">
                           <DropdownMenu>
                             <DropdownMenuTrigger asChild>
                               <Button
                                 variant="ghost"
                                 className={`p-0 h-auto ${updatingStatus === request.id ? 'opacity-50' : ''}`}
                                 disabled={updatingStatus === request.id}
                               >
                                 <Badge className={`${getStatusColor(request.status)} text-white cursor-pointer hover:opacity-80 transition-opacity ${
                                   request.status === 'pending' || request.status === 'in_progress' || request.price_status === 'pending_estimate'
                                     ? 'ring-2 ring-[#004d40] ring-opacity-50 shadow-lg' 
                                     : ''
                                 }`}>
                                   {updatingStatus === request.id ? (
                                     <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                   ) : (
                                     getStatusIcon(request.status)
                                   )}
                                   {request.status}
                                   <ChevronDown className="h-3 w-3 ml-1" />
                                 </Badge>
                               </Button>
                             </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-gray-800 border-gray-600">
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(request.id, 'pending')}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <AlertTriangle className="h-4 w-4 mr-2 text-yellow-400" />
                                Pending
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(request.id, 'in_progress')}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <Clock className="h-4 w-4 mr-2 text-blue-400" />
                                In Progress
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(request.id, 'completed')}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                                Completed
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleStatusChange(request.id, 'declined')}
                                className="text-white hover:bg-gray-700 cursor-pointer"
                              >
                                <X className="h-4 w-4 mr-2 text-red-400" />
                                Declined
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-1">
                            {request.estimated_cost && (
                              <span className="text-yellow-400 text-sm">
                                Est: ${request.estimated_cost}
                              </span>
                            )}
                            {request.approved_cost && (
                              <span className="text-green-400 text-sm">
                                App: ${request.approved_cost}
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <p className="text-sm text-gray-400">
                            {formatDate(request.created_at)}
                          </p>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <p className="text-gray-400">No feature requests found</p>
                <p className="text-gray-500 text-sm">Try adjusting your filters</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Description Dialog */}
      <Dialog open={isDescriptionDialogOpen} onOpenChange={setIsDescriptionDialogOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-[#004d40]" />
              Feature Request Details
            </DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-white mb-2">Title</h3>
                <p className="text-gray-300">{selectedRequest.title}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Description</h3>
                <p className="text-gray-300 whitespace-pre-wrap">{selectedRequest.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-white mb-2">Client</h3>
                  <p className="text-gray-300">{selectedRequest.client_email}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Subscription Tier</h3>
                  <Badge className={`${getTierColor(selectedRequest.subscription_tier)} text-white`}>
                    {selectedRequest.subscription_tier}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Priority</h3>
                  <Badge className={`${getPriorityColor(selectedRequest.priority)} text-white`}>
                    {selectedRequest.priority}
                  </Badge>
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-2">Status</h3>
                  <Badge className={`${getStatusColor(selectedRequest.status)} text-white`}>
                    {selectedRequest.status}
                  </Badge>
                </div>
              </div>
              
              {selectedRequest.page_url && (
                <div>
                  <h3 className="font-semibold text-white mb-2">Page URL</h3>
                  <p className="text-gray-300 break-all">{selectedRequest.page_url}</p>
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                {selectedRequest.estimated_cost && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Estimated Cost</h3>
                    <p className="text-yellow-400">${selectedRequest.estimated_cost}</p>
                  </div>
                )}
                {selectedRequest.approved_cost && (
                  <div>
                    <h3 className="font-semibold text-white mb-2">Approved Cost</h3>
                    <p className="text-green-400">${selectedRequest.approved_cost}</p>
                  </div>
                )}
              </div>
              
              <div>
                <h3 className="font-semibold text-white mb-2">Submitted</h3>
                <p className="text-gray-300">{formatDate(selectedRequest.created_at)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Decline Reason Dialog */}
      <Dialog open={showDeclineDialog} onOpenChange={setShowDeclineDialog}>
        <DialogContent className="bg-gray-900 border-gray-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <X className="h-5 w-5 text-red-400" />
              Decline Feature Request
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-300 mb-2 block">
                Reason for Declining *
              </label>
              <Textarea
                value={declineReason}
                onChange={(e) => setDeclineReason(e.target.value)}
                placeholder="Please provide a reason for declining this feature request..."
                className="bg-gray-800 border-gray-600 text-white min-h-[100px]"
                required
              />
            </div>
            <div className="flex gap-2 justify-end">
              <Button
                onClick={handleCancelDecline}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeclineWithReason}
                disabled={!declineReason.trim() || updatingStatus === decliningRequestId}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {updatingStatus === decliningRequestId ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                ) : null}
                Decline Request
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 