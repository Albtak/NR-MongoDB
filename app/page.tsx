'use client'
import { useRouter } from 'next/navigation'
import React from 'react'

const LandingPage = () => {
  const router = useRouter()
  return (
    <div className='flex flex-col items-center justify-center h-screen'>
      <h1 className='text-4xl font-bold'>NOSQL DATABASE</h1>

      <p className='text-lg'>This is a simple landing page for a nosql database.</p>

      <div className='flex gap-4'>
        <button className='bg-blue-500 text-white px-4 py-2 rounded-md' onClick={() => router.push('/products')}>Explore</button>
        <button className='bg-green-500 text-white px-4 py-2 rounded-md' onClick={() => window.open('https://github.com/britelink/NR-MongoDB', '_blank')}>Fork GitRepo</button>
      </div>

      <footer className='text-center text-sm mt-10'>
        <p>Copyright © 2026 BriteEducation</p>

        <p>This is a tutorial project for the course offered by <a href="https://www.edu.briteeducation.io" className='text-blue-500'>BriteEducation</a></p>
      </footer>
    </div>
  )
}

export default LandingPage