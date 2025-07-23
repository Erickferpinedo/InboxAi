import React from 'react';
import { Zap, Copy, BarChart2 } from 'lucide-react';
import { motion } from 'framer-motion';

const actions = [
  { id: 1, title: 'Refund Processed', content: 'Your refund will be processed in 3–5 business days.', tag: 'Billing', usage: 32 },
  { id: 2, title: 'Restart App', content: 'Please restart the app and try again. This often resolves the issue.', tag: 'Troubleshooting', usage: 19 },
  { id: 3, title: 'Shipping Info', content: 'You can find your shipping information and tracking number in your order confirmation email.', tag: 'Shipping', usage: 45 },
];

export default function QuickActions() {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-5 border-b border-slate-200/80 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
            <Zap className="w-8 h-8 text-amber-500"/>
            <h1 className="text-3xl font-bold text-slate-900">Quick Actions</h1>
        </div>
        <p className="text-slate-500 mt-1">Reusable canned responses for common issues.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {actions.map((action, index) => (
          <motion.div
            key={action.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-slate-800">{action.title}</h3>
              <span className="text-xs font-semibold text-slate-600 bg-slate-100 px-2 py-1 rounded-full">{action.tag}</span>
            </div>
            <p className="text-slate-600 mb-4">{action.content}</p>
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-xs text-slate-400">
                    <BarChart2 className="w-3 h-3"/>
                    <span>Used {action.usage} times this week</span>
                </div>
                <button className="flex items-center gap-1.5 text-sm font-semibold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg">
                    <Copy className="w-4 h-4"/>
                    Copy & Use
                </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}