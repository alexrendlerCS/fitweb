/**
 * Priority scoring utility for feature requests
 * 
 * Feature requests get highest priority (scores 1-9)
 * Other request types get lower priority (scores 10-18)
 * 
 * Feature Request Ranking (1 = highest priority, 9 = lowest):
 * 1. Elite High Priority
 * 2. Pro High Priority  
 * 3. Starter High Priority
 * 4. Elite Medium Priority
 * 5. Elite Low Priority
 * 6. Pro Medium Priority
 * 7. Pro Low Priority
 * 8. Starter Medium Priority
 * 9. Starter Low Priority
 * 
 * Other Request Types Ranking (10 = highest priority, 18 = lowest):
 * 10. Elite High Priority
 * 11. Pro High Priority  
 * 12. Starter High Priority
 * 13. Elite Medium Priority
 * 14. Elite Low Priority
 * 15. Pro Medium Priority
 * 16. Pro Low Priority
 * 17. Starter Medium Priority
 * 18. Starter Low Priority
 */

export function getPriorityScore(tier: string, priority: string, feedbackType?: string): number {
  // Check if this is a feature request
  const isFeatureRequest = feedbackType === 'feature';
  
  // Define the base ranking order
  const basePriorityMap = {
    'elite-high': 1,
    'pro-high': 2,
    'starter-high': 3,
    'elite-medium': 4,
    'elite-low': 5,
    'pro-medium': 6,
    'pro-low': 7,
    'starter-medium': 8,
    'starter-low': 9
  };

  // Create composite key from tier and priority (normalize to lowercase)
  const compositeKey = `${tier.toLowerCase()}-${priority.toLowerCase()}`;
  
  // Get base score
  const baseScore = basePriorityMap[compositeKey as keyof typeof basePriorityMap] || 9;
  
  // Feature requests get priority (scores 1-9), others get lower priority (scores 10-18)
  return isFeatureRequest ? baseScore : baseScore + 9;
}

/**
 * Get priority label for display
 */
export function getPriorityLabel(tier: string, priority: string): string {
  return `${tier.charAt(0).toUpperCase() + tier.slice(1)} ${priority.charAt(0).toUpperCase() + priority.slice(1)}`;
}

/**
 * Sort function for feature requests
 * Pushes completed/declined requests to the bottom
 */
export function sortFeatureRequests<T extends { status: string; subscription_tier: string; priority: string; feedback_type: string }>(
  requests: T[]
): T[] {
  return [...requests].sort((a, b) => {
    // Push completed and declined requests to the bottom
    if (a.status === 'completed' || a.status === 'declined') {
      if (b.status !== 'completed' && b.status !== 'declined') {
        return 1; // a goes after b
      }
    } else if (b.status === 'completed' || b.status === 'declined') {
      return -1; // a goes before b
    }
    
    // For active requests, use the priority scoring
    const scoreA = getPriorityScore(a.subscription_tier, a.priority, a.feedback_type);
    const scoreB = getPriorityScore(b.subscription_tier, b.priority, b.feedback_type);
    return scoreA - scoreB; // Lower score = higher priority
  });
} 