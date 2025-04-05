'use client'

import { createCampaign, getProvider } from '@/services/blockchain'
import { useWallet } from '@solana/wallet-adapter-react'
import { useMemo, useState } from 'react'
import { toast } from 'react-toastify'

export default function Page() {
  const {publicKey, sendTransaction, signTransaction} = useWallet()
  const program = useMemo(()=> getProvider(publicKey, signTransaction, sendTransaction), [publicKey, signTransaction, sendTransaction])
  // Local form state
  const [form, setForm] = useState({
    title: '',
    description: '',
    image_url: '',
    goal: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!publicKey) return toast.warn('Please connect wallet!')
    await toast.promise(

      new Promise<void>(async (resolve, reject)=>{
        try {
          const {title, description, image_url, goal} = form
          const tx:any = await createCampaign(
            program!,
            publicKey!,
            title,
            description, 
            image_url,
            Number(goal)
          )
          setForm({
            title: '',
            description: '',
            image_url: '',
            goal: '',
          })
          console.log(tx)
          resolve(tx)
        } catch (e) {
          reject(e)
        }
      })
      ,
      {
        pending: 'Approve transaction',
        success: 'Transaction successfull',
        error: 'Encountered a error'
      }
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create Campaign</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="What's the grand title?"
          maxLength={64}
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="url"
          placeholder="Paste that fancy image URL here!"
          maxLength={256}
          value={form.image_url}
          onChange={(e) => setForm({ ...form, image_url: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />
        <input
          type="text"
          placeholder="How many SOLs for your dream?"
          value={form.goal}
          onChange={(e) => {
            const value = e.target.value
            if (/^\d*\.?\d{0,2}$/.test(value)) {
              setForm({ ...form, goal: value })
            }
          }}
          className="w-full p-2 border rounded text-black"
          required
        />
        <textarea
          placeholder="Tell us the epic tale of your project..."
          maxLength={512}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="w-full p-2 border rounded text-black"
          required
        />

        <div className="mt-4 space-x-4 flex justify-start items-center">
          <button
            type="submit"
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
          >
            Create Now
          </button>
        </div>
      </form>
    </div>
  )
}
