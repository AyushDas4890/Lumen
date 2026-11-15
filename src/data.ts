export type Department = {
  id: string;
  name: string;
  blurb: string;
};

export type Doctor = {
  id: string;
  name: string;
  title: string;
  departmentId: string;
  years: number;
  rating: number;
  languages: string[];
  bio: string;
  fee: number;
};

export const departments: Department[] = [
  {id: 'primary', name: 'Primary Care', blurb: 'Checkups, prevention and everyday health, with one doctor who knows you'},
  {id: 'cardio', name: 'Cardiology', blurb: 'Screening, rhythm care and imaging for heart health'},
  {id: 'recovery', name: 'Long-COVID Recovery', blurb: 'A coordinated path for lingering symptoms and post-viral fatigue'},
  {id: 'womens', name: "Women's Health", blurb: 'Gynecology, maternity and menopause care'},
  {id: 'peds', name: 'Pediatrics', blurb: 'Family-first care from newborns through teens'},
  {id: 'ortho', name: 'Orthopedics', blurb: 'Bones, joints and sports injuries'},
  {id: 'mind', name: 'Mental Wellbeing', blurb: 'Therapy and psychiatry in unhurried appointments'},
  {id: 'derm', name: 'Dermatology', blurb: 'Skin, hair and nail conditions'},
];

export const doctors: Doctor[] = [
  {id: 'd1', name: 'Dr. Amara Okafor', title: 'Internal Medicine', departmentId: 'primary', years: 14, rating: 4.9, languages: ['English', 'Igbo'], bio: 'Believes the best medicine starts with a long conversation.', fee: 80},
  {id: 'd2', name: 'Dr. Daniel Moreno', title: 'Family Physician', departmentId: 'primary', years: 9, rating: 4.8, languages: ['English', 'Spanish'], bio: 'Cares for three generations of the same families.', fee: 75},
  {id: 'd3', name: 'Dr. Priya Raman', title: 'Cardiologist', departmentId: 'cardio', years: 17, rating: 4.9, languages: ['English', 'Tamil', 'Hindi'], bio: 'Specialises in preventive cardiology and heart-rhythm care.', fee: 140},
  {id: 'd4', name: 'Dr. Lukas Weber', title: 'Interventional Cardiologist', departmentId: 'cardio', years: 12, rating: 4.7, languages: ['English', 'German'], bio: 'Minimally invasive procedures with fast recovery.', fee: 150},
  {id: 'd5', name: 'Dr. Sofia Marchetti', title: 'Pulmonologist', departmentId: 'recovery', years: 11, rating: 4.9, languages: ['English', 'Italian'], bio: 'Leads our recovery programme for post-viral fatigue and breathlessness.', fee: 120},
  {id: 'd6', name: 'Dr. Kwame Mensah', title: 'Rehabilitation Medicine', departmentId: 'recovery', years: 8, rating: 4.8, languages: ['English', 'Twi'], bio: 'Builds pacing plans that respect your energy.', fee: 110},
  {id: 'd7', name: 'Dr. Hannah Lindqvist', title: 'Obstetrics & Gynecology', departmentId: 'womens', years: 15, rating: 4.9, languages: ['English', 'Swedish'], bio: 'Calm, clear and always on your side.', fee: 130},
  {id: 'd8', name: 'Dr. Meera Nair', title: 'Pediatrician', departmentId: 'peds', years: 10, rating: 4.9, languages: ['English', 'Malayalam'], bio: 'Makes the doctor visit something kids look forward to.', fee: 85},
  {id: 'd9', name: 'Dr. Omar Haddad', title: 'Orthopedic Surgeon', departmentId: 'ortho', years: 16, rating: 4.8, languages: ['English', 'Arabic'], bio: 'Sports injuries, joint replacement and everything between.', fee: 160},
  {id: 'd10', name: 'Dr. Elena Petrova', title: 'Psychiatrist', departmentId: 'mind', years: 13, rating: 4.9, languages: ['English', 'Russian'], bio: 'Combines therapy and medication with unhurried appointments.', fee: 135},
  {id: 'd11', name: 'Dr. James Whitfield', title: 'Dermatologist', departmentId: 'derm', years: 7, rating: 4.7, languages: ['English'], bio: 'Evidence-led skin care without the upsell.', fee: 105},
];

export const visitTypes = [
  {id: 'in-person', label: 'In-person visit', hint: 'At our clinic'},
  {id: 'video', label: 'Video consultation', hint: 'From home, 20–30 min'},
  {id: 'follow-up', label: 'Follow-up visit', hint: 'For existing patients'},
];

export const faqs = [
  {q: 'How do I book an appointment?', a: 'Choose a specialty, pick a doctor, select a date and time, and confirm your details. You will get a confirmation code instantly.'},
  {q: 'Can I reschedule or cancel?', a: 'Yes. Open My appointments and cancel there. Please give at least 24 hours’ notice so the slot can go to another patient.'},
  {q: 'Do you accept insurance?', a: 'We work with most major insurers. Add your provider when booking and our desk will verify coverage before your visit.'},
  {q: 'What should I bring?', a: 'A photo ID, your insurance card, a list of current medications and any recent test results.'},
  {q: 'Is there a video option?', a: 'Most specialties offer secure video consultations. Choose “Video consultation” when booking.'},
];

export function departmentOf(id: string): Department {
  const found = departments.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown department: ${id}`);
  return found;
}

export function doctorOf(id: string): Doctor {
  const found = doctors.find((d) => d.id === id);
  if (!found) throw new Error(`Unknown doctor: ${id}`);
  return found;
}
