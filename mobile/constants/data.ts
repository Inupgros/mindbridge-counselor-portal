export type StudentStatus = "new" | "active" | "pending" | "denied";
export type AppointmentStatus = "completed" | "upcoming" | "cancelled" | "in_progress";
export type VisitStatus = "completed" | "scheduled" | "not_scheduled";
export type PaymentStatus = "received" | "pending" | "overdue" | "processing";

export interface Student {
  id: string;
  name: string;
  school: string;
  grade: string;
  age: number;
  status: StudentStatus;
  requestDate: string;
  lastSession: string;
  sessionsCompleted: number;
  parentName: string;
  parentPhone: string;
  parentEmail: string;
  concerns: string[];
  board: string;
  percentage: number;
  riasecType: string;
}

export interface Appointment {
  id: string;
  studentName: string;
  studentId: string;
  school: string;
  date: string;
  time: string;
  duration: number;
  mode: "Online" | "Offline";
  type: string;
  status: AppointmentStatus;
  notes: string;
}

export interface School {
  id: string;
  name: string;
  city: string;
  board: string;
  studentCount: number;
  contactPrincipal: string;
  contactPhone: string;
  visitStatus: VisitStatus;
  visitsCompleted: number;
  visitsTotal: number;
  lastVisit: string;
  nextVisit: string;
  assignedDate: string;
}

export interface Payment {
  id: string;
  date: string;
  studentOrSchool: string;
  type: "appointment" | "school_visit";
  amount: number;
  status: PaymentStatus;
  invoiceId: string;
  description: string;
}

export const STUDENTS: Student[] = [
  { id: "s1", name: "Priya Mehta", school: "DPS Rohini", grade: "11th", age: 16, status: "active", requestDate: "2 Jan 2026", lastSession: "4 Apr 2026", sessionsCompleted: 3, parentName: "Sunita Mehta", parentPhone: "+91 9876500001", parentEmail: "sunita@gmail.com", concerns: ["Career Confusion", "Stress"], board: "CBSE", percentage: 82, riasecType: "Investigative" },
  { id: "s2", name: "Rohit Kumar", school: "St. Xavier's", grade: "10th", age: 15, status: "active", requestDate: "5 Jan 2026", lastSession: "5 Apr 2026", sessionsCompleted: 2, parentName: "Rakesh Kumar", parentPhone: "+91 9876500002", parentEmail: "rakesh@gmail.com", concerns: ["Academic Pressure"], board: "ICSE", percentage: 76, riasecType: "Realistic" },
  { id: "s3", name: "Ananya Roy", school: "St. Xavier's", grade: "12th", age: 17, status: "active", requestDate: "8 Jan 2026", lastSession: "12 Apr 2026", sessionsCompleted: 1, parentName: "Debasish Roy", parentPhone: "+91 9876500003", parentEmail: "debasish@gmail.com", concerns: ["College Admission"], board: "ICSE", percentage: 91, riasecType: "Artistic" },
  { id: "s4", name: "Meera Singh", school: "Springdales", grade: "9th", age: 14, status: "active", requestDate: "10 Jan 2026", lastSession: "15 Apr 2026", sessionsCompleted: 4, parentName: "Kavita Singh", parentPhone: "+91 9876500004", parentEmail: "kavita@gmail.com", concerns: ["Anxiety", "Social Issues"], board: "CBSE", percentage: 68, riasecType: "Social" },
  { id: "s5", name: "Arjun Nair", school: "DPS Rohini", grade: "11th", age: 16, status: "active", requestDate: "15 Jan 2026", lastSession: "18 Apr 2026", sessionsCompleted: 3, parentName: "Suresh Nair", parentPhone: "+91 9876500005", parentEmail: "suresh@gmail.com", concerns: ["Career Planning"], board: "CBSE", percentage: 88, riasecType: "Conventional" },
  { id: "s6", name: "Kavya Reddy", school: "Springdales", grade: "10th", age: 15, status: "active", requestDate: "20 Jan 2026", lastSession: "25 Apr 2026", sessionsCompleted: 2, parentName: "Ramesh Reddy", parentPhone: "+91 9876500006", parentEmail: "ramesh@gmail.com", concerns: ["Career Exploration"], board: "CBSE", percentage: 79, riasecType: "Enterprising" },
  { id: "s7", name: "Rahul Gupta", school: "DPS Rohini", grade: "12th", age: 17, status: "new", requestDate: "29 Apr 2026", lastSession: "-", sessionsCompleted: 0, parentName: "Anil Gupta", parentPhone: "+91 9876500007", parentEmail: "anil@gmail.com", concerns: ["IIT-JEE Stress", "Future Anxiety"], board: "CBSE", percentage: 85, riasecType: "Investigative" },
  { id: "s8", name: "Sneha Patel", school: "St. Xavier's", grade: "9th", age: 14, status: "new", requestDate: "28 Apr 2026", lastSession: "-", sessionsCompleted: 0, parentName: "Hema Patel", parentPhone: "+91 9876500008", parentEmail: "hema@gmail.com", concerns: ["Self-Confidence"], board: "ICSE", percentage: 72, riasecType: "Social" },
  { id: "s9", name: "Vikram Joshi", school: "Springdales", grade: "11th", age: 16, status: "pending", requestDate: "25 Apr 2026", lastSession: "-", sessionsCompleted: 0, parentName: "Mohan Joshi", parentPhone: "+91 9876500009", parentEmail: "mohan@gmail.com", concerns: ["Peer Pressure"], board: "CBSE", percentage: 65, riasecType: "Realistic" },
];

