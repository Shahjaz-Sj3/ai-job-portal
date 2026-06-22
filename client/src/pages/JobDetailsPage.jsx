import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/client'
import { useAuth } from '../context/AuthContext'

const JobDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const [coverLetter, setCoverLetter] = useState('')
  const [job, setJob] = useState(null)
  const [match, setMatch] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [isApplying, setIsApplying] = useState(false)

  useEffect(() => {
    api.get(`/jobs/${id}`).then(({ data }) => setJob(data.data))
  }, [id])

  const getMatch = async () => {
    const { data } = await api.get(`/ai/match/${id}`)
    setMatch(data.data)
  }

  const apply = async () => {
    setError('')
    setMessage('')
    setIsApplying(true)

    try {
      const { data } = await api.post('/applications', { jobId: id, coverLetter })
      setMessage(`Applied successfully. Match score: ${data.data.matchScore ?? 0}%`)
      setCoverLetter('')
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Could not apply. Please try again.')
    } finally {
      setIsApplying(false)
    }
  }

  if (!job) return <p>Loading job...</p>

  return (
    <section className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <article className="rounded-3xl border border-slate-200 bg-white p-8">
        <p className="font-semibold text-indigo-600">{job.company}</p>
        <h1 className="mt-2 text-4xl font-bold">{job.title}</h1>
        <p className="mt-2 text-slate-500">{job.location} · {job.type} · {job.salaryRange || 'Salary not disclosed'}</p>
        <p className="mt-6 whitespace-pre-line leading-8 text-slate-700">{job.description}</p>
        <h2 className="mt-8 text-xl font-bold">Requirements</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {job.requirements?.map((requirement) => (
            <span key={requirement} className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">{requirement}</span>
          ))}
        </div>
      </article>
      <aside className="rounded-3xl border border-slate-200 bg-white p-6">
        {user?.role === 'user' ? (
          <div className="space-y-4">
            <button onClick={getMatch} className="w-full rounded-xl border border-indigo-200 px-4 py-3 font-semibold text-indigo-700">Get AI Match Score</button>
            {match && (
              <div className="rounded-2xl bg-slate-50 p-4">
                <p className="text-3xl font-bold">{match.matchScore}%</p>
                <p className="text-sm text-slate-500">Missing skills: {match.missingSkills?.join(', ') || 'None'}</p>
              </div>
            )}
            <textarea value={coverLetter} onChange={(event) => setCoverLetter(event.target.value)} placeholder="Cover letter" className="input min-h-32" />
            <button onClick={apply} disabled={isApplying} className={`w-full rounded-xl px-4 py-3 font-semibold text-white ${isApplying ? 'bg-slate-400' : 'bg-indigo-600 hover:bg-indigo-700'}`}>
              {isApplying ? 'Applying...' : 'Apply Now'}
            </button>
            {message && <p className="rounded-xl bg-green-50 p-3 text-sm text-green-700">{message}</p>}
            {error && <p className="rounded-xl bg-red-50 p-3 text-sm text-red-700">{error}</p>}
          </div>
        ) : (
          <p className="text-sm text-slate-500">Login as a candidate to apply and view match scores.</p>
        )}
      </aside>
    </section>
  )
}

export default JobDetailsPage
