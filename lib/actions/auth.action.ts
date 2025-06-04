'use server';
import { auth, db } from "@/firebase/admin";
import { cookies } from "next/headers";

const ONE_WEEK = 60 * 60 * 24 * 7 * 1000; // 1 week in milliseconds

export async function signUp(params: SignUpParams) {
    const {uid, name, email} = params;

    try {
        const userRecord = await db.collection('users').doc(uid).get();

        if(userRecord.exists) {
            return { 
                success: false,
                message: 'User already exists'
            };
        }

        await db.collection('users').doc(uid).set({
            name,
            email,
        });

        return {
            success: true,
            message: 'Sign up successful'
        };

    } catch (e: unknown) {
        console.error('Error during sign up:', e);

        // Type guard to safely access error properties
        if (e && typeof e === 'object' && 'code' in e && e.code === 'auth/email-already-in-use') {
            return { 
                success: false,
                message: 'Email already in use' 
            };
        }
        
        // Safe error message extraction
        const errorMessage = e instanceof Error ? e.message : 'Please try again later.';
        
        return {
            success: false,
            message: `Sign up failed: ${errorMessage}`
        }
    }
}

export async function signIn(params: SignInParams) {
    const { email, idToken } = params;

    try {
        const userRecord = await auth.getUserByEmail(email);
        if (!userRecord) {
            return { 
                success: false,
                message: 'User not found' 
            };
        }

        await setSessionCookie(idToken);
        
        return {
            success: true,
            message: 'Sign in successful'
        };

    } catch (e: unknown) {
        console.error('Error during sign in:', e);
        
        // Type guard to safely access error properties
        if (e && typeof e === 'object' && 'code' in e && e.code === 'auth/user-not-found') {
            return { 
                success: false,
                message: 'User not found' 
            };
        }

        // Safe error message extraction
        const errorMessage = e instanceof Error ? e.message : 'Please try again later.';

        return {
            success: false,
            message: `Sign in failed: ${errorMessage}`
        }
    }
}

export async function setSessionCookie(idToken: string) {
    const sessionCookie = await auth.createSessionCookie(idToken, {
        expiresIn: ONE_WEEK      
    });
    
    // ONE_WEEK in milliseconds
    const ONE_WEEK_SECONDS = Math.floor(ONE_WEEK / 1000); // Convert to seconds
    
    // FIXED: Await the cookies() function before using its methods
    const cookieStore = await cookies();
    cookieStore.set({
        name: 'session',
        value: sessionCookie,
        maxAge: ONE_WEEK_SECONDS,
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        path: '/',
        sameSite: 'lax',
    });
    
    return { success: true };
}

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('session')?.value;
    
    if(!sessionCookie) {
        return null;
    }

    try {
        const decodedClaims = await auth.verifySessionCookie(sessionCookie, true);
        const userRecord = await db.collection('users').doc(decodedClaims.uid).get();
        if (!userRecord.exists) {
            return null;
        }
        return {
            ...userRecord.data(),
            id: userRecord.id,
        } as User;

    } catch(e: unknown) {
        console.log(e);
        return null;
    }
}

export async function isAuthenticated() {
    const user = await getCurrentUser();
    return !!user;
}