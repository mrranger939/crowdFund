'use client'

import { useParams } from 'next/navigation'
import { useState } from 'react'
import { campaigns } from '@/data'
import Link from 'next/link'

export default function Page() {
  const { cid } = useParams()

  // Static data: Find the campaign using `cid`
  const campaign = campaigns.find((c) => c.publicKey === (cid as string))

  // Local form state
  const [form, setForm] = useState({
    title: campaign?.title || '',
    description: campaign?.description || '',
    image_url: campaign?.imageUrl || '',
    goal: campaign?.goal || '',
  })

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    console.log('Form Submitted:', form)
    alert('Campaign updated successfully!')
  }

  // Fallback if campaign not found
  if (!campaign) return <h4>Campaign not found</h4>

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Update Campaign</h1>
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
            Update Now
          </button>

          <Link
            href={`/campaign/${cid}`}
            className="bg-black hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg text-center"
          >
            Back
          </Link>
        </div>
      </form>
    </div>
  )
}
