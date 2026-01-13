
import { db } from './firebase';
import { collection, query, where, getDocs, doc, getDoc, Timestamp, orderBy, runTransaction, increment, updateDoc, arrayUnion } from 'firebase/firestore';
import type { User, TetiUser } from './definitions';
import { unstable_noStore as noStore } from 'next/cache';
import type { Training } from '@/app/ndutecnaxcivan19692025tec/trainings/training-form';

export async function getUser(email: string): Promise<User | undefined> {
  noStore();
  try {
    const q = query(collection(db, 'users'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return undefined;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    return {
      id: userDoc.id,
      name: userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      password: userData.password,
      designation: userData.designation,
      specialization: userData.specialization,
      course: userData.course,
      image: userData.image,
      createdAt: userData.createdAt,
    };
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch user.');
  }
}

export async function getTetiUserByEmail(email: string): Promise<TetiUser | undefined> {
  noStore();
  try {
    const q = query(collection(db, 'tetiUsers'), where('email', '==', email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return undefined;
    }
    
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    
    return {
      id: userDoc.id,
      ...userData
    } as TetiUser;
  } catch (error) {
    console.error('Database Error:', error);
    throw new Error('Failed to fetch TETİ user.');
  }
}


export async function getUserById(id: string): Promise<User | undefined> {
    noStore();
    try {
        const userRef = doc(db, 'users', id);
        const userDoc = await getDoc(userRef);

        if (!userDoc.exists()) {
            return undefined;
        }

        const userData = userDoc.data();

        return {
            id: userDoc.id,
            name: userData.name,
            firstName: userData.firstName,
            lastName: userData.lastName,
            email: userData.email,
            password: userData.password,
            designation: userData.designation,
            specialization: userData.specialization,
            course: userData.course,
            image: userData.image,
            createdAt: userData.createdAt,
        };
    } catch (error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch user by ID.');
    }
}

export async function getTetiUserById(id: string): Promise<TetiUser | null> {
    noStore();
    try {
        const userRef = doc(db, 'tetiUsers', id);
        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            return null;
        }
        return { id: userDoc.id, ...userDoc.data() } as TetiUser;
    } catch (error) {
        console.error('Error fetching TETİ user:', error);
        return null;
    }
}

export interface TrainingRegistration {
    id: string;
    userId: string;
    trainingId: string;
    trainingTitle: string;
    trainingSlug: string; 
    status: string;
    fullName: string;
    submittedAt: Timestamp;
    completionDate?: Timestamp;
    certificateId?: string;
    quizResult?: {
        answers: Record<number, number>;
        score: number;
        total: number;
    }
}

export async function getCompletedRegistrations(userId: string): Promise<TrainingRegistration[]> {
    noStore();
    try {
        const q = query(
            collection(db, "trainingRegistrations"),
            where("userId", "==", userId),
            where("status", "==", "tamamlandı")
        );

        const querySnapshot = await getDocs(q);
        const registrations = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TrainingRegistration));
        
        registrations.sort((a, b) => {
            const dateA = a.completionDate ? a.completionDate.toMillis() : 0;
            const dateB = b.completionDate ? b.completionDate.toMillis() : 0;
            return dateB - dateA;
        });

        return registrations;

    } catch (error) {
        console.error("Error fetching completed registrations:", error);
        return [];
    }
}

export async function getCertificates(userId: string): Promise<TrainingRegistration[]> {
    noStore();
    try {
        const q = query(
            collection(db, "trainingRegistrations"),
            where("userId", "==", userId),
            where("status", "==", "tamamlandı")
        );

        const querySnapshot = await getDocs(q);
        
        const certificates = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        } as TrainingRegistration)).filter(reg => !!reg.certificateId);

        certificates.sort((a, b) => {
            const dateA = a.completionDate ? a.completionDate.toMillis() : 0;
            const dateB = b.completionDate ? b.completionDate.toMillis() : 0;
            return dateB - dateA;
        });

        return certificates;

    } catch (error) {
        console.error("Error fetching certificates:", error);
        return [];
    }
}

export async function getCertificateById(certificateId: string): Promise<TrainingRegistration | null> {
    noStore();
    try {
        const q = query(
            collection(db, "trainingRegistrations"),
            where("certificateId", "==", certificateId)
        );
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return null;
        }
        
        const docSnap = querySnapshot.docs[0];
        return {
            id: docSnap.id,
            ...docSnap.data()
        } as TrainingRegistration;

    } catch (error) {
        console.error("Error fetching certificate by ID:", error);
        return null;
    }
}

export async function getNextCertificateSequence(year: number): Promise<number> {
    const counterRef = doc(db, 'counters', `certificateCounter_${year}`);
    
    try {
        const newSequence = await runTransaction(db, async (transaction) => {
            const counterDoc = await transaction.get(counterRef);
            
            if (!counterDoc.exists()) {
                transaction.set(counterRef, { current: 1 });
                return 1;
            }
            
            const newCurrent = counterDoc.data().current + 1;
            transaction.update(counterRef, { current: newCurrent });
            return newCurrent;
        });
        
        return newSequence;

    } catch (e) {
        console.error("Transaction failed: ", e);
        throw new Error("Could not get the next certificate sequence.");
    }
}
