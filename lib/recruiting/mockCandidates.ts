export interface AvaCandidateRow {
  id: string;
  name: string;
  currentRole: string;
  company: string;
  location: string;
  experienceYears: number;
  matchScore: number;
  compensation: string;
  status: "shortlisted" | "contacted" | "responded" | "interested";
}

/** MOCK DATA — candidates in AVA's Senior DevOps Engineer sourcing funnel. */
export const AVA_CANDIDATES: AvaCandidateRow[] = [
  {
    id: "cand-1",
    name: "Marcus Reed",
    currentRole: "Sr. Network Engineer",
    company: "ABC Manufacturing",
    location: "Atlanta, GA",
    experienceYears: 9,
    matchScore: 94,
    compensation: "$148K",
    status: "interested"
  },
  {
    id: "cand-2",
    name: "Priya Natarajan",
    currentRole: "DevOps Team Lead",
    company: "Meridian Cloud",
    location: "Atlanta, GA",
    experienceYears: 11,
    matchScore: 91,
    compensation: "$162K",
    status: "responded"
  },
  {
    id: "cand-3",
    name: "Danielle Brooks",
    currentRole: "Controls Engineer",
    company: "ABC Manufacturing",
    location: "Marietta, GA",
    experienceYears: 7,
    matchScore: 88,
    compensation: "$139K",
    status: "responded"
  },
  {
    id: "cand-4",
    name: "Andre Collins",
    currentRole: "Director, FP&A",
    company: "Northstar Group",
    location: "Atlanta, GA",
    experienceYears: 13,
    matchScore: 83,
    compensation: "$171K",
    status: "contacted"
  },
  {
    id: "cand-5",
    name: "Sarah Kim",
    currentRole: "Site Reliability Engineer",
    company: "Vertex Systems",
    location: "Remote (GA)",
    experienceYears: 6,
    matchScore: 86,
    compensation: "$145K",
    status: "contacted"
  },
  {
    id: "cand-6",
    name: "Trevor Nash",
    currentRole: "Platform Engineer",
    company: "Innovatech",
    location: "Decatur, GA",
    experienceYears: 8,
    matchScore: 79,
    compensation: "$134K",
    status: "shortlisted"
  }
];

export const AVA_SOURCING_FUNNEL = [
  { stage: "Profiles Discovered", count: 1847 },
  { stage: "Potentially Qualified", count: 263 },
  { stage: "Evaluated", count: 84 },
  { stage: "Shortlisted", count: 31 },
  { stage: "Contacted", count: 17 },
  { stage: "Responses", count: 7 },
  { stage: "Interested", count: 4 }
];
