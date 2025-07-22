"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { 
  GitBranch, 
  Settings, 
  Save, 
  TestTube, 
  ExternalLink,
  User,
  Mail
} from 'lucide-react';
import Header from '@/components/header';
import Footer from '@/components/footer';

interface Client {
  id: string;
  email: string;
  full_name: string | null;
  project_status: string;
  github_repo: string | null;
  github_branch: string | null;
  github_enabled: boolean;
}

export default function AdminClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingClient, setEditingClient] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    github_repo: '',
    github_branch: 'main',
    github_enabled: false
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/admin/clients');
      if (response.ok) {
        const data = await response.json();
        setClients(data.clients || []);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (client: Client) => {
    setEditingClient(client.id);
    setEditForm({
      github_repo: client.github_repo || '',
      github_branch: client.github_branch || 'main',
      github_enabled: client.github_enabled || false
    });
  };

  const handleSave = async (clientId: string) => {
    try {
      const response = await fetch(`/api/admin/clients/${clientId}/github`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        await fetchClients();
        setEditingClient(null);
      } else {
        console.error('Failed to update client');
      }
    } catch (error) {
      console.error('Error updating client:', error);
    }
  };

  const testGitHubConnection = async (clientId: string) => {
    try {
      const response = await fetch(`/api/github/commits?client_id=${clientId}&per_page=1`);
      if (response.ok) {
        alert('GitHub connection successful!');
      } else {
        alert('GitHub connection failed. Check repository name and ensure it\'s public.');
      }
    } catch (error) {
      alert('Error testing GitHub connection');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#004d40] mx-auto mb-4"></div>
          <p>Loading clients...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      <Header />
      
      <main className="flex-1 pt-20 pb-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold mb-2">Client Management</h1>
              <p className="text-gray-300">Manage GitHub repository settings for each client</p>
            </div>
          </div>

          <div className="grid gap-6">
            {clients.map((client) => (
              <Card key={client.id} className="bg-gray-900 border-gray-700">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-[#004d40]" />
                      <div>
                        <div className="text-white font-semibold">
                          {client.full_name || 'Unnamed Client'}
                        </div>
                        <div className="text-gray-400 text-sm">{client.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        className={
                          client.project_status === 'approved' 
                            ? 'bg-green-500 text-white' 
                            : 'bg-yellow-500 text-white'
                        }
                      >
                        {client.project_status}
                      </Badge>
                      {client.github_enabled && (
                        <Badge className="bg-[#004d40] text-white">
                          <GitBranch className="h-3 w-3 mr-1" />
                          GitHub
                        </Badge>
                      )}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {editingClient === client.id ? (
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id={`github-enabled-${client.id}`}
                          checked={editForm.github_enabled}
                          onCheckedChange={(checked) => 
                            setEditForm(prev => ({ ...prev, github_enabled: checked }))
                          }
                        />
                        <Label htmlFor={`github-enabled-${client.id}`}>
                          Enable GitHub Integration
                        </Label>
                      </div>
                      
                      {editForm.github_enabled && (
                        <>
                          <div>
                            <Label htmlFor={`github-repo-${client.id}`}>
                              GitHub Repository
                            </Label>
                            <Input
                              id={`github-repo-${client.id}`}
                              placeholder="username/repository-name"
                              value={editForm.github_repo}
                              onChange={(e) => 
                                setEditForm(prev => ({ ...prev, github_repo: e.target.value }))
                              }
                              className="mt-1"
                            />
                            <p className="text-xs text-gray-400 mt-1">
                              Format: username/repository-name (e.g., alexrendler/fitweb)
                            </p>
                          </div>
                          
                          <div>
                            <Label htmlFor={`github-branch-${client.id}`}>
                              Branch
                            </Label>
                            <Input
                              id={`github-branch-${client.id}`}
                              placeholder="main"
                              value={editForm.github_branch}
                              onChange={(e) => 
                                setEditForm(prev => ({ ...prev, github_branch: e.target.value }))
                              }
                              className="mt-1"
                            />
                          </div>
                        </>
                      )}
                      
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSave(client.id)}
                          className="bg-[#004d40] hover:bg-[#00695c]"
                        >
                          <Save className="h-4 w-4 mr-2" />
                          Save
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setEditingClient(null)}
                        >
                          Cancel
                        </Button>
                        {editForm.github_enabled && editForm.github_repo && (
                          <Button
                            variant="outline"
                            onClick={() => testGitHubConnection(client.id)}
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Connection
                          </Button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-gray-300">
                            <strong>GitHub Repo:</strong> {client.github_repo || 'Not configured'}
                          </p>
                          {client.github_repo && (
                            <p className="text-gray-300">
                              <strong>Branch:</strong> {client.github_branch || 'main'}
                            </p>
                          )}
                        </div>
                        <Button
                          onClick={() => handleEdit(client)}
                          variant="outline"
                          size="sm"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Edit
                        </Button>
                      </div>
                      
                      {client.github_repo && (
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => testGitHubConnection(client.id)}
                          >
                            <TestTube className="h-4 w-4 mr-2" />
                            Test Connection
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => window.open(`https://github.com/${client.github_repo}`, '_blank')}
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            View Repository
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
} 