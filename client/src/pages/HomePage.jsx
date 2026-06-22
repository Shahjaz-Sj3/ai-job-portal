import { Link } from 'react-router-dom'

const HomePage = () => (
  <section className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
    <div>
      <p className="mb-4 inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
        AI-powered hiring for modern teams
      </p>
      <h1 className="text-5xl font-black tracking-tight text-slate-950 sm:text-6xl">
        Match talent to jobs with resume intelligence.
      </h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
        HireMind AI helps candidates upload resumes, apply to jobs, and track progress while recruiters shortlist applicants with AI match scores and interview prompts.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link to="/jobs" className="rounded-full bg-indigo-600 px-6 py-3 font-semibold text-white">Browse Jobs</Link>
        <Link to="/register" className="rounded-full border border-slate-300 px-6 py-3 font-semibold">Create Account</Link>
      </div>
    </div>
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
      {['Resume skill extraction', '82% job match scores', 'Missing skill insights', 'AI interview questions'].map((item) => (
        <div key={item} className="mb-4 rounded-2xl bg-slate-50 p-5 last:mb-0">
          <p className="font-semibold text-slate-950">{item}</p>
          <p className="mt-1 text-sm text-slate-500">Powered through secure backend AI workflows.</p>
        </div>
      ))}
    </div>
  </section>
)

export default HomePage
