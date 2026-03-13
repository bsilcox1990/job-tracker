export interface Job {
    id: string
    company: string
    role: string
    status: "Applied" | "Interview" | "Offer" | "Rejected"
    dateApplied: string
    link?: string
    notes?: string
}