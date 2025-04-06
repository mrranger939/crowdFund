'use client'

import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'next/navigation'
import CampaignDetails from '@/components/CampaignDetails'
import CampaignDonate from '@/components/CampaignDonate'
import DonationsList from '@/components/DonationsList'
import WithdrawalList from '@/components/WithdrawalList'
import Image from 'next/image'
import WithdrawModal from '@/components/WithdrawModal'
import DeleteModal from '@/components/DeleteModal'
import { dummyTransactions } from '@/data'
import { fetchAllDonations, fetchAllWithdrawals, fetchCampaignDetails, getProviderReadOnly } from '@/services/blockchain'
import { Campaign, RootState } from '@/utils/interfaces'
import { useSelector } from 'react-redux'

export default function CampaignPage() {
  const { cid } = useParams()
  const program = useMemo(()=>getProviderReadOnly(), [])
  /* const [campaign, setCampaign] = useState<Campaign | null>(null); */

  const {campaign, donations, withdrawals} = useSelector((states: RootState)=> states.globalStates)

    useEffect(()=>{
      if (cid) {
        const fetchDetails = async()=>{
          await fetchCampaignDetails(program, cid as string)
          await fetchAllDonations(program, cid as string)
          await fetchAllWithdrawals(program, cid as string)
        }
        fetchDetails()
      }
      
    }, [program, cid])
  

  // Find the campaign by `cid`
  // const campaign = campaigns.find((c) => c.publicKey === cid)

  // Filter transactions based on the `cid`
/*   const donations = dummyTransactions.filter(
    (tx) => tx.cid === campaign?.cid && tx.credited
  ) */

  if (!campaign) return <h4>Campaign not found</h4>

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gray-100 pb-10">
        {/* Hero Section */}
        <div className="relative">
          <Image
            src={campaign.imageUrl}
            alt={campaign.title}
            width={1920} // Adjust this to match your image dimensions
            height={1080} // Adjust this to match your image dimensions
            className="w-full h-64 object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white text-center">
              {campaign.title}
            </h1>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-6 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <CampaignDetails campaign={campaign} />
            <CampaignDonate campaign={campaign} pda={cid as string} />
          </div>
        </div>
      </div>
      <DonationsList donations={donations} />
      <WithdrawalList withdrawals={withdrawals} />
      <WithdrawModal campaign={campaign} pda={cid as string} />
      <DeleteModal campaign={campaign} pda={cid as string} />
    </div>
  )
}
