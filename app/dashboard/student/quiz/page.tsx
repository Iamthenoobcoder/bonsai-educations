"use client"
import { useState } from 'react'

export default function StudentQuizPage() {
  const [subject, setSubject] = useState('')
  const [grade, setGrade] = useState('Grade 10')
  const [loading, setLoading] = useState(false)
  const [quiz, setQuiz] = useState<any>(null)

  const generateQuiz = async () => {
    if (!subject) return
    setLoading(true)
    try {
      const res = await fetch('/api/quiz', {
        method: 'POST',
        body: JSON.stringify({ subject, grade })
      })
      const data = await res.json()
      setQuiz(data.questions)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-2">AI Quiz Generator</h1>
      <p className="text-neutral-500 mb-8">Test your knowledge with Gemini-powered dynamic quizzes.</p>

      {!quiz ? (
        <div className="bg-white p-8 rounded-3xl border border-neutral-100 shadow-sm flex flex-col items-center">
          <div className="w-full max-w-sm space-y-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Grade</label>
              <select value={grade} onChange={e=>setGrade(e.target.value)} className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl p-3">
                <option>Grade 9</option>
                <option>Grade 10</option>
                <option>Grade 11</option>
                <option>Grade 12</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">Subject / Topic</label>
              <input value={subject} onChange={e=>setSubject(e.target.value)} type="text" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-900 text-sm rounded-xl p-3" placeholder="e.g. Thermodynamics, Algebra..." />
            </div>
            <button onClick={generateQuiz} disabled={loading || !subject} className="w-full mt-4 bg-neutral-900 text-white px-6 py-3 rounded-xl font-medium hover:bg-neutral-800 transition disabled:opacity-50">
              {loading ? "Generating..." : "Generate Quiz"}
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
           {quiz.map((q: any, i: number) => (
             <div key={i} className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-sm">
               <h3 className="font-semibold text-lg text-neutral-900 mb-4">{i+1}. {q.question}</h3>
               <div className="space-y-2">
                 {q.options.map((opt: string, j: number) => (
                   <label key={j} className="flex items-center p-3 border border-neutral-100 rounded-xl hover:bg-neutral-50 cursor-pointer transition">
                     <input type="radio" name={`q-${i}`} className="mr-3 w-4 h-4 text-amber-600 focus:ring-amber-500 border-neutral-300" />
                     <span className="text-neutral-700">{opt}</span>
                   </label>
                 ))}
               </div>
             </div>
           ))}
           <div className="flex justify-end pt-4">
             <button className="bg-amber-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-amber-700 transition">
               Submit Answers
             </button>
           </div>
        </div>
      )}
    </div>
  )
}
