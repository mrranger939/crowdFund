import { ProgramState } from '@/utils/interfaces'
import React, { useState } from 'react'
import { FaDonate } from 'react-icons/fa'

const AccountDetails: React.FC<{ programState: ProgramState }> = ({
  programState,
}) => {
  const [percent, setPercent] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!percent) return

    // Simulate an update transaction
    console.log(`Service fee updated to ${percent}%`)
    setPercent('')
    alert(`Service fee successfully updated to ${percent}%`)
  }

  return (
    <div>
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          <FaDonate className="text-green-600" />
          Update Service Fee
        </h2>
        <form onSubmit={handleSubmit}>
          <label
            htmlFor="donationAmount"
            className="block text-gray-700 font-semibold mb-2"
          >
            Percentage range is (1 - 15%)
          </label>
          <input
            type="text"
            name="percent"
            value={percent}
            onChange={(e) => {
              const value = e.target.value
              if (/^([1-9]|1[0-5])?$/.test(value)) {
                setPercent(value)
              }
            }}
            placeholder={`Current Fee (${programState.platformFee}%)`}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600"
            required
          />
          <button
            type="submit"
            className={`mt-4 w-full bg-green-600 hover:bg-green-700 ${
              !percent ? 'opacity-50 cursor-not-allowed' : ''
            } text-white font-semibold py-2 px-4 rounded-lg flex items-center
              justify-center gap-2`}
          >
            Update Fee
          </button>
        </form>
      </div>
    </div>
  )
}

export default AccountDetails
