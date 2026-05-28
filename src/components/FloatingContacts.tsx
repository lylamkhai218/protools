import React from 'react';
import { Phone } from 'lucide-react';

export default function FloatingContacts() {
  return (
    <div className="fixed bottom-6 right-6 z-[120] flex flex-col gap-4 scale-100 sm:scale-110 origin-bottom-right">
      
      {/* 1. Phone Button with nice shadow ring and halo */}
      <div className="relative group w-12 h-12 flex items-center justify-center">
        {/* Slow glowing pulsing halos (blue) */}
        <span className="absolute inset-x-0 inset-y-0 rounded-full bg-[#1e90ff]/40 animate-slow-glow-blue pointer-events-none" />
        <span className="absolute -inset-1.5 rounded-full bg-[#1e90ff]/20 animate-slow-glow-blue pointer-events-none" style={{ animationDelay: '0.6s' }} />
        <a 
          href="tel:0983794782"
          className="absolute inset-0 rounded-full bg-[#1e95ff] hover:bg-[#0080ff] flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn border-2 border-white/50 ring-2 ring-[#1e90ff]/10 z-10"
          title="Gọi điện ngay"
        >
          <span className="absolute -left-28 bg-[#001530] text-white text-[10px] font-bold py-1 px-2.5 rounded-xs opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none uppercase tracking-wider select-none border border-white/10">
            Hotline Phục vụ
          </span>
          <Phone className="h-5 w-5" />
        </a>
      </div>

      {/* 2. Zalo Button with slow blue glow */}
      <div className="relative group w-12 h-12 flex items-center justify-center">
        {/* Zalo button also glowing with same beautiful blue halo */}
        <span className="absolute inset-x-0 inset-y-0 rounded-full bg-[#1e90ff]/40 animate-slow-glow-blue pointer-events-none" style={{ animationDelay: '0.8s' }} />
        <span className="absolute -inset-1.5 rounded-full bg-[#1e90ff]/20 animate-slow-glow-blue pointer-events-none" style={{ animationDelay: '1.4s' }} />
        <a 
          href="https://zalo.me/0983794782"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-full bg-white flex items-center justify-center shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn border-2 border-blue-500/40 ring-2 ring-blue-50 z-10"
          title="Chat Zalo"
        >
          <span className="absolute -left-24 bg-[#001530] text-white text-[10px] font-bold py-1 px-2.5 rounded-xs opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none uppercase tracking-wider select-none border border-white/10">
            Zalo Chat
          </span>
          <span className="text-[#0068ff] font-sans font-black text-xs tracking-tighter select-none">Zalo</span>
        </a>
      </div>

      {/* 3. Messenger Button with halo */}
      <div className="relative group w-12 h-12 flex items-center justify-center">
        {/* Slow glowing pulsing halos (blue) */}
        <span className="absolute inset-x-0 inset-y-0 rounded-full bg-[#1e90ff]/40 animate-slow-glow-blue pointer-events-none" style={{ animationDelay: '1.6s' }} />
        <span className="absolute -inset-1.5 rounded-full bg-[#1e90ff]/20 animate-slow-glow-blue pointer-events-none" style={{ animationDelay: '2.2s' }} />
        <a 
          href="https://m.me/t2t.vina"
          target="_blank"
          rel="noopener noreferrer"
          className="absolute inset-0 rounded-full bg-[#0084ff] hover:bg-[#0073e6] flex items-center justify-center text-white shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 group/btn border-2 border-white/55 ring-2 ring-[#0084ff]/10 z-10"
          title="Chat Messenger"
        >
          <span className="absolute -left-28 bg-[#001530] text-white text-[10px] font-bold py-1 px-2.5 rounded-xs opacity-0 group-hover/btn:opacity-100 transition-opacity whitespace-nowrap shadow-md pointer-events-none uppercase tracking-wider select-none border border-white/10">
            FB Messenger
          </span>
          <svg className="h-5 w-5 fill-white select-none" viewBox="0 0 24 24">
            <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.914 1.455 5.514 3.734 7.158V22l3.414-1.875A10.37 10.37 0 0012 20.516c5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.096 11.89l-2.825-3.011-5.511 3.011 6.062-6.438 2.89 3.011 5.446-3.011-6.262 6.438z" />
          </svg>
        </a>
      </div>

    </div>
  );
}
