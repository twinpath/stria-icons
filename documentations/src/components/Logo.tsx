import React from 'react';

export function Logo({ className = '' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 512 512" 
        className="w-8 h-8 flex-shrink-0"
        aria-hidden="true"
      >
        <path 
          className="fill-cyan-500" 
          d="M512 256V256C512 273.673 497.673 288 480 288H96C78.327 288 64 273.673 64 256V256C64 238.327 78.327 224 96 224H480C497.673 224 512 238.327 512 256Z" 
        />
        <path 
          className="fill-indigo-500" 
          d="M416 384H32C14.327 384 0 398.327 0 416V416C0 433.673 14.327 448 32 448H416C433.673 448 448 433.673 448 416V416C448 398.327 433.673 384 416 384ZM416 64H32C14.327 64 0 78.327 0 96V96C0 113.673 14.327 128 32 128H416C433.673 128 448 113.673 448 96V96C448 78.327 433.673 64 416 64Z" 
        />
      </svg>
      <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
        Stria Icons
      </span>
    </div>
  );
}
