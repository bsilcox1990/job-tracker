import { useState } from 'react'
import type { Job } from './types/Job'
import type { JobStatus } from './types/Job';
import JobForm from './components/JobForm'
import './App.css'
import EditJobModal from './components/EditJobModal'
import { Toaster } from 'react-hot-toast'
import toast from "react-hot-toast";
import useDeleteJob from "./hooks/useDeleteJob";
import useJobs from './hooks/useJobs'
import useUpdateJob from './hooks/useUpdateJob'
import useCreateJob from './hooks/useCreateJob';

function App() {
  const { jobs, loading, fetchJobs } = useJobs();
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [editingJob, setEditingJob] = useState<Job | null>(null);
  const { updateJob, updatingId, error, setError } = useUpdateJob({ onSuccess: fetchJobs });
  const { deleteJob, deletingId } = useDeleteJob({ onSuccess: fetchJobs });
  const { createJob, loading: creating } = useCreateJob({onSuccess: fetchJobs });
  const appliedCount = jobs.filter((job) => job.status === "Applied").length;
  const interviewCount = jobs.filter((job) => job.status === "Interview").length;
  const offerCount = jobs.filter((job) => job.status === "Offer").length;
  const rejectedCount = jobs.filter((job) => job.status === "Rejected").length;
  
  const filteredJobs = jobs.filter((job) => {
    if(filterStatus !== "All" && job.status !== filterStatus) return false;

    return (job.company || "").toLowerCase().includes(searchTerm.toLowerCase());
  })

  const handleDelete = async (id: number) => {
    const toastId = toast.loading("Deleting job...");

    try {
      await deleteJob(id);
      toast.success("Job deleted", {id: toastId});
    } catch(error: any) {
      toast.error("Failed to delete job", {id: toastId});
    }
  }

  const handleStatusChange = async (id: number, status: JobStatus) => {
    const job = jobs.find((j) => j.id === id);

    if(!job) return;

    await updateJob({...job, status });
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
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            fontSize: "14px",
            fontWeight: "500",
            borderRadius: "8px",
            padding: "12px 16px"
          },
          success: {
            style: {
              background: "#16a34a",
              color: "#fff",
            },
          },
          error: {
            style: {
              background: "#dc2626",
              color: "#fff",
            },
          },
        }}
      />
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
          <JobForm 
            onCreate={createJob}
            loading={creating}
          />

          <div className="flex items-center gap-3 mb-6 bg-gray-50 p-3 rounded-lg">

            <input 
              type="text"
              placeholder="Search company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm w-full max-w-xs focus-outline-none focus:ring-2 focus:ring-blue-500"
            />

            <span className="text-sm text-gray-600 font-medium">
              Filter by status:
            </span>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-md px-3 py-2 text-sm bg-white shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">All</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>

          <div className="mt-6 space-y-4">
            {loading ? (
              <p className="text-gray-500 text-center mt-6">Loading jobs...</p>
            ) :
            filteredJobs.length === 0 ? (
              <p className = "text-gray-500 text-sm text-center mt-6">No jobs yet — start applying</p>
            ) : (
            filteredJobs.map((job) => (
              <div 
                key={job.id}
                className="border rounded-lg p-4 shadow-sm"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-gray-600 text-left">{job.company}</h3>
                    <p className="text-gray-600">{job.role}</p>
                  </div>
                  <div className="flex gap-4">
                    <div className={`px-2 py-1 rounded text-sm ${getStatusColor(job.status)}`}>
                      <select
                        value={job.status || "Applied"}
                        onChange={(e) => handleStatusChange(job.id, e.target.value as Job["status"])}
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
                      disabled={deletingId === job.id}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded text-sm"
                    >
                      {deletingId === job.id ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>

                <div className="flex gap-3 mt-2 justify-center">
                  <button
                    onClick={() =>
                      setExpandedId(expandedId === job.id ? null : job.id)
                    }
                    className="text-blue-500 text-sm mt-2 cursor-pointer"
                  >
                    {expandedId === job.id ? "Hide Notes" : "View Notes"}
                  </button>

                  <button
                    className="text-blue-500 text-sm mt-2 cursor-pointer"
                    onClick={() => setEditingJob(job)}
                  >
                    Edit
                  </button>
                </div>

                {expandedId === job.id && job.notes && (
                  <div className="mt-2 p-2 bg-gray-100 rounded text-sm">
                    <div className="text-xs text-gray-500 mb-1">Notes</div>
                     {job.notes}
                  </div>
                )}

            </div>
            )))}
          </div>
            {editingJob && (
              <EditJobModal
                job={editingJob}
                onClose={() => setEditingJob(null)}
                onSave={updateJob}
                updatingId={updatingId}
                error={error}
                setError={setError}
               />
            )}
        </h2>
      </div>
    </div>
  )
}

export default App
