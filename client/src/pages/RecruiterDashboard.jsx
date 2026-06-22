import { useEffect, useState } from 'react'
import api from '../api/client'

const emptyJob = {
  company: '',
  description: '',
  location: '',
  requirements: '',
  salaryRange: '',
  title: '',
  type: 'Full-time',
}

const RecruiterDashboard = () => {
  const [applicants, setApplicants] = useState([])
  const [form, setForm] = useState(emptyJob)
  const [jobs, setJobs] = useState([])
  const [questions, setQuestions] = useState([])

  const loadData = async () => {
    const [jobsResult, applicantsResult] = await Promise.all([
      api.get('/jobs/recruiter/mine'),
      api.get('/applications/applicants'),
    ])
    setJobs(jobsResult.data.data)
    setApplicants(applicantsResult.data.data)
  }

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadData()
  }, [])

  const updateField = (event) => setForm((current) => ({ ...current, [event.target.name]: event.target.value }))

  const createJob = async (event) => {
    event.preventDefault()
    await api.post('/jobs', {
      ...form,
      requirements: form.requirements.split(',').map((item) => item.trim()).filter(Boolean),
    })
    setForm(emptyJob)
    loadData()
  }

  const updateStatus = async (applicationId, status) => {
    await api.patch(`/applications/${applicationId}/status`, { status })
    loadData()
  }

  const generateQuestions = async (jobId) => {
    const { data } = await api.post('/ai/interview-questions', { jobId, count: 5 })
    setQuestions(data.data.questions || [])
  }

  return (
    <section className="grid gap-6 xl:grid-cols-[420px_1fr]">
      <aside className="rounded-3xl border border-slate-200 bg-white p-6">
        <h1 className="text-2xl font-bold">Recruiter Dashboard</h1>
        <form onSubmit={createJob} className="mt-6 space-y-3">
          {['title', 'company', 'location', 'salaryRange'].map((field) => (
            <input key={field} name={field} value={form[field]} onChange={updateField} placeholder={field} className="input" required={field !== 'salaryRange'} />
          ))}
          <select name="type" value={form.type} onChange={updateField} className="input">
            {['Full-time', 'Part-time', 'Contract', 'Internship', 'Remote'].map((type) => <option key={type}>{type}</option>)}
          </select>
          <textarea name="description" value={form.description} onChange={updateField} placeholder="Job description" className="input min-h-28" required />
          <input name="requirements" value={form.requirements} onChange={updateField} placeholder="Requirements comma separated" className="input" required />
          <button className="w-full rounded-xl bg-indigo-600 px-4 py-3 font-semibold text-white">Post Job</button>
        </form>
      </aside>
      <div className="space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold">Manage Listings</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {jobs.map((job) => (
              <div key={job._id} className="rounded-2xl bg-slate-50 p-4">
                <p className="font-bold">{job.title}</p>
                <p className="text-sm text-slate-500">{job.company} · {job.status}</p>
                <button onClick={() => generateQuestions(job._id)} className="mt-3 rounded-xl border border-slate-300 px-3 py-2 text-sm font-semibold">Generate Questions</button>
              </div>
            ))}
          </div>
          {questions.length > 0 && (
            <ol className="mt-4 list-decimal space-y-2 rounded-2xl bg-indigo-50 p-5 pl-8 text-sm text-indigo-950">
              {questions.map((question) => <li key={question}>{question}</li>)}
            </ol>
          )}
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6">
          <h2 className="text-2xl font-bold">Applicants</h2>
          <div className="mt-4 space-y-4">
            {applicants.map((application) => (
              <div key={application._id} className="rounded-2xl bg-slate-50 p-5">
                <div className="flex flex-col justify-between gap-3 sm:flex-row">
                  <div>
                    <p className="font-bold">{application.applicant?.name}</p>
                    <p className="text-sm text-slate-500">{application.job?.title} · {application.status}</p>
                    <p className="text-sm">Match Score: <strong>{application.matchScore ?? 0}%</strong></p>
                  </div>
                  <div className="flex gap-2">
                    {['reviewing', 'shortlisted', 'rejected', 'hired'].map((status) => (
                      <button key={status} onClick={() => updateStatus(application._id, status)} className="rounded-full bg-white px-3 py-1 text-xs font-semibold">
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default RecruiterDashboard
