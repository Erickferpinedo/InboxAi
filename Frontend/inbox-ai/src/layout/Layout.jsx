import React from 'react';
import { Link, useLocation, Outlet } from 'react-router-dom';
import { Mail, Bot, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

const navigationItems = [
  { title: 'Inbox', url: '/inbox', icon: Mail },
  { title: 'Smart Replies', url: '/smartreplies', icon: Bot },
  { title: 'Quick Actions', url: '/quickactions', icon: Zap },
  { title: 'Settings', url: '/settings', icon: Settings },
];

export default function Layout() {
  const location = useLocation();
  const navActive = "#2563EB";
  const navInactive = "#64748B";

  return (
    <div
      className="d-flex flex-column"
      style={{
        minHeight: '100vh',
        background: '#F8FAFC',
        fontFamily: 'sans-serif',
        maxWidth: '28rem',
        margin: '0 auto',
        borderRadius: '1.25rem',
        boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
        position: 'relative',
      }}
    >
      {/* Main content */}
      <main className="flex-grow-1" style={{ overflowY: 'auto' }}>
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav
        className="w-100 border-top"
        style={{
          background: 'rgba(255,255,255,0.88)',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.02)',
          position: 'sticky',
          bottom: 0,
          zIndex: 20,
          backdropFilter: 'blur(12px)',
          borderColor: '#E2E8F0',
        }}
      >
        <div className="d-flex justify-content-around align-items-center" style={{ height: 64 }}>
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className="text-decoration-none text-center flex-grow-1"
                style={{ color: isActive ? navActive : navInactive, padding: '8px 0' }}
              >
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                    y: isActive ? [0, -4, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon size={24} />
                </motion.div>
                <div
                  style={{
                    fontSize: '12px',
                    fontWeight: 500,
                    marginTop: 4,
                    color: isActive ? navActive : navInactive,
                  }}
                >
                  {item.title}
                </div>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