export const APPOINTMENTS: Appointment[] = [
  { id: "a1", studentName: "Priya Mehta", studentId: "s1", school: "DPS Rohini", date: "2026-05-05", time: "10:00 AM", duration: 45, mode: "Online", type: "Career Counseling", status: "upcoming", notes: "Session 4 — Career path finalization" },
  { id: "a2", studentName: "Arjun Nair", studentId: "s5", school: "DPS Rohini", date: "2026-05-05", time: "12:00 PM", duration: 45, mode: "Offline", type: "Follow-up", status: "upcoming", notes: "Check on JEE preparation progress" },
  { id: "a3", studentName: "Meera Singh", studentId: "s4", school: "Springdales", date: "2026-05-06", time: "11:00 AM", duration: 60, mode: "Online", type: "Mental Health", status: "upcoming", notes: "Anxiety management — weekly check-in" },
  { id: "a4", studentName: "Kavya Reddy", studentId: "s6", school: "Springdales", date: "2026-05-07", time: "3:00 PM", duration: 45, mode: "Online", type: "Career Counseling", status: "upcoming", notes: "Session 3 — Pathway finalization" },
  { id: "a5", studentName: "Rohit Kumar", studentId: "s2", school: "St. Xavier's", date: "2026-05-04", time: "10:00 AM", duration: 45, mode: "Offline", type: "Mental Health", status: "completed", notes: "Emotional regulation session completed" },
  { id: "a6", studentName: "Ananya Roy", studentId: "s3", school: "St. Xavier's", date: "2026-05-03", time: "2:00 PM", duration: 45, mode: "Online", type: "Career Counseling", status: "completed", notes: "Session 2 — College shortlist review" },
  { id: "a7", studentName: "Priya Mehta", studentId: "s1", school: "DPS Rohini", date: "2026-04-27", time: "10:00 AM", duration: 45, mode: "Online", type: "Follow-up", status: "completed", notes: "Session 3 — Career follow-up" },
  { id: "a8", studentName: "Rohit Kumar", studentId: "s2", school: "St. Xavier's", date: "2026-05-08", time: "11:30 AM", duration: 45, mode: "Online", type: "Career Counseling", status: "upcoming", notes: "Session 3 — Career path confirmation" },
];

