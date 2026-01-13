
'use server'

import { z } from 'zod'
import { db } from './firebase'
import { collection, addDoc, query, where, getDocs, doc, Timestamp, updateDoc, getDoc, serverTimestamp, arrayUnion } from 'firebase/firestore'
import { redirect } from 'next/navigation'
import { getNextCertificateSequence, getUserById, getUser, getTetiUserByEmail } from './data'
import { cookies } from 'next/headers'

// ==================== COOKIE CONFIGURATIONS ====================
const USER_COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: '/',
}

const ADMIN_COOKIE_CONFIG = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict' as const,
    maxAge: 60 * 60 * 8, // 8 hours
    path: '/',
}

// ==================== SCHEMAS ====================
const LoginSchema = z.object({
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(1, { message: 'Şifrə daxil edilməlidir.' }),
});

const RegisterSchema = z.object({
  firstName: z.string().min(3, { message: 'Ad ən azı 3 simvoldan ibarət olmalıdır.' }),
  lastName: z.string().min(3, { message: 'Soyad ən azı 3 simvoldan ibarət olmalıdır.' }),
  designation: z.string({required_error: "Təyinat seçilməlidir."}),
  specialization: z.string().min(3, { message: 'İxtisas ən azı 3 simvoldan ibarət olmalıdır.' }),
  course: z.string().min(1, { message: 'Kurs daxil edilməlidir.' }),
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
})

const TetiRegisterSchema = z.object({
  fullName: z.string().min(5, { message: 'Ad, Soyad, Ata adı ən azı 5 simvoldan ibarət olmalıdır.' }),
  faculty: z.string().min(1, { message: 'Fakültə seçilməlidir.' }),
  specialization: z.string().min(3, { message: 'İxtisas ən azı 3 simvoldan ibarət olmalıdır.' }),
  studyLanguage: z.string().min(1, { message: 'Tədris dili daxil edilməlidir.' }),
  advisors: z.array(z.string().min(1, { message: 'Elmi rəhbər adı boş ola bilməz.' })),
  subjects: z.array(z.string().min(1, { message: 'Fənn adı boş ola bilməz.' })),
  phone: z.string().min(10, { message: 'Əlaqə nömrəsi ən azı 10 simvoldan ibarət olmalıdır.' }),
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
});


// ==================== AUTHENTICATION ACTIONS ====================

export async function authenticateUser(prevState: string | undefined, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return 'E-poçt və ya şifrə düzgün daxil edilməyib.';
  }
  const { email, password } = validatedFields.data;
  const redirectTo = formData.get('redirectTo') as string || '/account';

  try {
    const user = await getUser(email.trim().toLowerCase());
    if (!user || user.password !== password) {
      return 'E-poçt və ya şifrə yanlışdır.';
    }

    const sessionData = { id: user.id, userType: 'user' };
    cookies().set('__session', JSON.stringify(sessionData), USER_COOKIE_CONFIG);

  } catch (error) {
    console.error('Training User Auth Error:', error);
    return 'Giriş zamanı daxili server xətası baş verdi.';
  }
  redirect(redirectTo);
}

export async function authenticateTetiUser(prevState: string | undefined, formData: FormData) {
  const validatedFields = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return 'E-poçt və ya şifrə düzgün daxil edilməyib.';
  }
  const { email, password } = validatedFields.data;
  const redirectTo = formData.get('redirectTo') as string || '/teti-account';

  try {
    const tetiUser = await getTetiUserByEmail(email.trim().toLowerCase());

    if (!tetiUser || tetiUser.password !== password) {
        return 'E-poçt və ya şifrə yanlışdır.';
    }

    const sessionData = { id: tetiUser.id, userType: 'teti' };
    cookies().set('__session', JSON.stringify(sessionData), USER_COOKIE_CONFIG);
  } catch (error) {
    console.error('TETİ User Auth Error:', error);
    return 'Giriş zamanı daxili server xətası baş verdi.';
  }
  redirect(redirectTo);
}

export async function authenticateAdmin(prevState: { message: string | null, success: boolean }, formData: FormData) {
    const parsedCredentials = LoginSchema.safeParse(Object.fromEntries(formData.entries()));

    if (!parsedCredentials.success) {
        return { message: 'Düzgün məlumatlar daxil edilməyib.', success: false };
    }
    
    const { email, password } = parsedCredentials.data;
    const cleanEmail = email.trim().toLowerCase();

    try {
        const q = query(collection(db, 'admins'), where('email', '==', cleanEmail));
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            return { message: 'E-poçt və ya şifrə yanlışdır.', success: false };
        }
        
        const adminDoc = querySnapshot.docs[0];
        const adminData = adminDoc.data();

        if (adminData.password !== password) {
            return { message: 'E-poçt və ya şifrə yanlışdır.', success: false };
        }
        
        const sessionData = { role: 'admin', loggedInAt: Date.now() };
        cookies().set('__admin_session', JSON.stringify(sessionData), ADMIN_COOKIE_CONFIG);

    } catch (error) {
        console.error('Admin authentication error:', error);
        return { message: 'Server xətası baş verdi.', success: false };
    }

    redirect('/ndutecnaxcivan19692025tec/dashboard');
}


