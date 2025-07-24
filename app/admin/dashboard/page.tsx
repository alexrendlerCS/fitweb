"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  CreditCard, 
  MessageSquare, 
  FileText,
  DollarSign,
  Clock,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  Calendar,
  Loader2
} from "lucide-react";
import { useRouter } from "next/navigation";

interface DashboardStats {
  applications: {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    paid: number;
    byTier: {
      starter: number;
      pro: number;
      elite: number;
    };
  };
  requests: {
    total: number;
    pending: number;
    inProgress: number;
    completed: number;
    declined: number;
    byPriority: {
      high: number;
      medium: number;
      low: number;
    };
    byTier: {
      starter: number;
      pro: number;
      elite: number;
    };
  };
  clients: {
    total: number;
    byTier: {
      starter: number;
      pro: number;
      elite: number;
    };
  };
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/admin/dashboard-stats');
      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      } else {
        setError('Failed to fetch dashboard statistics');
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const navigateToSection = (section: string) => {
    router.push(`/admin/${section}`);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-[#004d40]" />
          <p className="text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 mx-auto mb-4 text-red-400" />
          <p className="text-red-400 mb-4">{error}</p>
          <Button onClick={fetchDashboardStats} className="bg-[#004d40] hover:bg-[#00695c]">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="bg-gray-900 border-b border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Admin Dashboard</h1>
              <p className="text-gray-400 mt-1">Manage clients, payments, and requests</p>
            </div>
            <Badge className="bg-green-500 text-white">
              Admin Access
            </Badge>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Clients</p>
                  <p className="text-2xl font-bold text-white">{stats?.clients.total || 0}</p>
                </div>
                <Users className="h-8 w-8 text-[#004d40]" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Requests</p>
                  <p className="text-2xl font-bold text-yellow-400">{stats?.requests.pending || 0}</p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Pending Applications</p>
                  <p className="text-2xl font-bold text-red-400">{stats?.applications.pending || 0}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Applications</p>
                  <p className="text-2xl font-bold text-green-400">{stats?.applications.total || 0}</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Client Payments */}
          <Card className="bg-gray-900 border-gray-700 hover:border-[#004d40] transition-colors cursor-pointer" onClick={() => navigateToSection('payments')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <CreditCard className="h-6 w-6 text-[#004d40]" />
                Client Payments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Total Clients</span>
                  <Badge className="bg-green-500 text-white">{stats?.clients.total || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Elite Clients</span>
                  <Badge className="bg-purple-500 text-white">{stats?.clients.byTier.elite || 0}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Pro Clients</span>
                  <Badge className="bg-blue-500 text-white">{stats?.clients.byTier.pro || 0}</Badge>
                </div>
                <Button className="w-full bg-[#004d40] hover:bg-[#00695c] mt-4">
                  Manage Payments
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Applications */}
          <Card className="bg-gray-900 border-gray-700 hover:border-[#004d40] transition-colors cursor-pointer" onClick={() => navigateToSection('applications')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <FileText className="h-6 w-6 text-[#004d40]" />
                Applications
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Pending Review</span>
                  <Badge className="bg-yellow-500 text-white">{stats?.applications.pending || 0} new</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Approved</span>
                  <Badge className="bg-green-500 text-white">{stats?.applications.approved || 0} total</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rejected</span>
                  <Badge className="bg-red-500 text-white">{stats?.applications.rejected || 0} total</Badge>
                </div>
                <Button className="w-full bg-[#004d40] hover:bg-[#00695c] mt-4">
                  Review Applications
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Feature Requests */}
          <Card className="bg-gray-900 border-gray-700 hover:border-[#004d40] transition-colors cursor-pointer" onClick={() => navigateToSection('requests')}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <MessageSquare className="h-6 w-6 text-[#004d40]" />
                Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">High Priority</span>
                  <Badge className="bg-red-500 text-white">{stats?.requests.byPriority.high || 0} urgent</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Medium Priority</span>
                  <Badge className="bg-yellow-500 text-white">{stats?.requests.byPriority.medium || 0} pending</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Low Priority</span>
                  <Badge className="bg-green-500 text-white">{stats?.requests.byPriority.low || 0} queued</Badge>
                </div>
                <Button className="w-full bg-[#004d40] hover:bg-[#00695c] mt-4">
                  Manage Requests
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="mt-8">
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Dashboard updated with real-time statistics</p>
                    <p className="text-gray-400 text-xs">Just now</p>
                  </div>
                  <Badge className="bg-green-500 text-white">Live Data</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Feature requests: {stats?.requests.total || 0} total</p>
                    <p className="text-gray-400 text-xs">Updated just now</p>
                  </div>
                  <Badge className="bg-blue-500 text-white">{stats?.requests.pending || 0} pending</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-yellow-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Applications: {stats?.applications.total || 0} total</p>
                    <p className="text-gray-400 text-xs">Updated just now</p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">{stats?.applications.pending || 0} pending</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <Users className="h-5 w-5 text-purple-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Clients: {stats?.clients.total || 0} total</p>
                    <p className="text-gray-400 text-xs">Updated just now</p>
                  </div>
                  <Badge className="bg-purple-500 text-white">{stats?.clients.byTier.elite || 0} elite</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 