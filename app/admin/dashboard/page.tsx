"use client";

import { useState } from "react";
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
  Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  const navigateToSection = (section: string) => {
    router.push(`/admin/${section}`);
  };

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
                  <p className="text-2xl font-bold text-white">24</p>
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
                  <p className="text-2xl font-bold text-yellow-400">12</p>
                </div>
                <MessageSquare className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Late Payments</p>
                  <p className="text-2xl font-bold text-red-400">3</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Monthly Revenue</p>
                  <p className="text-2xl font-bold text-green-400">$2,450</p>
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
                  <span className="text-gray-300">Recent Payments</span>
                  <Badge className="bg-green-500 text-white">5 today</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Late Payments</span>
                  <Badge className="bg-red-500 text-white">3 overdue</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Upcoming</span>
                  <Badge className="bg-blue-500 text-white">8 this week</Badge>
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
                  <Badge className="bg-yellow-500 text-white">7 new</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Approved</span>
                  <Badge className="bg-green-500 text-white">15 total</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Rejected</span>
                  <Badge className="bg-red-500 text-white">3 total</Badge>
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
                Feature Requests
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">High Priority</span>
                  <Badge className="bg-red-500 text-white">5 urgent</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Medium Priority</span>
                  <Badge className="bg-yellow-500 text-white">4 pending</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-300">Low Priority</span>
                  <Badge className="bg-green-500 text-white">3 queued</Badge>
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
                    <p className="text-white text-sm">New feature request submitted by Elite client</p>
                    <p className="text-gray-400 text-xs">2 minutes ago</p>
                  </div>
                  <Badge className="bg-red-500 text-white">High Priority</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <DollarSign className="h-5 w-5 text-green-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Payment received from Pro client</p>
                    <p className="text-gray-400 text-xs">15 minutes ago</p>
                  </div>
                  <Badge className="bg-green-500 text-white">$150</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">New application submitted</p>
                    <p className="text-gray-400 text-xs">1 hour ago</p>
                  </div>
                  <Badge className="bg-yellow-500 text-white">Pending</Badge>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-800 rounded-lg">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="flex-1">
                    <p className="text-white text-sm">Late payment detected for Starter client</p>
                    <p className="text-gray-400 text-xs">2 hours ago</p>
                  </div>
                  <Badge className="bg-red-500 text-white">Overdue</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 