
export type User = {
  id: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
  password?: string; // Should be optional as we don't always fetch it
  designation: string;
  specialization: string;
  course: string;
  image?: string;
  createdAt: any; // Firestore Timestamp
};

export type TetiUser = {
  id: string;
  fullName: string;
  faculty: string;
  specialization: string;
  studyLanguage: string;
  advisors: string[];
  subjects: string[];
  topics: string[];
  phone: string;
  email: string;
  password?: string;
  createdAt: any; // Firestore Timestamp
};
