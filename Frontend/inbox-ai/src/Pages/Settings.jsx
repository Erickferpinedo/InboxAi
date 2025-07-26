import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Palette } from 'lucide-react';

export default function Settings() {
  return (
    <div className="d-flex flex-column min-vh-100 bg-body-tertiary">
      <header className="sticky-top bg-white bg-opacity-95 border-bottom px-4 pt-4 pb-3" style={{ zIndex: 10 }}>
        <div className="d-flex align-items-center gap-2 mb-1">
          <SettingsIcon size={32} className="text-secondary" />
          <h1 className="h3 fw-bold text-dark m-0">Settings</h1>
        </div>
        <p className="text-secondary mb-0" style={{ fontSize: '1rem' }}>
          Manage your account and preferences.
        </p>
      </header>

      <div className="flex-grow-1 overflow-auto p-4">
        <div className="mb-4">
          <h2 className="text-uppercase text-secondary-emphasis fs-6 fw-semibold mb-2" style={{ letterSpacing: 1 }}>
            Account
          </h2>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-2">Profile</div>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-2">Integrations</div>
        </div>
        <div>
          <h2 className="text-uppercase text-secondary-emphasis fs-6 fw-semibold mb-2" style={{ letterSpacing: 1 }}>
            Preferences
          </h2>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-2">Notifications</div>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-2">Appearance</div>
          <div className="bg-white rounded-4 shadow-sm p-4 mb-2">Privacy</div>
        </div>
      </div>
    </div>
  );
}
