import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const clientId = searchParams.get('client_id');
    const perPage = searchParams.get('per_page') || '10';
    const page = searchParams.get('page') || '1';

    let repo = 'vercel/next.js'; // Default fallback
    let branch = 'main';
    let useDefaultRepo = true;

    // If client_id is provided, fetch their GitHub settings
    if (clientId && clientId !== 'mock-id' && clientId !== 'temp-session') {
      const { data: client, error } = await supabase
        .from('clients')
        .select('github_repo, github_branch, github_enabled')
        .eq('id', clientId)
        .single();

      if (error) {
        console.error('Error fetching client GitHub settings:', error);
      } else if (client && client.github_enabled && client.github_repo) {
        repo = client.github_repo;
        branch = client.github_branch || 'main';
        useDefaultRepo = false;
        console.log(`Using client GitHub repo: ${repo} (branch: ${branch})`);
      } else {
        console.log('No client-specific GitHub settings found, returning empty commits');
        // Return empty commits instead of using default repo
        return NextResponse.json({
          success: true,
          commits: [],
          repo: null,
          branch: null,
          useDefaultRepo: false
        });
      }
    }

    // GitHub API endpoint for commits
    const url = `https://api.github.com/repos/${repo}/commits?sha=${branch}&per_page=${perPage}&page=${page}`;
    console.log(`Fetching commits from: ${url} (page ${page})`);

    const response = await fetch(url, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'FitWeb-Client-Dashboard',
        // Add GitHub token if you have one for higher rate limits
        ...(process.env.GITHUB_TOKEN && {
          'Authorization': `token ${process.env.GITHUB_TOKEN}`
        })
      }
    });

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Repository not found: ${repo}. Please check the repository name and ensure it's public.`);
      }
      throw new Error(`GitHub API error: ${response.status} - ${response.statusText}`);
    }

    const commits = await response.json();

    // Transform the data to be more useful for the frontend
    const formattedCommits = commits.map((commit: any) => ({
      id: commit.sha,
      message: commit.commit.message,
      author: {
        name: commit.commit.author.name,
        email: commit.commit.author.email,
        avatar: commit.author?.avatar_url
      },
      date: commit.commit.author.date,
      url: commit.html_url,
      // Extract the first line as summary (before first newline)
      summary: commit.commit.message.split('\n')[0],
      // Get the rest as description (if any)
      description: commit.commit.message.split('\n').slice(1).join('\n').trim() || null
    }));

    return NextResponse.json({
      success: true,
      commits: formattedCommits,
      repo,
      branch,
      useDefaultRepo
    });

  } catch (error) {
    console.error('Error fetching GitHub commits:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch commits',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 