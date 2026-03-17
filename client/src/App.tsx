import { useEffect, useState } from 'react'
import type { Job } from './types/Job'
import JobForm from './components/JobForm'
import './App.css'

function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const appliedCount = jobs.filter((job) => job.status === "Applied").length;
  const interviewCount = jobs.filter((job) => job.status === "Interview").length;
  const offerCount = jobs.filter((job) => job.status === "Offer").length;
  const rejectedCount = jobs.filter((job) => job.status === "Rejected").length;

  useEffect(() => {
    fetch("http://localhost:5000/jobs")
      .then((res) => res.json())
      .then((data) => setJobs(data));
  }, []);

  const addJob = (job: Job) => {
    setJobs([...jobs, job]);
  }

  const handleDelete = async (id: number) => {
    await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "DELETE",
    });

    setJobs(jobs.filter((job) => job.id !== id));
  }

  const handleStatusChange = async (id: number, status: string) => {
    const response = await fetch(`http://localhost:5000/jobs/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({status}),
    })

    const updatedJob = await response.json();

    setJobs(
      jobs.map((job) => (job.id === id ? updatedJob : job))
    )
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Applied":
        return "bg-yellow-200 text-yellow-800";
      case "Interview":
        return "bg-blue-200 text-blue-800";
      case "Offer":
        return "bg-green-200 text-green-800";
      case "Rejected":
        return "bg-red-200 text-red-800";
      default:
        return "bg-gray-200";
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center p-8">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 text-center">Job Tracker</h1>
          <p className="text-gray-500 text-center">Track your job applications and interview progress</p>
          <hr className="mb-6 border-gray-200" />
        </div>
        <div className="grid grid-cols-4 gap-4 mb-6">
          <div className="bg-yellow-100 p-4 rounded shadow">
            <p className="text-sm text-gray-600 text-center font-bold">Applied</p>
            <p className="text-2xl font-bold text-center">{appliedCount}</p>
          </div>
          <div className="bg-blue-100 p-4 rounded shadow">
            <p className="text-sm text-gray-600 text-center font-bold">Interview</p>
            <p className="text-2xl font-bold text-center">{interviewCount}</p>
          </div>
          <div className="bg-green-100 p-4 rounded shadow">
            <p className="text-sm text-gray-600 text-center font-bold">Offers</p>
            <p className="text-2xl font-bold text-center">{offerCount}</p>
          </div>
          <div className="bg-red-100 p-4 rounded shadow">
            <p className="text-sm text-gray-600 font-bold text-center">Rejected</p>
            <p className="text-2xl font-bold text-center">{rejectedCount}</p>
          </div>
        </div>
        <h2 className="text-3xl font-bold text-center mb-6">
          <JobForm onAdd={addJob} />

          <div className="mt-6 space-y-4">
            {jobs.map((job) => (
              <div 
                key={job.id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-semibold text-lg text-left">{job.company}</h3>
                    <p className="text-gray-600">{job.role}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className={`px-2 py-1 rounded text-sm ${getStatusColor(job.status)}`}>
                      <select
                        value={job.status}
                        onChange={(e) => handleStatusChange(job.id, e.target.value)}
                        className="bg-transparent outline-none"
                      >
                        <option value="Applied">Applied</option>
                        <option value="Interview">Interview</option>
                        <option value="Offer">Offer</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    </div>
                    <button
                      onClick={() => handleDelete(job.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>

              <button
                onClick={() => 
                  setExpandedId(expandedId === job.id ? null : job.id)
                }
                className="text-blue-500 text-sm mt-2"
                >
                {expandedId === job.id ? "Hide Notes" : "View Notes"}
              </button>

              {expandedId === job.id && job.notes && (
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                  <div className="text-xs text-gray-500 mb-1">Notes</div>
                  {job.notes}
                </div>
              )}
            </div>
            ))}
          </div>
        </h2>
      </div>
    </div>
  )
}

export default App
