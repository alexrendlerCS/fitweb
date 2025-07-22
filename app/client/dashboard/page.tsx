"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar, 
  Settings, 
  MessageSquare, 
  CreditCard, 
  GitCommit,
  ExternalLink,
  LogOut
} from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useRouter } from "next/navigation";

interface Client {
  id: string;
  email: string;
  fullName: string | null;
  projectStatus: string;
}

export default function ClientDashboard() {
  const [client, setClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated
    checkAuth();
  }, []);

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

      console.log('Session found, setting mock client data');
      // Mock client data for now
      setClient({
        id: 'mock-id',
        email: 'client@example.com',
        fullName: 'John Doe',
        projectStatus: 'approved'
      });
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
            {/* Recent Commits */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <GitCommit className="h-5 w-5 text-[#004d40]" />
                  Recent Updates
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300">Added payment integration</p>
                    <p className="text-xs text-gray-500">2 hours ago</p>
                  </div>
                  <div className="p-3 bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-300">Updated client dashboard</p>
                    <p className="text-xs text-gray-500">1 day ago</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Feature Requests */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <MessageSquare className="h-5 w-5 text-[#004d40]" />
                  Feature Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button
                    asChild
                    className="w-full bg-[#004d40] hover:bg-[#00695c]"
                  >
                    <a 
                      href="https://forms.google.com/your-form-link" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2"
                    >
                      <ExternalLink className="h-4 w-4" />
                      Request New Feature
                    </a>
                  </Button>
                  <div className="text-sm text-gray-300">
                    <p>Pending: 2 requests</p>
                    <p>Completed: 5 requests</p>
                  </div>
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
    </div>
  );
} 