/**
 * LLM Service - Abstraction layer for different LLM providers
 * Currently supports Hugging Face Inference API (free tier)
 * Easily extensible to OpenAI
 */

// Get API keys from runtime config, localStorage, or build-time env
function getConfigValue(key, defaultValue = '') {
  if (typeof window !== 'undefined' && window.APP_CONFIG?.[key]) {
    return window.APP_CONFIG[key]
  }
  if (typeof window !== 'undefined') {
    const stored = localStorage.getItem(key)
    if (stored) return stored
  }
  return import.meta.env[`VITE_${key}`] || defaultValue
}

const HUGGINGFACE_API_KEY = getConfigValue('HUGGINGFACE_API_KEY')
const OPENAI_API_KEY = getConfigValue('OPENAI_API_KEY')
const LLM_PROVIDER = getConfigValue('LLM_PROVIDER') || 'huggingface'

// Debug helper (only in development)
if (import.meta.env.DEV) {
  console.log('Hugging Face API Key loaded:', HUGGINGFACE_API_KEY ? 'Yes (length: ' + HUGGINGFACE_API_KEY.length + ')' : 'No')
  console.log('LLM Provider:', LLM_PROVIDER)
}

/**
 * Main LLM service interface
 */
export const llmService = {
  async generate(prompt) {
    switch (LLM_PROVIDER) {
      case 'openai':
        return await generateWithOpenAI(prompt)
      case 'huggingface':
      default:
        return await generateWithHuggingFace(prompt)
    }
  }
}

/**
 * Generate response using Hugging Face Inference API (Free tier)
 * Model: meta-llama/Llama-2-7b-chat-hf or mistralai/Mistral-7B-Instruct-v0.2
 */
async function generateWithHuggingFace(prompt) {
  if (!HUGGINGFACE_API_KEY || HUGGINGFACE_API_KEY.trim() === '') {
    throw new Error('Hugging Face API key is not configured. Please check your .env file or config.js. Get a free key at https://huggingface.co/settings/tokens')
  }

  // Using a free model that supports instruction following
  const model = 'mistralai/Mistral-7B-Instruct-v0.2'
  
  try {
    let response
    try {
      response = await fetch(
        `https://api-inference.huggingface.co/models/${model}`,
        {
          headers: {
            Authorization: `Bearer ${HUGGINGFACE_API_KEY}`,
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body: JSON.stringify({
            inputs: prompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              return_full_text: false
            }
          }),
        }
      )
    } catch (fetchError) {
      console.error('Network error:', fetchError)
      throw new Error('Network error: Unable to connect to Hugging Face API. Please check your internet connection.')
    }

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { error: `HTTP ${response.status}` }
      }
      
      if (response.status === 503) {
        // Model is loading, wait and retry once
        console.log('Model is loading, waiting 5 seconds...')
        await new Promise(resolve => setTimeout(resolve, 5000))
        return generateWithHuggingFace(prompt)
      }
      
      if (response.status === 401 || response.status === 403) {
        throw new Error('Invalid Hugging Face API key. Please check your API key in .env or config.js')
      }
      
      throw new Error(errorData.error || `Failed to generate response from Hugging Face (status ${response.status})`)
    }

    const data = await response.json()
    
    if (Array.isArray(data) && data[0] && data[0].generated_text) {
      return data[0].generated_text.trim()
    }
    
    if (data.generated_text) {
      return data.generated_text.trim()
    }

    throw new Error('Unexpected response format from Hugging Face')
  } catch (error) {
    // Re-throw our custom errors
    if (error.message && (
      error.message.includes('API key') ||
      error.message.includes('Network error') ||
      error.message.includes('Invalid')
    )) {
      throw error
    }
    // Handle unexpected errors
    console.error('Unexpected error:', error)
    throw new Error(`Failed to connect to Hugging Face API: ${error.message || 'Unknown error'}. Please check your API key and try again.`)
  }
}

/**
 * Generate response using OpenAI API
 */
async function generateWithOpenAI(prompt) {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is not configured. Please add VITE_OPENAI_API_KEY to your environment variables.')
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        max_tokens: 500,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error?.message || 'Failed to generate response from OpenAI')
    }

    const data = await response.json()
    return data.choices[0].message.content.trim()
  } catch (error) {
    if (error.message) {
      throw error
    }
    throw new Error('Failed to connect to OpenAI API. Please check your API key and try again.')
  }
}

