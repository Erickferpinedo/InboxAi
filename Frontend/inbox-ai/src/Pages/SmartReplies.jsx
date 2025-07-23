import React from 'react';
import { Bot, Send, Edit, XCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const replies = [
  { id: 1, customer: 'Jane Doe', topic: 'Refund Request', reply: 'Your refund has been processed and should appear in your account within 3-5 business days.', intent: 'Informative' },
  { id: 2, customer: 'John Smith', topic: 'Late Delivery', reply: 'I sincerely apologize for the delay. Your package is now out for delivery and should arrive today.', intent: 'Apologetic' },
  { id:3, customer: 'Samantha Bee', topic: 'Login Issue', reply: 'To reset your password, please click this link: [reset_link]. If you still have trouble, let me know!', intent: 'Helpful' },
];

export default function SmartReplies() {
  return (
    <div className="h-full w-full flex flex-col bg-slate-50">
      <header className="sticky top-0 bg-white/80 backdrop-blur-lg z-5 border-b border-slate-200/80 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2">
            <Bot className="w-8 h-8 text-blue-600"/>
            <h1 className="text-3xl font-bold text-slate-900">Smart Replies</h1>
        </div>
        <p className="text-slate-500 mt-1">AI-generated drafts awaiting your review.</p>
      </header>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {replies.map((reply, index) => (
          <motion.div
            key={reply.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white p-4 rounded-xl shadow-sm border border-slate-100"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-bold text-slate-800">To: {reply.customer}</p>
                <p className="text-sm text-slate-500">{reply.topic}</p>
              </div>
              <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-2 py-1 rounded-full">{reply.intent}</span>
            </div>
            <p className="text-slate-700 mb-4">{reply.reply}</p>
            <div className="flex justify-end gap-2">
              <button className="flex items-center gap-1.5 text-sm font-semibold bg-white border border-slate-300 text-slate-700 px-3 py-1.5 rounded-lg"><XCircle className="w-4 h-4"/>Discard</button>
              <button className="flex items-center gap-1.5 text-sm font-semibold bg-blue-600 text-white px-3 py-1.5 rounded-lg"><Send className="w-4 h-4"/>Send</button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}