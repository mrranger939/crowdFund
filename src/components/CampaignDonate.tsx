import React, { FormEvent, useState } from 'react'
import Link from 'next/link'
import { FaDollarSign, FaDonate, FaEdit, FaTrashAlt } from 'react-icons/fa'
import { Campaign } from '@/utils/interfaces'

const CampaignDonate: React.FC<{ campaign: Campaign; pda: string }> = ({
  campaign,
  pda,
}) => {
  const [amount, setAmount] = useState('')

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (Number(amount) + campaign.amountRaised > campaign.goal) {
      return alert('Amount exceeds campaign goal')
    }

    console.log(`Donated ${amount} SOL to campaign ID: ${campaign.cid}`)
    alert(`Donation successful! ${amount} SOL contributed.`)
    setAmount('')
  }

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaDonate className="text-green-600" />
          Donate
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="donationAmount"
            className="block text-gray-700 font-semibold mb-2"
          >
            Amount (SOL)
          </label>
          <input
            type="text"
            name="donationAmount"
            placeholder={`1 SOL (${(
              campaign.goal - campaign.amountRaised
            ).toFixed(2)} SOL remaining)`}
            value={amount}
            onChange={(e) => {
              const value = e.target.value
              if (/^\d*\.?\d{0,2}$/.test(value)) {
                setAmount(value)
              }
            }}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            min="1"
            required
          />
          <button
            type="submit"
            disabled={
              !amount ||
              !campaign.active ||
              campaign.amountRaised >= campaign.goal
            }
            className={`mt-4 w-full bg-green-600 hover:bg-green-700 ${
              !amount ||
              !campaign.active ||
              campaign.amountRaised >= campaign.goal
                ? 'opacity-50 cursor-not-allowed'
                : ''
            } text-white font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2`}
          >
            <FaDonate />
            Donate Now
          </button>
        </form>

        {campaign.creator === '0xCreatorAddress' && (
          <div className="mt-6 flex flex-wrap gap-2 md:flex-nowrap md:gap-0">
            <Link
              href={`/campaign/edit/${pda}`}
              className="bg-transparent hover:bg-green-600 text-green-600 hover:text-white
              font-semibold py-2 px-4 flex-1 md:rounded-l-lg flex items-center justify-center
              border border-green-600 hover:border-transparent"
            >
              <FaEdit />
              Edit
            </Link>
            <button
              type="button"
              className="bg-green-600 hover:bg-green-700 text-white
              font-semibold py-2 px-4 flex-1 flex items-center justify-center"
            >
              <FaTrashAlt />
              Delete
            </button>

            <button
              className="bg-transparent hover:bg-green-600 text-green-600 hover:text-white
              font-semibold py-2 px-4 flex-1 md:rounded-r-lg flex items-center justify-center
              border border-green-600 hover:border-transparent"
            >
              <FaDollarSign />
              Payout
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default CampaignDonate
