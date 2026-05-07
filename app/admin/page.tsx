'use client'
import { ProductData } from '@/lib/types'
import { createProduct } from '@/controllers/products'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const AdminPage = () => {
  const [error, setError] = useState<string | null>(null)
  const [productToCreate, setProductToCreate] = useState<ProductData | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!productToCreate) return

    let isMounted = true

   fetch('/api/products', {
    method: 'POST',
    body: JSON.stringify(productToCreate),
   })   
   .then(res => res.json())
   .then(data => {
    if (data.success) {
      router.push('/products')
    } else {
      setError(data.error || 'Failed to create product')
    }
   })
  }, [productToCreate, router])

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)

    const formData = new FormData(event.currentTarget)
    const productData = {
      name: formData.get('name') as string,
      category: formData.get('category') as string,
      price: Number(formData.get('price')),
      description: formData.get('description') as string,
      image: formData.get('image') as string,
      stock: Number(formData.get('stock')),
    } as ProductData

    setProductToCreate(productData)
  }

  return (
    <div className='flex flex-col items-center justify-center h-screen'>
        <h1 className='text-4xl font-bold'>Admin Panel</h1>
        <p className='text-lg'>This is the admin panel for the database.</p>
        <Link href='/products' className='text-blue-500'>Go to products page</Link>
       <div className='mx-auto'>
       <form className=' flex flex-col gap-5 border-2 border-gray-300 rounded-md p-4' onSubmit={handleCreate}>
            <input className='border-2 border-gray-300 rounded-md p-2' type='text' name='name' placeholder='Name' />
            <input className='border-2 border-gray-300 rounded-md p-2' type='text' name='category' placeholder='Category' />
            <input className='border-2 border-gray-300 rounded-md p-2' type='number' name='price' placeholder='Price' />
            <input className='border-2 border-gray-300 rounded-md p-2' type='text' name='description' placeholder='Description' />
            <input className='border-2 border-gray-300 rounded-md p-2' type='text' name='image' placeholder='Image' />
            <input className='border-2 border-gray-300 rounded-md p-2' type='number' name='stock' placeholder='Stock' />
            <button className='bg-blue-500 text-white px-4 py-2 rounded-md' type='submit'>Create Product</button>
        </form>
       </div>
       {error && <div className='text-red-500'>{error}</div>}
    </div>
  )
}

export default AdminPage