// ==================== LOGOUT ACTIONS ====================

export async function logout() {
  cookies().set('__session', '', { expires: new Date(0), path: '/' });
  redirect('/training-login');
}

export async function logoutAdmin() {
  cookies().set('__admin_session', '', { expires: new Date(0), path: '/' });
}


// ==================== REGISTRATION ACTIONS ====================

export async function registerUser(prevState: any, formData: FormData) {
  
  const validatedFields = RegisterSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Məlumatlarınızı yoxlayın.' };
  }

  const { firstName, lastName, designation, specialization, course, email, password } = validatedFields.data;
  const cleanEmail = email.trim().toLowerCase();
  
  try {
    const q = query(collection(db, "users"), where("email", "==", cleanEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { message: 'Bu e-poçt ünvanı ilə artıq istifadəçi mövcuddur.' }
    }
    
    const docRef = await addDoc(collection(db, 'users'), {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      designation,
      specialization,
      course,
      email: cleanEmail,
      password: password, // Storing plain text password
      createdAt: serverTimestamp(),
    });

    const sessionData = { id: docRef.id, userType: 'user' };
    cookies().set('__session', JSON.stringify(sessionData), USER_COOKIE_CONFIG);
    
  } catch (error) {
    console.error('User Registration Error:', error);
    return { message: 'Verilənlər bazası xətası: Qeydiyyat uğursuz oldu.' }
  }
  redirect('/account');
}

export async function registerTetiUser(prevState: any, formData: FormData) {
  const formObject = {
    fullName: formData.get('fullName'),
    faculty: formData.get('faculty'),
    specialization: formData.get('specialization'),
    studyLanguage: formData.get('studyLanguage'),
    advisors: formData.getAll('advisors').filter(advisor => advisor.toString().trim() !== ''),
    subjects: formData.getAll('subjects').filter(subject => subject.toString().trim() !== ''),
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = TetiRegisterSchema.safeParse(formObject);

  if (!validatedFields.success) {
    return { errors: validatedFields.error.flatten().fieldErrors, message: 'Məlumatlarınızı yoxlayın.', success: false, };
  }

  const { email, password, ...rest } = validatedFields.data;
  const cleanEmail = email.trim().toLowerCase();
  
  try {
    const q = query(collection(db, "tetiUsers"), where("email", "==", cleanEmail));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { message: 'Bu e-poçt ünvanı ilə artıq TETİ istifadəçisi mövcuddur.', success: false, };
    }
    
    await addDoc(collection(db, 'tetiUsers'), {
      ...rest,
      email: cleanEmail,
      password: password, // Storing plain text password
      userType: 'teti',
      topics: [],
      createdAt: serverTimestamp(),
    });

    return { message: 'Qeydiyyat uğurla tamamlandı!', success: true };
    
  } catch (error) {
    console.error('TETİ Registration Error:', error);
    return { message: 'Verilənlər bazası xətası: Qeydiyyat uğursuz oldu.', success: false, };
  }
}

// ==================== OTHER ACTIONS ====================

// Certificate Verification
const verifyCertificateSchema = z.object({
  certificateId: z.string().min(1, 'Sertifikat kodu boş ola bilməz.'),
});

export interface CertificateVerificationResult {
  status: 'idle' | 'loading' | 'success' | 'not_found' | 'error';
  message?: string;
  data?: {
    certificateId: string;
    fullName: string;
    trainingTitle: string;
    issueDate: string;
  }
}

export async function verifyCertificate(
  prevState: CertificateVerificationResult,
  formData: FormData
): Promise<CertificateVerificationResult> {
    const validatedFields = verifyCertificateSchema.safeParse({
        certificateId: formData.get('certificateId'),
    });

    if (!validatedFields.success) {
        return {
            status: 'error',
            message: validatedFields.error.flatten().fieldErrors.certificateId?.[0] || 'Invalid input.',
        };
    }
    
    const { certificateId } = validatedFields.data;

    try {
        const q = query(collection(db, "trainingRegistrations"), where("certificateId", "==", certificateId));
        const registrationDoc = await getDocs(q);

        if (registrationDoc.empty) {
            return { status: 'not_found' };
        }
        
        const registrationData = registrationDoc.docs[0].data();

        const issueDate = registrationData.completionDate instanceof Timestamp 
            ? registrationData.completionDate.toDate() 
            : new Date(registrationData.completionDate);

        return {
            status: 'success',
            data: {
                certificateId: registrationData.certificateId,
                fullName: registrationData.fullName,
                trainingTitle: registrationData.trainingTitle,
                issueDate: issueDate.toISOString().split('T')[0],
            },
        };
    } catch (error) {
        console.error("Certificate verification error:", error);
        return { status: 'error', message: 'Verilənlər bazası ilə əlaqə qurularkən xəta baş verdi.' };
    }
}

