"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  GitCommit,
  ExternalLink,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Clock,
  CheckCircle,
  AlertCircle,
  Edit,
  Plus,
  Bug,
  X,
  History,
  MessageSquare as Comment
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import RecentUpdates from "@/components/recent-updates";
import FeatureRequestForm from "@/components/feature-request-form";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  email: string;
  fullName: string | null;
  projectStatus: string;
}

interface FeatureRequest {
  id: string;
  title: string;
  description: string;
  feedback_type: string;
  priority: string;
  status: string;
  page_url?: string;
  created_at: string;
  estimated_cost?: number;
  approved_cost?: number;
  admin_notes?: string;
  price_status?: string;
}

export default function ClientDashboard() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFeatureForm, setShowFeatureForm] = useState(false);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>([]);
  const [requestCounts, setRequestCounts] = useState({ pending: 0, completed: 0, total: 0 });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadingRequests, setIsLoadingRequests] = useState(false);
  const [showAllRequestsDialog, setShowAllRequestsDialog] = useState(false);
  const [approvingRequest, setApprovingRequest] = useState<string | null>(null);
  const [currentDeclinedIndex, setCurrentDeclinedIndex] = useState(0);
  const [allRequestsFilter, setAllRequestsFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('recent');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

  useEffect(() => {
    if (client?.email) {
      fetchFeatureRequests();
    }
  }, [client?.email]);

  const fetchFeatureRequests = async () => {
    if (!client?.email) return;
    
    setIsLoadingRequests(true);
    try {
      const response = await fetch(`/api/feature-requests?email=${encodeURIComponent(client.email)}`);
      if (response.ok) {
        const data = await response.json();
        setFeatureRequests(data.featureRequests || []);
        setRequestCounts(data.counts || { pending: 0, completed: 0, total: 0 });
      }
    } catch (error) {
      console.error('Error fetching feature requests:', error);
    } finally {
      setIsLoadingRequests(false);
    }
  };

  const checkAuth = async () => {
    try {
      console.log('Checking authentication...');
      
      // Check all cookies for debugging
      console.log('All cookies:', document.cookie);
      
      // In a real app, you'd verify the session token
      // For now, we'll just check if there's a session cookie
      const hasSession = document.cookie.includes('client-session');
      console.log('Has session cookie:', hasSession);
      
      // Get email from URL params (for new users) or try to extract from session
      const urlParams = new URLSearchParams(window.location.search);
      let clientEmail = urlParams.get('email');
      
      if (!hasSession) {
        console.log('Email from URL params:', clientEmail);
        
        if (clientEmail) {
          // User just signed up, create a temporary session
          const sessionToken = Buffer.from(`temp:${Date.now()}`).toString('base64');
          document.cookie = `client-session=${sessionToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
          
          // Store email in localStorage for future sessions
          localStorage.setItem('client-email', clientEmail);
          console.log('Created temporary session for new user and stored email:', clientEmail);
          
          // Mock client data for now
          setClient({
            id: 'temp-id',
            email: clientEmail,
            fullName: 'New User',
            projectStatus: 'approved'
          });
          setIsLoading(false);
          return;
        }
        
        console.log('No session found, redirecting to status page');
        router.push('/status');
        return;
      }

      // For existing sessions, we need to get the email from the session
      if (!clientEmail) {
        // Try to get email from localStorage (temporary solution)
        const storedEmail = localStorage.getItem('client-email');
        console.log('Stored email from localStorage:', storedEmail);
        if (storedEmail) {
          clientEmail = storedEmail;
          console.log('Using stored email from localStorage:', clientEmail);
        } else {
          // If no stored email, redirect to status page to re-authenticate
          console.log('No stored email found, redirecting to status page');
          router.push('/status');
          return;
        }
      }

      console.log('Session found, fetching real client data for email:', clientEmail);
      // Fetch real client data from the session
      const response = await fetch(`/api/client/profile?email=${encodeURIComponent(clientEmail)}`);
      console.log('Client profile response status:', response.status);
      if (response.ok) {
        const data = await response.json();
        console.log('Client profile data:', data);
        setClient(data.client);
      } else {
        console.error('Failed to fetch client data');
        router.push('/status');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      router.push('/status');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    // Clear session cookie
    document.cookie = 'client-session=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    // Clear stored email
    localStorage.removeItem('client-email');
    router.push('/status');
  };

  const getFeedbackTypeIcon = (type: string) => {
    switch (type) {
      case 'edit': return <Edit className="h-4 w-4" />;
      case 'feature': return <Plus className="h-4 w-4" />;
      case 'bug': return <Bug className="h-4 w-4" />;
      case 'comment': return <Comment className="h-4 w-4" />;
      default: return <MessageSquare className="h-4 w-4" />;
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
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'declined': return <X className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const handleApprovePrice = async (requestId: string) => {
    setApprovingRequest(requestId);
    try {
      const response = await fetch('/api/feature-requests/approve-price', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId
        })
      });

      if (response.ok) {
        // Refresh the feature requests
        await fetchFeatureRequests();
      } else {
        console.error('Failed to approve price');
      }
    } catch (error) {
      console.error('Error approving price:', error);
    } finally {
      setApprovingRequest(null);
    }
  };

  const handleDeclinePrice = async (requestId: string) => {
    setApprovingRequest(requestId);
    try {
      const response = await fetch('/api/feature-requests/decline-price', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: requestId
        })
      });

      if (response.ok) {
        // Refresh the feature requests
        await fetchFeatureRequests();
      } else {
        console.error('Failed to decline price');
      }
    } catch (error) {
      console.error('Error declining price:', error);
    } finally {
      setApprovingRequest(null);
    }
  };

  const getSortedRequests = () => {
    let filtered = [...featureRequests];
    
    // Apply filters based on selected category
    switch (allRequestsFilter) {
      case 'priority':
        if (priorityFilter !== 'all') {
          filtered = filtered.filter(req => req.priority === priorityFilter);
        }
        // Sort by priority level (high, medium, low)
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return filtered.sort((a, b) => {
          const aPriority = priorityOrder[a.priority as keyof typeof priorityOrder] ?? 3;
          const bPriority = priorityOrder[b.priority as keyof typeof priorityOrder] ?? 3;
          return aPriority - bPriority;
        });
        
      case 'date':
        if (dateFilter === 'oldest') {
          return filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        } else {
          return filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        }
        
      case 'type':
        if (typeFilter !== 'all') {
          filtered = filtered.filter(req => req.feedback_type === typeFilter);
        }
        return filtered.sort((a, b) => a.feedback_type.localeCompare(b.feedback_type));
        
      case 'status':
        if (statusFilter !== 'all') {
          filtered = filtered.filter(req => req.status === statusFilter);
        }
        return filtered.sort((a, b) => a.status.localeCompare(b.status));
        
      case 'all':
      default:
        // Default priority order: in_progress, pending, completed, declined
        const statusOrder = { in_progress: 0, pending: 1, completed: 2, declined: 3 };
        return filtered.sort((a, b) => {
          const aStatus = statusOrder[a.status as keyof typeof statusOrder] ?? 4;
          const bStatus = statusOrder[b.status as keyof typeof statusOrder] ?? 4;
          return aStatus - bStatus;
        });
    }
  };

  // Pagination
  const requestsPerPage = 1;
  const totalPages = Math.ceil(featureRequests.length / requestsPerPage);
  const startIndex = (currentPage - 1) * requestsPerPage;
  const endIndex = startIndex + requestsPerPage;
  const currentRequests = featureRequests.slice(startIndex, endIndex);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d40] mx-auto mb-4"></div>
          <p>Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!client) {
    return null;
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Project Dashboard</h1>
              <p className="text-gray-300">Welcome back, {client.fullName || client.email}</p>
            </div>
            <Button
              onClick={handleLogout}
              className="bg-[#004d40] hover:bg-[#00695c] text-white"
            >
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>

          {/* Status Badge */}
          <div className="mb-8">
            <Badge className="bg-green-500 text-white">
              Project Status: {client.projectStatus}
            </Badge>
          </div>

          {/* Dashboard Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Recent Updates */}
            <RecentUpdates clientId={client.id} maxCommits={4} />

            {/* Feature Requests */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-[#004d40]" />
                  Feature Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button
                    onClick={() => setShowFeatureForm(true)}
                    className="w-full bg-[#004d40] hover:bg-[#00695c]"
                  >
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Request New Feature
                  </Button>
                  
                  {/* Request Counts */}
                  <div className="text-sm text-gray-300 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-medium">Pending:</span>
                      <span className="bg-yellow-900/30 px-2 py-1 rounded text-yellow-300">{requestCounts.pending}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-blue-400 font-medium">In Progress:</span>
                      <span className="bg-blue-900/30 px-2 py-1 rounded text-blue-300">{featureRequests.filter(req => req.status === 'in_progress').length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-green-400 font-medium">Completed:</span>
                      <span className="bg-green-900/30 px-2 py-1 rounded text-green-300">{requestCounts.completed}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-purple-400 font-medium">Total:</span>
                      <span className="bg-purple-900/30 px-2 py-1 rounded text-purple-300">{requestCounts.total}</span>
                    </div>
                  </div>

                  {/* Pending Price Approval Message */}
                  {featureRequests.filter(req => req.price_status === 'pending_approval').length > 0 && (
                    <div className="bg-yellow-900/20 border border-yellow-600/30 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-yellow-400" />
                          <span className="text-yellow-400 text-sm font-medium">
                            Price Approval Required ({featureRequests.filter(req => req.price_status === 'pending_approval').length} request{featureRequests.filter(req => req.price_status === 'pending_approval').length !== 1 ? 's' : ''})
                          </span>
                        </div>
                        <Button
                          onClick={() => {
                            const pendingRequest = featureRequests.find(req => req.price_status === 'pending_approval');
                            if (pendingRequest) {
                              setCurrentPage(Math.ceil((featureRequests.indexOf(pendingRequest) + 1) / requestsPerPage));
                            }
                          }}
                          className="bg-yellow-600 hover:bg-yellow-700 text-white text-xs py-0.5 px-4 h-6"
                        >
                          View
                        </Button>
                      </div>
                      <p className="text-gray-300 text-xs">
                        You have feature requests waiting for your price approval. Please review the estimated costs below.
                      </p>
                    </div>
                  )}

                  {/* Feature Request Cards */}
                  {isLoadingRequests ? (
                    <div className="text-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#004d40] mx-auto"></div>
                      <p className="text-gray-400 text-sm mt-2">Loading requests...</p>
                    </div>
                  ) : currentRequests.length > 0 ? (
                    <div className="space-y-3">
                      {currentRequests.map((request) => (
                        <div key={request.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              {getFeedbackTypeIcon(request.feedback_type)}
                              <h4 className="text-white font-medium text-sm">{request.title}</h4>
                            </div>
                            <div className="flex items-center gap-1">
                              <Badge className={`${getPriorityColor(request.priority)} text-white text-xs`}>
                                {request.priority}
                              </Badge>
                              <Badge className={`${getStatusColor(request.status)} text-white text-xs`}>
                                {getStatusIcon(request.status)}
                                {request.status}
                              </Badge>
                            </div>
                          </div>
                          <p className="text-gray-300 text-xs mb-2 line-clamp-2">
                            {request.description}
                          </p>
                          {request.page_url && (
                            <p className="text-gray-400 text-xs mb-2">
                              Page: {request.page_url}
                            </p>
                          )}
                          <div className="flex items-center justify-between text-xs mb-2">
                            <span className="text-gray-500">
                              {formatDate(request.created_at)}
                            </span>
                            {request.estimated_cost && (
                              <span className="text-yellow-400 font-medium">
                                Est. Cost: ${request.estimated_cost}
                              </span>
                            )}
                          </div>
                          
                          {/* Price Approval Buttons for Pending Requests */}
                          {request.price_status === 'pending_approval' && request.estimated_cost && (
                            <div className="flex gap-2 mt-2">
                              <Button
                                onClick={() => handleApprovePrice(request.id)}
                                disabled={approvingRequest === request.id}
                                className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
                              >
                                {approvingRequest === request.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                  <CheckCircle className="h-3 w-3 mr-1" />
                                )}
                                Approve ${request.estimated_cost}
                              </Button>
                              <Button
                                onClick={() => handleDeclinePrice(request.id)}
                                disabled={approvingRequest === request.id}
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1"
                              >
                                {approvingRequest === request.id ? (
                                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                                ) : (
                                  <X className="h-3 w-3 mr-1" />
                                )}
                                Decline
                              </Button>
                            </div>
                          )}
                          
                          {/* Admin Notes for Pending Requests */}
                          {request.price_status === 'pending_approval' && request.admin_notes && (
                            <div className="bg-gray-800 rounded p-2 mt-2">
                              <p className="text-gray-400 text-xs">
                                <span className="font-medium">Admin Notes:</span> {request.admin_notes}
                              </p>
                            </div>
                          )}
                          
                          {/* Approved Cost Display */}
                          {request.approved_cost && (
                            <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-2 mt-2">
                              <div className="flex items-center gap-2">
                                <CheckCircle className="h-3 w-3 text-green-400" />
                                <span className="text-green-400 text-xs font-medium">
                                  Approved Cost: ${request.approved_cost}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Decline Reason Display */}
                          {request.status === 'declined' && request.admin_notes && (
                            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-2 mt-2">
                              <div className="flex items-start gap-2">
                                <X className="h-3 w-3 text-red-400 mt-0.5" />
                                <div>
                                  <span className="text-red-400 text-xs font-medium block mb-1">
                                    Decline Reason:
                                  </span>
                                  <p className="text-red-300 text-xs">
                                    {request.admin_notes}
                                  </p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                      
                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                            disabled={currentPage === 1}
                            className="text-gray-400 hover:text-white"
                          >
                            <ChevronLeft className="h-4 w-4" />
                          </Button>
                          <span className="text-gray-400 text-sm">
                            Page {currentPage} of {totalPages}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                            disabled={currentPage === totalPages}
                            className="text-gray-400 hover:text-white"
                          >
                            <ChevronRight className="h-4 w-4" />
                          </Button>
                        </div>
                      )}

                      {/* Declined Request Message */}
                      {featureRequests.filter(req => req.status === 'declined').length > 0 && (
                        <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-3 mt-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <X className="h-4 w-4 text-red-400" />
                              <span className="text-red-400 text-sm font-medium">
                                Request Declined ({featureRequests.filter(req => req.status === 'declined').length} request{featureRequests.filter(req => req.status === 'declined').length !== 1 ? 's' : ''})
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              {featureRequests.filter(req => req.status === 'declined').length > 1 && (
                                <>
                                  <Button
                                    onClick={() => {
                                      const declinedRequests = featureRequests.filter(req => req.status === 'declined');
                                      const newIndex = Math.max(0, currentDeclinedIndex - 1);
                                      setCurrentDeclinedIndex(newIndex);
                                      const targetRequest = declinedRequests[newIndex];
                                      setCurrentPage(Math.ceil((featureRequests.indexOf(targetRequest) + 1) / requestsPerPage));
                                    }}
                                    disabled={currentDeclinedIndex === 0}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs py-0.5 px-1 h-6 disabled:opacity-50"
                                  >
                                    <ChevronLeft className="h-3 w-3" />
                                  </Button>
                                  <span className="text-red-400 text-xs whitespace-nowrap">
                                    {currentDeclinedIndex + 1} of {featureRequests.filter(req => req.status === 'declined').length}
                                  </span>
                                  <Button
                                    onClick={() => {
                                      const declinedRequests = featureRequests.filter(req => req.status === 'declined');
                                      const newIndex = Math.min(declinedRequests.length - 1, currentDeclinedIndex + 1);
                                      setCurrentDeclinedIndex(newIndex);
                                      const targetRequest = declinedRequests[newIndex];
                                      setCurrentPage(Math.ceil((featureRequests.indexOf(targetRequest) + 1) / requestsPerPage));
                                    }}
                                    disabled={currentDeclinedIndex === featureRequests.filter(req => req.status === 'declined').length - 1}
                                    className="bg-red-600 hover:bg-red-700 text-white text-xs py-0.5 px-1 h-6 disabled:opacity-50"
                                  >
                                    <ChevronRight className="h-3 w-3" />
                                  </Button>
                                </>
                              )}
                              <Button
                                onClick={() => {
                                  const declinedRequests = featureRequests.filter(req => req.status === 'declined');
                                  const targetRequest = declinedRequests[currentDeclinedIndex];
                                  if (targetRequest) {
                                    setCurrentPage(Math.ceil((featureRequests.indexOf(targetRequest) + 1) / requestsPerPage));
                                  }
                                }}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs py-0.5 px-3 h-6 ml-1"
                              >
                                View
                              </Button>
                            </div>
                          </div>
                          <p className="text-gray-300 text-xs mt-2">
                            {featureRequests.filter(req => req.status === 'declined').length > 1 
                              ? `You have ${featureRequests.filter(req => req.status === 'declined').length} declined requests. Use the arrows to navigate between them, then click "View" to see details.`
                              : "One of your feature requests has been declined. Click \"View\" to see the details."
                            }
                          </p>
                        </div>
                      )}
                      
                      {/* View All Requests Button */}
                      {featureRequests.length > 0 && (
                        <Button
                          onClick={() => setShowAllRequestsDialog(true)}
                          className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white shadow-lg hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                        >
                          <History className="h-4 w-4 mr-2" />
                          View All Requests
                        </Button>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-4">
                      <MessageSquare className="h-8 w-8 text-gray-500 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">No feature requests yet</p>
                      <p className="text-gray-500 text-xs">Submit your first request above!</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Payment History */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <CreditCard className="h-5 w-5 text-[#004d40]" />
                  Payment History
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Setup Fee</span>
                    <span className="text-sm text-green-400">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Monthly Fee</span>
                    <span className="text-sm text-green-400">Paid</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-300">Next Payment</span>
                    <span className="text-sm text-yellow-400">Due in 15 days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Settings */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Settings className="h-5 w-5 text-[#004d40]" />
                  Project Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    Update Profile
                  </Button>
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    Change Password
                  </Button>
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    View Documentation
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5 text-[#004d40]" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    Schedule Call
                  </Button>
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    Report Bug
                  </Button>
                  <Button className="w-full bg-[#004d40] hover:bg-[#00695c] text-white">
                    View Live Site
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />

                          {/* Feature Request Form Dialog */}
          {client && (
            <FeatureRequestForm
              isOpen={showFeatureForm}
              onClose={() => {
                setShowFeatureForm(false);
              }}
              onRequestSubmitted={fetchFeatureRequests}
              clientEmail={client.email}
              subscriptionTier="pro" // TODO: Get from client data
            />
          )}

          {/* All Feature Requests Dialog */}
          <Dialog open={showAllRequestsDialog} onOpenChange={setShowAllRequestsDialog}>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
              <DialogHeader>
                <div className="flex items-center justify-between mb-4">
                  <DialogTitle className="text-white flex items-center gap-2">
                    <MessageSquare className="h-5 w-5 text-[#004d40]" />
                    All Feature Requests
                    <Badge variant="outline" className="ml-2 text-gray-300 border-gray-600">
                      {featureRequests.length} requests
                    </Badge>
                  </DialogTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowAllRequestsDialog(false)}
                    className="h-8 w-8 p-0 text-gray-400 hover:text-white hover:bg-gray-800"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Filter Options */}
                <div className="flex items-center gap-4">
                  <span className="text-gray-300 text-sm">Filter by:</span>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => setAllRequestsFilter('all')}
                      className={`text-xs px-3 py-1 h-7 ${
                        allRequestsFilter === 'all'
                          ? 'bg-[#004d40] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      All
                    </Button>
                    <Button
                      onClick={() => setAllRequestsFilter('priority')}
                      className={`text-xs px-3 py-1 h-7 ${
                        allRequestsFilter === 'priority'
                          ? 'bg-[#004d40] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Priority
                    </Button>
                    <Button
                      onClick={() => setAllRequestsFilter('date')}
                      className={`text-xs px-3 py-1 h-7 ${
                        allRequestsFilter === 'date'
                          ? 'bg-[#004d40] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Date
                    </Button>
                    <Button
                      onClick={() => setAllRequestsFilter('type')}
                      className={`text-xs px-3 py-1 h-7 ${
                        allRequestsFilter === 'type'
                          ? 'bg-[#004d40] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Type
                    </Button>
                    <Button
                      onClick={() => setAllRequestsFilter('status')}
                      className={`text-xs px-3 py-1 h-7 ${
                        allRequestsFilter === 'status'
                          ? 'bg-[#004d40] text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Status
                    </Button>
                  </div>
                </div>

                {/* Filter Dropdowns */}
                {allRequestsFilter !== 'all' && (
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-gray-400 text-xs">Options:</span>
                    
                    {allRequestsFilter === 'priority' && (
                      <select
                        value={priorityFilter}
                        onChange={(e) => setPriorityFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="all">All Priorities</option>
                        <option value="high">High Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="low">Low Priority</option>
                      </select>
                    )}
                    
                    {allRequestsFilter === 'date' && (
                      <select
                        value={dateFilter}
                        onChange={(e) => setDateFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="recent">Most Recent</option>
                        <option value="oldest">Oldest First</option>
                      </select>
                    )}
                    
                    {allRequestsFilter === 'type' && (
                      <select
                        value={typeFilter}
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="all">All Types</option>
                        <option value="bug">Bug</option>
                        <option value="comment">Comment</option>
                        <option value="edit">Edit</option>
                        <option value="feature">Feature</option>
                      </select>
                    )}
                    
                    {allRequestsFilter === 'status' && (
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-600 text-white text-xs rounded px-2 py-1"
                      >
                        <option value="all">All Statuses</option>
                        <option value="completed">Completed</option>
                        <option value="declined">Declined</option>
                        <option value="in_progress">In Progress</option>
                        <option value="pending">Pending</option>
                      </select>
                    )}
                  </div>
                )}
              </DialogHeader>

              <div className="overflow-y-auto max-h-[60vh]">
                {featureRequests.length > 0 ? (
                  <div className="space-y-4">
                    {getSortedRequests().map((request) => (
                      <div key={request.id} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {getFeedbackTypeIcon(request.feedback_type)}
                            <h4 className="text-white font-medium">{request.title}</h4>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge className={`${getPriorityColor(request.priority)} text-white`}>
                              {request.priority}
                            </Badge>
                            <Badge className={`${getStatusColor(request.status)} text-white`}>
                              {getStatusIcon(request.status)}
                              {request.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <p className="text-gray-300 text-sm mb-3">
                          {request.description}
                        </p>
                        
                        {request.page_url && (
                          <p className="text-gray-400 text-sm mb-2">
                            <span className="font-medium">Page:</span> {request.page_url}
                          </p>
                        )}
                        
                        <div className="flex items-center justify-between text-gray-500 text-xs mb-2">
                          <span>Submitted: {formatDate(request.created_at)}</span>
                          <div className="flex items-center gap-4">
                            {request.estimated_cost && (
                              <span className="text-yellow-400 font-medium">
                                Est. Cost: ${request.estimated_cost}
                              </span>
                            )}
                            <span>Request ID: {request.id.slice(0, 8)}...</span>
                          </div>
                        </div>

                        {/* Price Approval Buttons for Pending Requests */}
                        {request.price_status === 'pending_approval' && request.estimated_cost && (
                          <div className="flex gap-2 mt-3">
                            <Button
                              onClick={() => handleApprovePrice(request.id)}
                              disabled={approvingRequest === request.id}
                              className="flex-1 bg-green-600 hover:bg-green-700 text-white text-xs py-1"
                            >
                              {approvingRequest === request.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              Approve ${request.estimated_cost}
                            </Button>
                            <Button
                              onClick={() => handleDeclinePrice(request.id)}
                              disabled={approvingRequest === request.id}
                              className="flex-1 bg-red-600 hover:bg-red-700 text-white text-xs py-1"
                            >
                              {approvingRequest === request.id ? (
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-white mr-1"></div>
                              ) : (
                                <X className="h-3 w-3 mr-1" />
                              )}
                              Decline
                            </Button>
                          </div>
                        )}

                        {/* Admin Notes for Pending Requests */}
                        {request.price_status === 'pending_approval' && request.admin_notes && (
                          <div className="bg-gray-700 rounded p-2 mt-2">
                            <p className="text-gray-300 text-xs">
                              <span className="font-medium">Admin Notes:</span> {request.admin_notes}
                            </p>
                          </div>
                        )}

                        {/* Approved Cost Display */}
                        {request.approved_cost && (
                          <div className="bg-green-900/20 border border-green-600/30 rounded-lg p-2 mt-2">
                            <div className="flex items-center gap-2">
                              <CheckCircle className="h-3 w-3 text-green-400" />
                              <span className="text-green-400 text-xs font-medium">
                                Approved Cost: ${request.approved_cost}
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Decline Reason Display */}
                        {request.status === 'declined' && request.admin_notes && (
                          <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-2 mt-2">
                            <div className="flex items-start gap-2">
                              <X className="h-3 w-3 text-red-400 mt-0.5" />
                              <div>
                                <span className="text-red-400 text-xs font-medium block mb-1">
                                  Decline Reason:
                                </span>
                                <p className="text-red-300 text-xs">
                                  {request.admin_notes}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <MessageSquare className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">No feature requests found</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>
        </div>
      );
    } 