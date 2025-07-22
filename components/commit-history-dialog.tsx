"use client";

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  GitCommit, 
  ExternalLink, 
  Clock, 
  User, 
  Search,
  Calendar,
  GitBranch,
  Loader2,
  X
} from 'lucide-react';
import { formatTimeAgo } from '@/lib/utils';

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

interface CommitHistoryDialogProps {
  isOpen: boolean;
  onClose: () => void;
  clientId?: string;
  repo?: string;
  branch?: string;
}

export default function CommitHistoryDialog({
  isOpen,
  onClose,
  clientId,
  repo,
  branch
}: CommitHistoryDialogProps) {
  const [commits, setCommits] = useState<Commit[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const fetchCommits = async (pageNum: number = 1, append: boolean = false) => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        per_page: '100', // Get more commits per page
        page: pageNum.toString()
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
        const newCommits = data.commits || [];
        
        if (append) {
          setCommits(prev => [...prev, ...newCommits]);
        } else {
          setCommits(newCommits);
        }
        
        // Check if we have more commits (GitHub API returns max 100 per page)
        setHasMore(newCommits.length === 100);
        setPage(pageNum);
      } else {
        setError(data.error || 'Failed to fetch commits');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      fetchCommits(page + 1, true);
    }
  };

  const filteredCommits = commits.filter(commit =>
    commit.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
    commit.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (commit.description && commit.description.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  useEffect(() => {
    if (isOpen) {
      fetchCommits(1, false);
    }
  }, [isOpen, clientId, repo, branch]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] bg-gray-900 border-gray-700">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-white flex items-center gap-2">
              <GitCommit className="h-5 w-5 text-[#004d40]" />
              Complete Commit History
              {repo && (
                <Badge variant="outline" className="ml-2 text-gray-300 border-gray-600">
                  <GitBranch className="h-3 w-3 mr-1" />
                  {repo}
                </Badge>
              )}
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
        </DialogHeader>

        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search commits by message, author, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          {/* Error State */}
          {error && (
            <div className="text-red-400 text-center py-4 bg-red-900/20 rounded-lg border border-red-800">
              <p>{error}</p>
            </div>
          )}

          {/* Commits List */}
          <div className="max-h-[60vh] overflow-y-auto space-y-3 pr-2">
            {filteredCommits.length === 0 && !loading && !error && (
              <div className="text-gray-400 text-center py-8">
                {searchTerm ? 'No commits match your search.' : 'No commits found.'}
              </div>
            )}

            {filteredCommits.map((commit) => (
              <div
                key={commit.id}
                className="p-4 bg-gray-800/50 rounded-lg border border-gray-700 hover:border-gray-600 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-white font-medium text-sm leading-tight">
                        {commit.summary}
                      </h4>
                      <Badge variant="secondary" className="text-xs bg-gray-700 text-gray-300">
                        {commit.id.substring(0, 7)}
                      </Badge>
                    </div>
                    
                    {commit.description && (
                      <p className="text-gray-400 text-xs mb-3 whitespace-pre-wrap">
                        {commit.description}
                      </p>
                    )}
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{commit.author.name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>{formatDate(commit.date)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        <span>{formatTimeAgo(commit.date)}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
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

            {/* Loading More Indicator */}
            {loading && (
              <div className="flex items-center justify-center py-4">
                <Loader2 className="h-6 w-6 animate-spin text-[#004d40]" />
                <span className="ml-2 text-gray-400">Loading commits...</span>
              </div>
            )}
          </div>

          {/* Load More Button */}
          {hasMore && !loading && (
            <div className="flex justify-center pt-4 border-t border-gray-700">
              <Button
                onClick={loadMore}
                variant="outline"
                className="text-gray-400 border-gray-600 hover:border-gray-500 hover:text-white"
              >
                Load More Commits
              </Button>
            </div>
          )}

          {/* Commit Count */}
          <div className="text-center text-sm text-gray-500 pt-2 border-t border-gray-700">
            Showing {filteredCommits.length} of {commits.length} commits
            {searchTerm && filteredCommits.length !== commits.length && (
              <span> (filtered from {commits.length} total)</span>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 