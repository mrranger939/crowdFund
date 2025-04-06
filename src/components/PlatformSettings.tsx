import { fetchProgramState, getProvider, UpdatePlatformFee } from '@/services/blockchain'
import { ProgramState } from '@/utils/interfaces'
import { useWallet } from '@solana/wallet-adapter-react'
import React, { useMemo, useState } from 'react'
import { FaDonate } from 'react-icons/fa'
import { toast } from 'react-toastify'

const PlatformSettings: React.FC<{ programState: ProgramState }> = ({
  programState,
}) => {
  const [percent, setPercent] = useState('')
  const {publicKey, sendTransaction, signTransaction} = useWallet()
  const program = useMemo(()=> getProvider(publicKey, signTransaction, sendTransaction), [publicKey, signTransaction, sendTransaction])
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!percent) return

    if (!publicKey) return toast.warn('Please connect wallet!')
    await toast.promise(

      new Promise<void>(async (resolve, reject)=>{
        try {
          const tx:any = await UpdatePlatformFee(
            program!,
            publicKey!,
            Number(percent)
          )

          setPercent('')
          await fetchProgramState(program!)          
          console.log(tx)
          resolve(tx)
        } catch (e) {
          reject(e)
        }
      })
      ,
      {
        pending: 'Approving transaction',
        success: 'Transaction successfull',
        error: 'Encountered a error'
      }
    )
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

export default PlatformSettings
