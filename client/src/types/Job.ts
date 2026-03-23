export interface Job {
    id: number
    company: string
    role: string
    status: "Applied" | "Interview" | "Offer" | "Rejected"
    date_applied: string
    link?: string
    notes?: string
}

export interface NewJob {
    company: string
    role: string
    notes?: string
    status: string
}