import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const CampaignHero = () => {
  return (
    <section className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-20 px-6 md:px-12">
      <div className="container mx-auto text-center md:text-left">
        <div className="flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold leading-tight">
              Empower Dreams Through Crowdfunding
            </h1>
            <p className="mt-4 text-lg md:text-xl text-white/90">
              Discover, support, and fund campaigns that matter. Join a
              community of dreamers and changemakers, and bring ideas to life.
            </p>
            <div className="mt-8">
              <Link
                href="/account"
                className="bg-white text-green-600 hover:bg-green-100 font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
              >
                Explore Campaigns
              </Link>
              <Link
                href="/create"
                className="ml-4 text-white bg-green-600 hover:bg-green-700 font-semibold py-3 px-6 rounded-lg shadow-md transition-all"
              >
                Start a Campaign
              </Link>
            </div>
          </div>
          <div className="md:w-1/2">
            <Image
              src="https://cdn.pixabay.com/photo/2015/02/27/18/31/money-652560_960_720.jpg"
              alt="Crowdfunding Illustration"
              width={576}
              height={384}
              className="w-full rounded-lg shadow-lg h-96 object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
export default CampaignHero
