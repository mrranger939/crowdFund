'use client'

import React from 'react'
import { campaigns as dummyCampaigns, dummyProgramState } from '@/data'
import CampaignCard from '@/components/CampaignCard'
import AccountDetails from '@/components/AccountDetails'

export default function Page() {
  const publicKey = '0x1234567890abcdef' // Static publicKey for the demo

  // Use dummy data
  const campaigns = dummyCampaigns
  const programState = dummyProgramState

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Left side */}
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold mb-6">My Campaigns</h1>
        {campaigns.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {campaigns.map((campaign) => (
              <CampaignCard key={campaign.cid} campaign={campaign} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <h2 className="text-2xl font-semibold text-gray-800">
              You have no campaigns available at the moment
            </h2>
            <p className="text-gray-600 mt-4">
              Launch your first campaign and make a difference!
            </p>

            <div className="mt-6">
              <a
                href="/create"
                className="inline-block bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg"
              >
                Create a Campaign
              </a>
            </div>
          </div>
        )}
      </div>

      {programState && programState.platformAddress === publicKey && (
        <div className="md:col-span-1">
          <AccountDetails programState={programState} />
        </div>
      )}
    </div>
  )
}
