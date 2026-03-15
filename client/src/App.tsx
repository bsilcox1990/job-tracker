import { useEffect, useState } from 'react'
import type { Job } from './types/Job'
import JobForm from './components/JobForm'
import './App.css'

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <h1 className="text-3xl font-bold text-center mb-6">
          <JobForm onAdd={addJob} />

          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg text-left">{job.company}</h3>
                  <p className="text-gray-600">{job.role}</p>
                </div>

                <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full">
                  {job.status}
                </span>
              </div>
            ))}
          </div>
        </h1>
      </div>
    </div>
  )
}

export default App
