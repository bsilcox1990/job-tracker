export interface Job {
    id: number
    company: string
    role: string
    status: "Applied" | "Interview" | "Offer" | "Rejected"
    date_applied: string
    link?: string
    notes?: string
}