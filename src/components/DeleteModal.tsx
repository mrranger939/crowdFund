import React from 'react'
import { FaTimes, FaTrashAlt } from 'react-icons/fa'

const DeleteModal = () => {
  const delModal = 'scale-0'
  const handleClose = () => {
    // Close the modal functionality (static, no Redux)
  }

  const handleDelete = async () => {
    // Simulate successful deletion (static, no actual API call)
    console.log('Campaign deleted')
    handleClose()
  }

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen flex items-center justify-center
      bg-black bg-opacity-50 transform z-[3000] transition-transform duration-300 ${delModal}`}
    >
      <div className="bg-white shadow-lg shadow-slate-900 rounded-xl w-11/12 md:w-2/5 p-6">
        <div className="flex flex-row justify-between items-center mb-6">
          <p className="text-xl font-semibold text-gray-700">
            Are you sure you want to delete this campaign?
          </p>
          <button
            type="button"
            className="border-0 bg-transparent focus:outline-none"
            onClick={handleClose}
          >
            <FaTimes className="text-gray-400" />
          </button>
        </div>

        <div className="mb-6 text-center">
          <p className="text-lg text-gray-600">
            You are about to permanently delete the campaign{' '}
            <strong>Sample Campaign</strong>.
          </p>
          <p className="text-sm text-gray-500">This action cannot be undone.</p>
        </div>

        <div className="flex justify-between">
          <button
            type="button"
            className="w-full bg-red-600 hover:bg-red-700 text-white
            font-semibold py-2 px-4 rounded-lg flex items-center justify-center gap-2"
            onClick={handleDelete}
          >
            <FaTrashAlt />
            Delete
          </button>
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
