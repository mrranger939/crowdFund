import { Campaign } from '@/utils/interfaces'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaCoins, FaUsers } from 'react-icons/fa'

const CampaignCard: React.FC<{ campaign: Campaign }> = ({ campaign }) => {
  const progressPercentage = Math.min(
    (campaign.amountRaised / campaign.goal) * 100,
    100
  )

  return (
    <div className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden hover:shadow-2xl transition-shadow duration-300">
      <Image
        src={campaign.imageUrl}
        alt={`${campaign.title} campaign`}
        width={300}
        height={150}
        className="w-full h-48 object-cover"
      />

      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 truncate">
          {campaign.title}
        </h2>
        <p className="text-gray-600 text-sm mt-2 truncate">
          {campaign.description.length > 100
            ? `${campaign.description.substring(0, 100)}...`
            : campaign.description}
        </p>
        <div className="mt-4">
          <div className="h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-green-500 rounded-full"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <div className="flex justify-between items-center mt-2 text-sm">
            <span className="text-gray-700 flex items-center space-x-1">
              <FaCoins className="text-green-500" />
              <strong>{campaign.amountRaised}</strong> SOL Raised
            </span>
            <span className="text-gray-700 flex items-center space-x-1">
              <FaUsers className="text-black" />
              <strong>{campaign.donors}</strong> Donors
            </span>
          </div>
        </div>
        <Link
          href={`/campaign/${campaign.publicKey}`}
          className="mt-4 w-full bg-green-600 hover:bg-green-700
          text-white text-sm font-semibold py-2 px-4 rounded-lg block text-center"
        >
          View Campaign
        </Link>
      </div>
    </div>
  )
}

export default CampaignCard
