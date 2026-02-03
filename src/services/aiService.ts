// AI Service - Gemini API Integration for personalized recommendations
import type { Activity, EmissionStats } from '../types';
import { ACTIVITY_LABELS, CATEGORY_LABELS } from '../types';
import { formatEmission } from '../utils/emissionCalculator';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Generate personalized recommendations based on user's emission data
 */
export async function getRecommendations(
  stats: EmissionStats,
  activities: Activity[]
): Promise<string[]> {
  // If no API key, return default recommendations
  if (!GEMINI_API_KEY) {
    return getDefaultRecommendations(stats, activities);
  }

  try {
    const prompt = buildRecommendationPrompt(stats, activities);
    const response = await callGeminiAPI(prompt);
    return parseRecommendations(response);
  } catch (error) {
    console.error('Error getting AI recommendations:', error);
    return getDefaultRecommendations(stats, activities);
  }
}

/**
 * Chat with AI for carbon footprint advice
 */
export async function chatWithAI(
  message: string,
  history: ChatMessage[],
  stats: EmissionStats
): Promise<string> {
  // If no API key, return helpful default response
  if (!GEMINI_API_KEY) {
    return getDefaultChatResponse(message, stats);
  }

  try {
    const context = buildChatContext(stats);
    const prompt = `${context}\n\nConversation history:\n${history.map(m => `${m.role}: ${m.content}`).join('\n')}\n\nUser: ${message}\n\nAssistant:`;
    
    const response = await callGeminiAPI(prompt);
    return response;
  } catch (error) {
    console.error('Error in AI chat:', error);
    return getDefaultChatResponse(message, stats);
  }
}

/**
 * Call Gemini API
 */
async function callGeminiAPI(prompt: string): Promise<string> {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 1024,
        },
      }),
    }
  );

  if (!response.ok) {
    throw new Error('API request failed');
  }

  const data = await response.json();
  return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
}

/**
 * Build prompt for recommendations
 */
function buildRecommendationPrompt(stats: EmissionStats, activities: Activity[]): string {
  const recentActivities = activities.slice(0, 10).map(a => 
    `${ACTIVITY_LABELS[a.type]}: ${a.value} ${a.unit} (${formatEmission(a.emission)})`
  ).join('\n');

  return `You are a carbon footprint reduction advisor. Based on the user's emission data, provide 5 specific, actionable recommendations.

User's Monthly Emissions: ${formatEmission(stats.monthly)}
- Transportation: ${formatEmission(stats.byCategory.transport)}
- Energy: ${formatEmission(stats.byCategory.energy)}
- Diet: ${formatEmission(stats.byCategory.diet)}

Recent Activities:
${recentActivities}

Provide exactly 5 personalized recommendations. Each should be specific, practical, and include an estimated CO2 savings. Format each recommendation on a new line starting with a number.`;
}

/**
 * Build context for chat
 */
function buildChatContext(stats: EmissionStats): string {
  return `You are EcoBot, a friendly carbon footprint advisor. Help users reduce their environmental impact.

User's Current Monthly Emissions: ${formatEmission(stats.monthly)}
- Transportation: ${formatEmission(stats.byCategory.transport)}
- Energy: ${formatEmission(stats.byCategory.energy)}
- Diet: ${formatEmission(stats.byCategory.diet)}

Be helpful, encouraging, and provide specific advice. Keep responses concise and actionable.`;
}

/**
 * Parse recommendations from AI response
 */
function parseRecommendations(response: string): string[] {
  const lines = response.split('\n').filter(line => line.trim());
  const recommendations: string[] = [];
  
  for (const line of lines) {
    const cleaned = line.replace(/^\d+[\.\)]\s*/, '').trim();
    if (cleaned.length > 20) {
      recommendations.push(cleaned);
    }
  }
  
  return recommendations.slice(0, 5);
}

/**
 * Default recommendations when API is not available
 */
function getDefaultRecommendations(stats: EmissionStats, activities: Activity[]): string[] {
  const recommendations: string[] = [];
  
  // Transport recommendations
  if (stats.byCategory.transport > 50) {
    recommendations.push('Consider carpooling or using public transport for your daily commute. This could reduce your transport emissions by up to 50%.');
    recommendations.push('For short trips under 5km, try cycling or walking instead of driving. You can save about 1kg CO2 per trip.');
  }
  
  // Energy recommendations
  if (stats.byCategory.energy > 100) {
    recommendations.push('Switch to LED bulbs and turn off lights when leaving rooms. This simple change can reduce your electricity usage by 15%.');
    recommendations.push('Consider lowering your thermostat by 2°C. This can reduce heating emissions by up to 10%.');
  }
  
  // Diet recommendations
  if (stats.byCategory.diet > 30) {
    recommendations.push('Try having 2-3 meat-free days per week. Replacing beef with plant-based meals can save up to 4.5kg CO2 per meal.');
    recommendations.push('Reduce food waste by planning meals ahead. About 8% of global emissions come from wasted food.');
  }
  
  // General recommendations
  recommendations.push('Track your emissions daily to build awareness and identify opportunities for improvement.');
  recommendations.push('Set a monthly carbon budget goal and challenge yourself to stay under it.');
  
  return recommendations.slice(0, 5);
}

/**
 * Default chat responses when API is not available
 */
function getDefaultChatResponse(message: string, stats: EmissionStats): string {
  const lowerMessage = message.toLowerCase();
  
  if (lowerMessage.includes('transport') || lowerMessage.includes('car') || lowerMessage.includes('drive')) {
    return `Based on your transport emissions of ${formatEmission(stats.byCategory.transport)} this month, here are some tips:\n\n• Use public transport when possible - buses emit about 60% less CO2 per passenger-km than cars\n• Consider carpooling to share the emissions\n• For short distances, walking or cycling produces zero emissions\n• If buying a new car, consider an electric or hybrid vehicle`;
  }
  
  if (lowerMessage.includes('energy') || lowerMessage.includes('electricity') || lowerMessage.includes('power')) {
    return `Your energy emissions are ${formatEmission(stats.byCategory.energy)} this month. Here's how to reduce them:\n\n• Switch to a renewable energy provider if available\n• Use LED bulbs - they use 75% less energy\n• Unplug devices when not in use\n• Set your thermostat 1-2°C lower in winter`;
  }
  
  if (lowerMessage.includes('food') || lowerMessage.includes('diet') || lowerMessage.includes('eat') || lowerMessage.includes('meat')) {
    return `Your diet emissions are ${formatEmission(stats.byCategory.diet)} this month. Tips for lower-carbon eating:\n\n• Beef has the highest carbon footprint - try replacing it with chicken or plant-based alternatives\n• Eat seasonal and local produce when possible\n• Reduce food waste by planning meals\n• Try having one or two meat-free days per week`;
  }
  
  if (lowerMessage.includes('goal') || lowerMessage.includes('target') || lowerMessage.includes('reduce')) {
    return `Great question! The average person's carbon footprint is about 4-8 tonnes per year. Here's how to set meaningful goals:\n\n• Start by reducing 10% from your current emissions\n• Focus on your highest emission category first\n• Small daily changes add up over time\n• Currently you're at ${formatEmission(stats.monthly)} this month`;
  }
  
  return `I'm here to help you reduce your carbon footprint! Your current monthly emissions are ${formatEmission(stats.monthly)}.\n\nYou can ask me about:\n• Transportation alternatives\n• Energy saving tips\n• Low-carbon diet choices\n• Setting reduction goals\n\nWhat would you like to know more about?`;
}
