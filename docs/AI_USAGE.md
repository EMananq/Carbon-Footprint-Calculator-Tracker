# AI Usage Report

## AI Tools Integrated

**Google Gemini API (gemini-pro)**

## Implementation Details

We integrated the Google Gemini API to provide intelligent, context-aware carbon reduction advice.

### Features using AI:

1. **Personalized Recommendations**:
   - The system analyzes the user's monthly emission stats across categories (Transport, Energy, Diet).
   - Generates 5 specific, actionable tips tailored to their highest emission sources.

2. **EcoBot Chatbot**:
   - An interactive assistant that answers questions about sustainability.
   - Maintains conversation history for context-aware responses.

## Code Structure

- `src/services/aiService.ts`: Handles API communication and prompt engineering.
- `src/components/AIChatbot.tsx`: UI for the chat interface.

## Prompt Engineering

We use structured prompts that inject the user's actual data:

> "You are a carbon footprint reduction advisor. Based on the user's emission data [DATA], provide 5 specific, actionable recommendations..."