async function generateUniqueCertificateId(): Promise<string> {
    try {
        const year = new Date().getFullYear();
        const sequence = await getNextCertificateSequence(year); 
        const paddedSequence = sequence.toString().padStart(4, '0');
        return `TEC-${year}-${paddedSequence}`;
    } catch (error) {
        console.error("Failed to generate sequential certificate ID:", error);
        const year = new Date().getFullYear();
        const randomSequence = Math.floor(1000 + Math.random() * 9000);
        return `TEC-FALLBACK-${year}-${randomSequence}`;
    }
}

export async function markTrainingAsCompleted(registrationId: string, score: number, total: number) {
    if (!registrationId) {
        return { success: false, message: 'Qeydiyyat ID-si təqdim edilməyib.' };
    }

    try {
        const regRef = doc(db, 'trainingRegistrations', registrationId);
        const regDoc = await getDoc(regRef);

        if (!regDoc.exists()) {
            return { success: false, message: 'Qeydiyyat tapılmadı.' };
        }
        
        const regData = regDoc.data();
        const trainingRef = doc(db, 'trainings', regData.trainingId);
        const trainingDoc = await getDoc(trainingRef);
        
        if (!trainingDoc.exists()) {
             return { success: false, message: 'Təlim tapılmadı.' };
        }
        
        const trainingData = trainingDoc.data();
        let certificateId = regData.certificateId || null; 
        const hasPassed = (score / total) >= 0.8;

        if (hasPassed && trainingData.hasCertificate && !certificateId) {
            certificateId = await generateUniqueCertificateId();
        }

        await updateDoc(regRef, {
            status: 'tamamlandı',
            completionDate: serverTimestamp(),
            certificateId: certificateId
        });
        
        return { success: true, certificateId: certificateId };

    } catch (error) {
        console.error("Error completing training:", error);
        return { success: false, message: 'Təlim tamamlanarkən xəta baş verdi.' };
    }
}

export async function saveQuizResult(registrationId: string, result: { answers: Record<number, number>; score: number; total: number; }) {
    if (!registrationId) {
        throw new Error("Qeydiyyat ID-si təqdim edilməyib.");
    }
    const regRef = doc(db, 'trainingRegistrations', registrationId);
    try {
        await updateDoc(regRef, { quizResult: result });
    } catch (error) {
        console.error("Error saving quiz result:", error);
        throw new Error("Test nəticələrini saxlayarkən xəta baş verdi.");
    }
}

export async function registerForTraining({
  trainingId,
  trainingTitle,
  trainingSlug,
  userId,
}: {
  trainingId: string;
  trainingTitle: string;
  trainingSlug: string;
  userId: string;
}) {
  try {
    const user = await getUserById(userId);
    if (!user) {
      throw new Error("İstifadəçi tapılmadı. Zəhmət olmasa, yenidən daxil olun.");
    }
    
    const q = query(
      collection(db, "trainingRegistrations"),
      where("userId", "==", userId),
      where("trainingId", "==", trainingId)
    );
    const existingRegistration = await getDocs(q);
    if (!existingRegistration.empty) {
        return { success: true, message: 'Siz artıq bu təlimə qeydiyyatdan keçmisiniz.' };
    }

    const docRef = await addDoc(collection(db, "trainingRegistrations"), {
      userId,
      trainingId,
      trainingTitle,
      trainingSlug,
      fullName: user.name,
      designation: user.designation,
      specialization: user.specialization,
      course: user.course,
      institution: "Naxçıvan Dövlət Universiteti",
      status: 'qeydiyyatdan keçib',
      submittedAt: serverTimestamp(),
    });

    return { success: true, registrationId: docRef.id };
  } catch (error) {
    console.error("Error registering for training: ", error);
    if (error instanceof Error) {
        return { success: false, message: error.message };
    }
    return { success: false, message: "Qeydiyyat zamanı naməlum xəta baş verdi." };
  }
}

export async function addTetiTopic(prevState: any, formData: FormData) {
    const userId = formData.get('userId') as string;
    const topic = formData.get('topic') as string;

    if (!userId || !topic) {
        return { message: 'Məlumatlar natamamdır.', success: false };
    }
    
    if (topic.length < 10) {
        return { message: 'Mövzu adı ən azı 10 simvoldan ibarət olmalıdır.', success: false };
    }

    try {
        const userRef = doc(db, 'tetiUsers', userId);
        await updateDoc(userRef, {
            topics: arrayUnion(topic)
        });
        return { message: 'Mövzu uğurla əlavə edildi!', success: true };
    } catch (error) {
        console.error("Error adding TETİ topic:", error);
        return { message: 'Server xətası baş verdi.', success: false };
    }
}
