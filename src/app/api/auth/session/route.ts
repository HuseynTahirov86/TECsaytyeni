
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { getUserById, getTetiUserById } from '@/lib/data';
 
export async function GET() {
  const adminSessionCookie = cookies().get('__admin_session');
  if (adminSessionCookie) {
    try {
      const sessionData = JSON.parse(adminSessionCookie.value);
      if (sessionData.role === 'admin') {
        return NextResponse.json(sessionData);
      }
    } catch (error) {
       // Invalid cookie, fall through to check user session
    }
  }

  const userSessionCookie = cookies().get('__session');
  if (userSessionCookie) {
    try {
      const sessionData = JSON.parse(userSessionCookie.value);
      if (sessionData.id && sessionData.userType) {
        let user;
        if (sessionData.userType === 'teti') {
            user = await getTetiUserById(sessionData.id);
        } else {
            user = await getUserById(sessionData.id);
        }

        if (user) {
            return NextResponse.json({
                id: user.id,
                email: user.email,
                name: user.name || user.fullName, // Adjust for different user types
                userType: sessionData.userType,
            });
        }
      }
    } catch (error) {
       // Invalid cookie
    }
  }

  return NextResponse.json({ error: 'No active session found' }, { status: 401 });
}
