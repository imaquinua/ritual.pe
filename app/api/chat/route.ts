import { NextRequest, NextResponse } from 'next/server'

const OPENAI_API_KEY = process.env.OPENAI_API_KEY

export async function POST(request: NextRequest) {
  if (!OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 })
  }

  try {
    const { message } = await request.json()

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 })
    }

    // System prompt optimized for token efficiency
    const systemPrompt = `Eres Chispa, experto parrillero de RITUAL. Responde en español, máximo 2 frases, enfócate en:
- Técnicas de parrilla específicas
- Recomendaciones de cortes premium
- Tiempos y temperaturas exactos
- Consejos prácticos de cocción

Productos disponibles: Picaña Premium, Tomahawk, Lomo Fino, T-Bone, Ribeye, Asado de Tira, Chorizo Criollo, Morcilla Premium, Parrilla Portátil.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: message }
        ],
        max_tokens: 100,
        temperature: 0.7,
        top_p: 0.9,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const data = await response.json()
    const aiResponse = data.choices[0]?.message?.content || 'Lo siento, no pude generar una respuesta.'

    return NextResponse.json({ response: aiResponse })

  } catch (error) {
    console.error('OpenAI API error:', error)
    return NextResponse.json(
      { error: 'Error al procesar la consulta' }, 
      { status: 500 }
    )
  }
}