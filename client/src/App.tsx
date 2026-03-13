import { useState } from 'react'
import type { Job } from './types/Job'
import JobForm from './components/JobForm'
import './App.css'

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);

  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  }

  return (
    <>
     <h1>Developer Job Tracker</h1>

     <JobForm onAdd={addJob} />

     <ul>
      {jobs.map((job) => (
          <li key={job.id}>
            {job.company} - {job.role} ({job.status})
          </li>
      ))}
     </ul>
    </>
  )
}

export default App
