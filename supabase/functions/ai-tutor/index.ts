// @ts-ignore: Deno supports remote imports, but TypeScript may not recognize types
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { message, context, conversationHistory } = await req.json()
    
    // @ts-ignore: Deno global is available in Supabase Edge Functions
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    // Build system prompt based on context
    let systemPrompt = `You are a warm, encouraging AI tutor. Your role is to help students learn by providing clear, simple explanations in a conversational tone. 

Guidelines:
- Be warm and encouraging in your responses
- Break down complex concepts into simple steps
- Use examples to illustrate points
- Avoid phrases like "As an AI language model" or "ChatGPT said"
- Keep responses concise but thorough
- Adapt your language to be student-friendly
- Focus on understanding rather than just answers`

    if (context === 'explain_more') {
      systemPrompt += `\n\nThe student wants a more detailed explanation of the previous topic. Provide a deeper, more comprehensive explanation with additional context and examples.`
    } else if (context === 'examples') {
      systemPrompt += `\n\nThe student wants more examples related to the previous topic. Provide 2-3 clear, practical examples that illustrate the concept.`
    }

    // Build messages array
    const messages = [
      { role: 'system', content: systemPrompt },
      // Include recent conversation history for context
      ...conversationHistory.slice(-4).map((msg: any) => ({
        role: msg.isUser ? 'user' : 'assistant',
        content: msg.content
      })),
      { role: 'user', content: message }
    ]

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 1000,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0].message.content

    // Post-process the response to make it more tutor-like
    let processedResponse = aiResponse
      .replace(/As an AI language model,?\s*/gi, '')
      .replace(/I'm an AI,?\s*/gi, '')
      .replace(/ChatGPT,?\s*/gi, '')
      .replace(/According to my training,?\s*/gi, '')
      .replace(/I don't have personal experience,?\s*but\s*/gi, '')

    // Add encouraging tone if response seems too formal
    if (!processedResponse.match(/great|excellent|good|well done|nice|awesome/i) && 
        !processedResponse.match(/let's|you can|try|think about/i)) {
      const encouragingStarters = [
        "Great question! ",
        "I'm happy to help with that! ",
        "Let me break this down for you! ",
        "That's a really important concept! "
      ]
      const starter = encouragingStarters[Math.floor(Math.random() * encouragingStarters.length)]
      processedResponse = starter + processedResponse
    }

    return new Response(
      JSON.stringify({ 
        response: processedResponse,
        usage: data.usage 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )

  } catch (error) {
    console.error('Error in ai-tutor function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'I apologize, but I\'m having trouble right now. Please try again in a moment.' 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
})