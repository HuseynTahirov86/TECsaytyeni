'use server'

import { z } from 'zod'
import { db } from './firebase'
import { collection, addDoc, query, where, getDocs, doc, Timestamp, updateDoc, getDoc, serverTimestamp } from 'firebase/firestore'
import bcrypt from 'bcryptjs'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { getUser, getNextCertificateSequence, getUserById } from './data'

// Authentication Schema
const LoginSchema = z.object({
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(1, { message: 'Şifrə daxil edilməlidir.' }),
})

const RegisterSchema = z.object({
  firstName: z.string().min(3, { message: 'Ad ən azı 3 simvoldan ibarət olmalıdır.' }),
  lastName: z.string().min(3, { message: 'Soyad ən azı 3 simvoldan ibarət olmalıdır.' }),
  designation: z.string({required_error: "Təyinat seçilməlidir."}),
  specialization: z.string().min(3, { message: 'İxtisas ən azı 3 simvoldan ibarət olmalıdır.' }),
  course: z.string().min(1, { message: 'Kurs daxil edilməlidir.' }),
  email: z.string().email({ message: 'Düzgün e-poçt ünvanı daxil edin.' }),
  password: z.string().min(6, { message: 'Şifrə ən azı 6 simvoldan ibarət olmalıdır.' }),
})

// TETI Register Schema - yeni əlavə edildi
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
})

export async function registerUser(prevState: any, formData: FormData) {
  
  const validatedFields = RegisterSchema.safeParse(
    Object.fromEntries(formData.entries())
  )

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Məlumatlarınızı yoxlayın. Qeydiyyat uğursuz oldu.',
    }
  }

  const { firstName, lastName, designation, specialization, course, email, password } = validatedFields.data
  
  try {
    // Check if user already exists
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { message: 'Bu e-poçt ünvanı ilə artıq istifadəçi mövcuddur.' }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    const docRef = await addDoc(collection(db, 'users'), {
      name: `${firstName} ${lastName}`,
      firstName,
      lastName,
      designation,
      specialization,
      course,
      email,
      password: hashedPassword,
      createdAt: new Date(),
    })

    // Qeydiyyatdan sonra avtomatik giriş
    const sessionData = {
      id: docRef.id,
      email: email,
      name: `${firstName} ${lastName}`,
      userType: 'user'
    }

    const cookiesStore = cookies()
    cookiesStore.set({
      name: '__session',
      value: JSON.stringify(sessionData),
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 7 gün
      path: '/'
    })

    redirect('/account')
    
  } catch (error) {
    console.error(error);
    return { message: 'Verilənlər bazası xətası: Qeydiyyat uğursuz oldu.' }
  }
}

// TETI Register Function - yeni əlavə edildi
export async function registerTetiUser(prevState: any, formData: FormData) {
  // FormData-dan array məlumatları düzgün almaq
  const advisors = formData.getAll('advisors').filter(advisor => advisor.toString().trim() !== '');
  const subjects = formData.getAll('subjects').filter(subject => subject.toString().trim() !== '');
  
  const formObject = {
    fullName: formData.get('fullName'),
    faculty: formData.get('faculty'),
    specialization: formData.get('specialization'),
    studyLanguage: formData.get('studyLanguage'),
    advisors,
    subjects,
    phone: formData.get('phone'),
    email: formData.get('email'),
    password: formData.get('password'),
  };

  const validatedFields = TetiRegisterSchema.safeParse(formObject);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Məlumatlarınızı yoxlayın. Qeydiyyat uğursuz oldu.',
      success: false,
    }
  }

  const { fullName, faculty, specialization, studyLanguage, advisors: validatedAdvisors, subjects: validatedSubjects, phone, email, password } = validatedFields.data;
  
  try {
    // Check if user already exists
    const q = query(collection(db, "tetiUsers"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
      return { 
        message: 'Bu e-poçt ünvanı ilə artıq istifadəçi mövcuddur.',
        success: false,
        errors: {}
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    await addDoc(collection(db, 'tetiUsers'), {
      fullName,
      faculty,
      specialization,
      studyLanguage,
      advisors: validatedAdvisors,
      subjects: validatedSubjects,
      phone,
      email,
      password: hashedPassword,
      userType: 'teti',
      createdAt: serverTimestamp(),
    });
    
    return {
      message: 'Qeydiyyat uğurla tamamlandı!',
      success: true,
      errors: {}
    }
    
  } catch (error) {
    console.error('TETI Registration error:', error);
    return { 
      message: 'Verilənlər bazası xətası: Qeydiyyat uğursuz oldu.',
      success: false,
      errors: {}
    }
  }
}

export async function authenticate(
  prevState: string | undefined,
  formData: FormData,
) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  })

  if (!validatedFields.success) {
    return 'E-poçt və ya şifrə düzgün daxil edilməyib.'
  }

  const { email, password } = validatedFields.data

  try {
    // İlk öncə normal user-lərdə axtaraq
    const user = await getUser(email)
    
    if (user) {
      // Şifrəni yoxlayaq
      const isValidPassword = await bcrypt.compare(password, user.password)
      
      if (isValidPassword) {
        // Session məlumatlarını hazırlayaq
        const sessionData = {
          id: user.id,
          email: user.email,
          name: user.name,
          userType: 'user'
        }

        // Cookie yaradıq
        const cookiesStore = cookies()
        cookiesStore.set({
          name: '__session',
          value: JSON.stringify(sessionData),
          httpOnly: false,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 60 * 60 * 24 * 7, // 7 gün
          path: '/'
        })

        const callbackUrl = formData.get('redirectTo') as string || '/account'
        redirect(callbackUrl)
      }
    }

    return 'E-poçt və ya şifrə yanlışdır.'
    
  } catch (error) {
    console.error('Authentication error:', error)
    return 'Giriş zamanı xəta baş verdi.'
  }
}

export async function logout() {
  const cookiesStore = cookies()
  cookiesStore.delete('__session')
  redirect('/training-login')
}

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
        return `TEC-${year}-${randomSequence}`;
    }
}

export async function completeTrainingAndGenerateCertificate(registrationId: string) {
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
        if (regData.status === 'tamamlandı' && regData.certificateId) {
            return { success: true, certificateId: regData.certificateId, message: "Təlim artıq tamamlanıb." };
        }
        
        const trainingRef = doc(db, 'trainings', regData.trainingId);
        const trainingDoc = await getDoc(trainingRef);
        
        if (!trainingDoc.exists()) {
             return { success: false, message: 'Təlim tapılmadı.' };
        }
        
        const trainingData = trainingDoc.data();
        let certificateId = null;

        if (trainingData.hasCertificate) {
            certificateId = regData.certificateId || await generateUniqueCertificateId();
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
    
    // Check if already registered
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