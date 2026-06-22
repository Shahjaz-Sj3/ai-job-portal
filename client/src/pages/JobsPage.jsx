import { useCallback, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../api/client'

const JobsPage = () => {
  const [jobs, setJobs] = useState([])
  const [search, setSearch] = useState('')

  const loadJobs = useCallback(async () => {
    const { data } = await api.get('/jobs', { params: search ? { search } : {} })
    setJobs(data.data)
  }, [search])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadJobs()
  }, [loadJobs])

  return (
    <section>
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Open jobs</h1>
          <p className="text-slate-500">Browse active roles and compare them with your resume.</p>
        </div>
        <form
          onSubmit={(event) => {
            event.preventDefault()
            loadJobs()
          }}
          className="flex gap-2"
        >
          <input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search jobs" className="input min-w-64" />
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-white">Search</button>
        </form>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {jobs.map((job) => (
          <Link key={job._id} to={`/jobs/${job._id}`} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm hover:border-indigo-300">
            <p className="text-sm font-semibold text-indigo-600">{job.company}</p>
            <h2 className="mt-2 text-xl font-bold">{job.title}</h2>
            <p className="mt-2 text-sm text-slate-500">{job.location} · {job.type}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {job.requirements?.slice(0, 4).map((skill) => (
                <span key={skill} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold">{skill}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

export default JobsPage
