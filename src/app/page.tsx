'use client'

import CampaignCard from '@/components/CampaignCard'
import CampaignHero from '@/components/CampaignHero'
import { campaigns as dummyCampaign } from '../data'

export default function Page() {
  // Use the dummy data directly
  const campaigns = dummyCampaign

  return (
    <div className="container mx-auto p-6">
      <CampaignHero />
      <div className="h-10" />
      <h1 className="text-3xl font-bold mb-6">Explore Campaigns</h1>
      {campaigns.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <CampaignCard key={campaign.cid} campaign={campaign} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-800">
            No campaigns available at the moment
          </h2>
          <p className="text-gray-600 mt-4">
            Be the first to create a campaign and make a difference!
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
  )
}
