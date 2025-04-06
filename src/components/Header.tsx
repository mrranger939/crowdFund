import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { FaUserCircle, FaPlusCircle, FaBars, FaTimes } from 'react-icons/fa'
import {WalletMultiButton} from '@solana/wallet-adapter-react-ui'
import { useWallet } from '@solana/wallet-adapter-react'
import { getProviderReadOnly } from '@/services/blockchain'

export default function Header() {

  const {publicKey, sendTransaction, signTransaction} = useWallet()
  const program = useMemo(()=>getProviderReadOnly(), [])
  const [isOpen, setIsOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <header className="bg-white shadow-md fixed w-full top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-green-600">
          Fundus<span className="text-gray-700">Crowd</span>
        </Link>

        
{ program && publicKey &&  ( 
        <nav className="hidden md:flex space-x-6 items-center">
          <Link
            href="/account"
            className="text-gray-700 hover:text-green-600 flex items-center space-x-1 transition duration-300"
          >
            <FaUserCircle className="text-gray-700 hover:text-green-600" />
            <span>Account</span>
          </Link>
          <Link
            href="/create"
            className="text-gray-700 hover:text-green-600 flex items-center space-x-1 transition duration-300"
          >
            <FaPlusCircle className="text-gray-700 hover:text-green-600" />
            <span>Create</span>
          </Link>
        </nav>)}

        {isMounted && (
          <div className="hidden md:inline-block">
            {/* Static Wallet Button */}
            <WalletMultiButton style={{backgroundColor: '#16a34a', color:'white'}} />
          </div>
        )}

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-700 focus:outline-none"
        >
          {isOpen ? (
            <FaTimes className="w-6 h-6" />
          ) : (
            <FaBars className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <nav className="md:hidden bg-white shadow-md py-4">
          <div className="container mx-auto px-6 space-y-4">
  {(    program && publicKey &&          
            <>
            <Link
              href="/account"
              className="text-gray-700 hover:text-green-600 flex items-center space-x-2 transition duration-300"
            >
              <FaUserCircle />
              <span>Account</span>
            </Link>
            <Link
              href="/create"
              className="text-gray-700 hover:text-green-600 flex items-center space-x-2 transition duration-300"
            >
              <FaPlusCircle />
              <span>Create</span>
            </Link>
            </>
          )}
            {isMounted && (
              //<button className="bg-green-600 text-white py-2 px-4 rounded-lg">
              //  Connect Wallet style={{backgroundColor: '#16a34a', color:'white'}}
              //</button>
              <WalletMultiButton  style={{backgroundColor: '#16a34a', color:'white'}}/>
            )}
          </div>
        </nav>
      )}
    </header>
  )
}
