import { useEffect, useState } from 'react'
import api from '../api/client'

const UserDashboard = () => {
  const [applications, setApplications] = useState([])
  const [file, setFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [resume, setResume] = useState(null)
  const [suggestions, setSuggestions] = useState([])
  const [status, setStatus] = useState('')

  const loadDashboard = async () => {
    const [resumeResult, appsResult] = await Promise.allSettled([api.get('/resumes/me'), api.get('/applications/me')])
    if (resumeResult.status === 'fulfilled') setResume(resumeResult.value.data.data)
    if (appsResult.status === 'fulfilled') setApplications(appsResult.value.data.data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadDashboard()
  }, [])

  const uploadResume = async (event) => {
    event.preventDefault()
    if (!file || isUploading) return
    const body = new FormData()
    body.append('resume', file)
    setIsUploading(true)
    setStatus('Extracting resume skills with AI...')

    try {
      const { data } = await api.post('/resumes/upload', body)
      setResume(data.data)
      setStatus('Resume uploaded and analyzed.')
    } catch (error) {
      setStatus(error.response?.data?.message || 'Resume upload failed. Please try again.')
    } finally {
      setIsUploading(false)
    }
  }

  const loadSuggestions = async () => {
    const { data } = await api.get('/resumes/suggestions')
    setSuggestions(data.data.suggestions || [])
  }

  return (
    <section className="grid gap-6 lg:grid-cols-[360px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Candidate Dashboard</h1>
        <form onSubmit={uploadResume} className="mt-6 space-y-4">
          <input type="file" accept="application/pdf" onChange={(event) => setFile(event.target.files?.[0])} className="input" disabled={isUploading} />
          <button disabled={isUploading} className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white disabled:cursor-not-allowed disabled:bg-indigo-300">
            {isUploading ? 'Analyzing Resume...' : 'Upload Resume'}
          </button>
        </form>
        {status && <p className="mt-4 rounded-xl bg-indigo-50 p-3 text-sm text-indigo-700">{status}</p>}
        {resume?.parsedProfile && (
          <div className="mt-6">
            <h2 className="font-bold">Skills Found</h2>
            <div className="mt-3 flex flex-wrap gap-2">
              {resume.parsedProfile.skills?.map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{skill}</span>
              ))}
            </div>
            <button onClick={loadSuggestions} className="mt-5 w-full rounded-xl border border-slate-300 px-4 py-3 font-semibold">Get Resume Suggestions</button>
            {suggestions.length > 0 && (
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {suggestions.map((item) => <li key={item}>{item}</li>)}
              </ul>
            )}
          </div>
        )}
      </aside>
      <div className="rounded-3xl border border-slate-200 bg-white p-6">
        <h2 className="text-2xl font-bold">Application Tracker</h2>
        <div className="mt-5 space-y-4">
          {applications.map((application) => (
            <div key={application._id} className="rounded-2xl bg-slate-50 p-5">
              <p className="font-bold">{application.job?.title}</p>
              <p className="text-sm text-slate-500">{application.job?.company} · {application.status}</p>
              <p className="mt-2 text-sm">Match Score: <strong>{application.matchScore ?? 0}%</strong></p>
              {application.missingSkills?.length > 0 && <p className="text-sm text-slate-500">Missing: {application.missingSkills.join(', ')}</p>}
            </div>
          ))}
          {applications.length === 0 && <p className="text-slate-500">No applications yet.</p>}
        </div>
      </div>
    </section>
  )
}

export default UserDashboard
