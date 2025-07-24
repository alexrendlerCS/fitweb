"use client";

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GitCommit, ExternalLink, Clock, User, History } from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';
import CommitHistoryDialog from './commit-history-dialog';

interface Commit {
  id: string;
  summary: string;
  description?: string;
  author: {
    name: string;
    email: string;
    avatar?: string;
  };
  date: string;
  url: string;
}

interface RecentUpdatesProps {
  clientId?: string;
  repo?: string;
  branch?: string;
  maxCommits?: number;
}

export default function RecentUpdates({ 
  clientId,
  repo = 'vercel/next.js', 
  branch = 'main', 
  maxCommits = 5 
}: RecentUpdatesProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showHistoryDialog, setShowHistoryDialog] = useState(false);

  useEffect(() => {
    const fetchCommits = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams({
          per_page: maxCommits.toString()
        });
        
        if (clientId) {
          params.append('client_id', clientId);
        } else if (repo && branch) {
          params.append('repo', repo);
          params.append('branch', branch);
        }
        
        const response = await fetch(`/api/github/commits?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch commits');
        }

        const data = await response.json();
        
        if (data.success) {
          setCommits(data.commits);
          // If using default repo, show a message
          if (data.useDefaultRepo) {
            console.log('Using default repository - no client-specific GitHub settings found');
          }
        } else {
          setError(data.error || 'Failed to fetch commits');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchCommits();
  }, [repo, branch, maxCommits]);

  if (loading) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-[#004d40]" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-700 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-[#004d40]" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-gray-400 text-center py-4">
            <p>Unable to load recent updates</p>
            <p className="text-sm text-gray-500 mt-1">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="bg-gray-900 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <GitCommit className="h-5 w-5 text-[#004d40]" />
            Recent Updates
          </CardTitle>
        </CardHeader>
        <CardContent>
          {commits.length === 0 ? (
            <div className="text-gray-400 text-center py-4">
              {clientId ? 'No GitHub repository configured' : 'No recent updates found'}
            </div>
          ) : (
                        <div className="space-y-4">
              {commits.map((commit) => (
                <div
                  key={commit.id}
                  className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm leading-tight mb-1">
                        {commit.summary}
                      </h4>
                      
                      {commit.description && (
                        <p className="text-gray-400 text-xs mb-2 line-clamp-2">
                          {commit.description}
                        </p>
                      )}
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="h-3 w-3" />
                          <span>{commit.author.name}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span>{formatTimeAgo(commit.date)}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {commit.id.substring(0, 7)}
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-gray-400 hover:text-white"
                        onClick={() => window.open(commit.url, '_blank')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {commits.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-700">
                              <Button
                  size="sm"
                  className="w-full bg-gradient-to-r from-[#004d40] to-[#00695c] hover:from-[#00695c] hover:to-[#004d40] text-white shadow-lg hover:shadow-xl hover:shadow-[#004d40]/30 transition-all duration-300 hover:scale-105"
                  onClick={() => setShowHistoryDialog(true)}
                >
                  <History className="h-4 w-4 mr-2" />
                  View All Commits
                </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Commit History Dialog */}
      <CommitHistoryDialog
        isOpen={showHistoryDialog}
        onClose={() => setShowHistoryDialog(false)}
        clientId={clientId}
        repo={repo}
        branch={branch}
      />
    </>
  );
} 