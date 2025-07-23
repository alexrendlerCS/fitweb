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
      
      if (!hasSession) {
        // Check if we can get client info from URL params or localStorage
        const urlParams = new URLSearchParams(window.location.search);
        const clientEmail = urlParams.get('email');
        console.log('Email from URL params:', clientEmail);
        
        if (clientEmail) {
          // User just signed up, create a temporary session
          const sessionToken = Buffer.from(`temp:${Date.now()}`).toString('base64');
          document.cookie = `client-session=${sessionToken}; path=/; max-age=${60 * 60 * 24 * 7}`;
          console.log('Created temporary session for new user');
          
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

      console.log('Session found, fetching real client data');
      // Fetch real client data from the session
      const response = await fetch('/api/client/profile');
      if (response.ok) {
        const data = await response.json();
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
                  <div className="text-sm text-gray-300 space-y-1">
                    <p>Pending: {requestCounts.pending} requests</p>
                    <p>Completed: {requestCounts.completed} requests</p>
                    <p>Total: {requestCounts.total} requests</p>
                  </div>

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
                fetchFeatureRequests(); // Refresh requests after form closes
              }}
              clientEmail={client.email}
              subscriptionTier="pro" // TODO: Get from client data
            />
          )}

          {/* All Feature Requests Dialog */}
          <Dialog open={showAllRequestsDialog} onOpenChange={setShowAllRequestsDialog}>
            <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
              <DialogHeader>
                <div className="flex items-center justify-between">
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
              </DialogHeader>

              <div className="overflow-y-auto max-h-[60vh]">
                {featureRequests.length > 0 ? (
                  <div className="space-y-4">
                    {featureRequests.map((request) => (
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
                        
                        <div className="flex items-center justify-between text-gray-500 text-xs">
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