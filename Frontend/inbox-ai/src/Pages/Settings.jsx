import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-5 border-b border-slate-200/80 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
            <SettingsIcon className="w-8 h-8 text-slate-600"/>
            <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        </div>
        <p className="text-slate-500 mt-1">Manage your account and preferences.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase text-slate-400">Account</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">Profile</div>
            <div className="bg-white rounded-lg shadow-sm p-4">Integrations</div>
        </div>
         <div className="space-y-2">
            <h2 className="text-xs font-semibold uppercase text-slate-400">Preferences</h2>
            <div className="bg-white rounded-lg shadow-sm p-4">Notifications</div>
            <div className="bg-white rounded-lg shadow-sm p-4">Appearance</div>
            <div className="bg-white rounded-lg shadow-sm p-4">Privacy</div>
        </div>
      </div>
    </div>
  );
}