import { isAuthenticated } from '@/lib/actions/auth.action'
import Link from 'next/link'
import { ReactNode } from 'react'
import { redirect } from 'next/navigation';
const RootLayout = async ({ children }: { children: ReactNode }) => {
    const isUserAuthenticated = await isAuthenticated();
    if (!isUserAuthenticated) redirect('/sign-in');
    return (
        <div className='root-layout'>
            <nav>
                <Link href='/' className='flex items-center gap-2'>
                    <img src='/logo.png' alt='logo' className='w-8 h-8' />
                    <h2 className='text-primary-100'>ShidoHansei</h2>
                </Link>
            </nav>
            {children}
        </div>
    )
}

export default RootLayout