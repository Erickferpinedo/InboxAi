import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Mail, Bot, Zap, Settings } from 'lucide-react';
import { motion } from 'framer-motion';


const navigationItems = [
  { title: 'Inbox', url: createPageUrl('Inbox'), icon: Mail },
  { title: 'Smart Replies', url: createPageUrl('SmartReplies'), icon: Bot },
  { title: 'Quick Actions', url: createPageUrl('QuickActions'), icon: Zap },
  { title: 'Settings', url: createPageUrl('Settings'), icon: Settings },
];

export default function Layout({ children }) {
  const location = useLocation();

  return (
    <div className="h-screen w-full flex flex-col font-sans bg-slate-50 md:max-w-sm md:mx-auto md:shadow-2xl md:rounded-3xl md:my-4 md:h-[calc(100vh-2rem)]">
      <style>{`
        :root {
          --primary: #2563EB; /* blue-600 */
          --primary-foreground: #FFFFFF;
          --secondary: #F1F5F9; /* slate-100 */
          --success: #16A34A; /* green-600 */
          --danger: #DC2626; /* red-600 */
          --warning: #F59E0B; /* amber-500 */
        }
        .bottom-nav-item.active svg { color: var(--primary); }
        .bottom-nav-item.active span { color: var(--primary); }
      `}</style>

      <main className="flex-1 overflow-y-auto">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full bg-white/80 backdrop-blur-lg border-t border-slate-200/80 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
        <div className="flex justify-around items-center h-16">
          {navigationItems.map((item) => {
            const isActive = location.pathname === item.url;
            return (
              <Link
                key={item.title}
                to={item.url}
                className={`bottom-nav-item flex flex-col items-center justify-center text-slate-500 transition-colors duration-200 w-full h-full ${
                  isActive ? 'active' : ''
                }`}
              >
                <motion.div
                  animate={{
                    scale: isActive ? [1, 1.2, 1] : 1,
                    y: isActive ? [0, -4, 0] : 0,
                  }}
                  transition={{ duration: 0.3 }}
                >
                  <item.icon className="w-6 h-6" />
                </motion.div>
                <span className="text-xs font-medium mt-1">{item.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}