import { GoogleGenerativeAI } from '@google/generative-ai'

export async function POST(req: Request) {
  try {
    const { subject, grade } = await req.json()
    
    if (!process.env.GEMINI_API_KEY) {
      // Mock response if no key is set yet (to prevent demo crashing)
      return Response.json({
        questions: [
          {
            question: `Sample assessment question covering ${subject} topics for ${grade}?`,
            options: ["Option A", "Option B", "Option C", "Option D"],
            correct: 0,
            explanation: "Automated analysis pending AI engine configuration."
          }
        ]
      })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })

    const prompt = `
      Generate 5 multiple choice questions for a ${grade} student on "${subject}".
      Return ONLY valid JSON in this exact format:
      {
        "questions": [
          {
            "question": "...",
            "options": ["A","B","C","D"],
            "correct": 0,
            "explanation": "..."
          }
        ]
      }
    `
    
    const result = await model.generateContent(prompt)
    const text = result.response.text()
    const jsonStr = text.replace(/```json|```/g, '').trim()
    
    try {
      const json = JSON.parse(jsonStr)
      return Response.json(json)
    } catch (parseError) {
      return Response.json({ error: "Failed to parse AI response" }, { status: 500 })
    }
  } catch (err: any) {
    return Response.json({ error: err.message }, { status: 500 })
  }
}