export const SCHOOLS: School[] = [
  { id: "sc1", name: "DPS Rohini", city: "Delhi", board: "CBSE", studentCount: 1800, contactPrincipal: "Dr. Rajesh Sharma", contactPhone: "+91 11-2756-1234", visitStatus: "completed", visitsCompleted: 2, visitsTotal: 4, lastVisit: "10 Apr 2026", nextVisit: "10 May 2026", assignedDate: "1 Jan 2026" },
  { id: "sc2", name: "St. Xavier's", city: "Delhi", board: "ICSE", studentCount: 1200, contactPrincipal: "Sr. Maria D'Souza", contactPhone: "+91 11-2756-5678", visitStatus: "scheduled", visitsCompleted: 1, visitsTotal: 4, lastVisit: "22 Apr 2026", nextVisit: "22 May 2026", assignedDate: "1 Jan 2026" },
  { id: "sc3", name: "Springdales", city: "Delhi", board: "CBSE", studentCount: 900, contactPrincipal: "Mrs. Asha Kapoor", contactPhone: "+91 11-2756-9012", visitStatus: "scheduled", visitsCompleted: 1, visitsTotal: 4, lastVisit: "20 Mar 2026", nextVisit: "20 May 2026", assignedDate: "1 Jan 2026" },
  { id: "sc4", name: "Modern School", city: "New Delhi", board: "CBSE", studentCount: 1500, contactPrincipal: "Mr. Vikrant Bahl", contactPhone: "+91 11-2756-3456", visitStatus: "not_scheduled", visitsCompleted: 0, visitsTotal: 4, lastVisit: "-", nextVisit: "-", assignedDate: "1 Feb 2026" },
];

export const PAYMENTS: Payment[] = [
  { id: "p1", date: "4 Apr 2026", studentOrSchool: "Priya Mehta", type: "appointment", amount: 1500, status: "received", invoiceId: "INV-024", description: "Session 2 — Career Goal Planning" },
  { id: "p2", date: "5 Apr 2026", studentOrSchool: "Rohit Kumar", type: "appointment", amount: 1500, status: "received", invoiceId: "INV-025", description: "Session 1 — Initial Assessment" },
  { id: "p3", date: "10 Apr 2026", studentOrSchool: "DPS Rohini", type: "school_visit", amount: 8000, status: "received", invoiceId: "INV-026", description: "April school visit — Group Session" },
  { id: "p4", date: "12 Apr 2026", studentOrSchool: "Ananya Roy", type: "appointment", amount: 1500, status: "received", invoiceId: "INV-027", description: "Session 1 — Career Interest Mapping" },
  { id: "p5", date: "15 Apr 2026", studentOrSchool: "Meera Singh", type: "appointment", amount: 2000, status: "received", invoiceId: "INV-028", description: "Session 1 — Stress & Anxiety Assessment" },
  { id: "p6", date: "22 Apr 2026", studentOrSchool: "St. Xavier's", type: "school_visit", amount: 7500, status: "processing", invoiceId: "INV-030", description: "April school visit — Career Screening" },
  { id: "p7", date: "25 Apr 2026", studentOrSchool: "Kavya Reddy", type: "appointment", amount: 1500, status: "pending", invoiceId: "INV-031", description: "Session 2 — Career Path Shortlisting" },
  { id: "p8", date: "28 Apr 2026", studentOrSchool: "Rohit Kumar", type: "appointment", amount: 2000, status: "pending", invoiceId: "INV-033", description: "Session 2 — Emotional Regulation" },
];

export const MONTHLY_REVENUE = [
  { month: "Jan", amount: 14500 },
  { month: "Feb", amount: 16000 },
  { month: "Mar", amount: 12500 },
  { month: "Apr", amount: 9000 },
  { month: "May", amount: 4200 },
];

export const COUNSELOR = {
  name: "Dr. Ananya Sharma",
  initials: "AS",
  role: "Licensed Psychologist · Career Counselor",
  email: "ananya.sharma@mindbridge.in",
  phone: "+91 9876543210",
  regNumber: "RCI/2019/DEL/04521",
  verified: true,
  specializations: ["Career Counseling", "Academic Coaching", "Mental Health Support", "Stress Management"],
  experience: 6,
  nextPayout: { amount: 14190, date: "5 May 2026" },
};
