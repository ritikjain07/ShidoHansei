import Link from 'next/link'
import Image from 'next/image'
import React from 'react'
import { Button } from "@/components/ui/button"
import { dummyInterviews } from '@/constants'
import InterviewCard from '@/components/InterviewCard'

const Page = () => {
    return (
        <>
        <section className='card-cta'>
            <div className='flex flex-row items-center justify-between gap-8'>
                {/* Left column - Text content */}
                <div className='flex flex-col gap-6 max-w-lg'>
                    <h2 className='text-2xl font-bold'>
                        Get ready for your next interview with AI Powered ShidoHansei
                    </h2>
                    <p>
                        ShidoHansei is an AI-powered platform that helps you prepare for job interviews by providing personalized feedback and guidance. With ShidoHansei, you can practice your interview skills and get real-time feedback on your performance.
                        Whether you&apos;re a recent graduate or an experienced professional, ShidoHansei can help you improve your interview skills and land your dream job.
                    </p>
                    <Button asChild className="btn-primary max-sm:w-full">
                        <Link href="/interview">
                            Start an Interview
                        </Link>
                    </Button>
                </div>
                
                {/* Right column - Robot image */}
                <div className="flex-shrink-0 max-sm:hidden">
                    <Image 
                        src="/robot.png" 
                        alt="AI Interview Assistant Robot" 
                        width={400} 
                        height={400} 
                        className="object-contain"
                    />
                </div>
            </div>
            
            {/* Your Interview section below */}
           
        </section>
         <section className="flex flex-col gap-6 mt-8">
                <h2 className="text-xl font-semibold">
                    Your Interview
                </h2>
                <div className='interview-section'>
                    {dummyInterviews.map((interview) => (
    <InterviewCard key={interview.id} {...interview} />
))}
                </div>
            </section>

            <section className='flex flex-col gap-6 mt-8'>
                <h2>
                    Take an interview
                </h2>

                <div className='interview-section'>
                    {dummyInterviews.map((interview)=>(

                        <InterviewCard key={interview.id} {...interview}/>
                    ))}
                    {/* <p>
                        there is no interview available;
                    </p> */}


                </div>

            </section>
        </>
    )
}
export default Page