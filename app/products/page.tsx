import { getAllProducts } from '@/controllers/products';
import Link from 'next/link';
import React from 'react'

const ProductsPage = async () => {
 const products = await getAllProducts();
 console.log(products);

 if (!products.success) { 
    return <div className='text-center text-red-500  bg-red-100 rounded-md p-2 '>Error: {products.error}</div>
 }

 if (products.products.length === 0) {
    return <div className='text-center text-red-500  bg-red-100 rounded-md p-2 '>No products found. try adding some products from the <Link href='/admin' className='text-blue-500' >admin panel</Link></div>
 }

  return (
    <div>

        <p className='font-bold text-center text-md m-5 bg-yellow-400 rounded-md p-2 '>This page utilises an API (GET /api/products) to fetch products
                from a database and display them in a list.</p>

             <div className='grid grid-cols-2 gap-5 items-center justify-center'>
                {products.products.map((product) => (
                    <div key={product._id} className='flex flex-col items-center justify-center'>
                        <h2 className='text-2xl font-bold'>{product.name}</h2>
                        <img src={product.image} alt={product.name} className='w-20 h-20 rounded-md' />
                        <p className='text-sm'>{product.description}</p>
                        <p className='text-sm'>{product.price}</p>
                        <p className='text-sm'>{product.stock}</p>
                    </div>
                ))}


             </div>
    </div>
  )
}

export default ProductsPage