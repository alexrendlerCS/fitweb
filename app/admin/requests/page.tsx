"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  DollarSign
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
}

export default function AdminRequests() {
  const router = useRouter();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [filteredRequests, setFilteredRequests] = useState<FeatureRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

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

  const getPriorityScore = (tier: string, priority: string) => {
    const tierScores = { elite: 100, pro: 50, starter: 10 };
    const priorityScores = { high: 30, medium: 20, low: 10 };
    return (tierScores[tier as keyof typeof tierScores] || 0) + (priorityScores[priority as keyof typeof priorityScores] || 0);
  };

  const sortedRequests = [...filteredRequests].sort((a, b) => {
    const scoreA = getPriorityScore(a.subscription_tier, a.priority);
    const scoreB = getPriorityScore(b.subscription_tier, b.priority);
    return scoreB - scoreA; // Highest priority first
  });

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
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800"
              >
                Clear Filters
              </Button>
            </div>
          </CardContent>
        </Card>

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
                      <tr key={request.id} className="border-b border-gray-800 hover:bg-gray-800/50">
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
                            <span className="text-sm">{request.feedback_type}</span>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <p className="font-medium text-white">{request.title}</p>
                            <p className="text-sm text-gray-400 line-clamp-1 max-w-xs">
                              {request.description}
                            </p>
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
                          <Badge className={`${getStatusColor(request.status)} text-white`}>
                            {getStatusIcon(request.status)}
                            {request.status}
                          </Badge>
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
    </div>
  );
} 