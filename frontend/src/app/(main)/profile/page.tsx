"use client";
import React from 'react'
import { AccountSettings } from '@stackframe/stack'

function Profile() {
  return (
    <div className="w-full min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-8 px-4">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900">Account Settings</h1>
          <p className="text-lg text-slate-600 mt-2">Manage your profile and account preferences</p>
        </div>

        {/* Settings Container */}
        <div className="bg-white rounded-lg shadow-md border border-slate-200 overflow-hidden">
          <AccountSettings />
        </div>
      </div>
    </div>
  )
}

export default Profile

