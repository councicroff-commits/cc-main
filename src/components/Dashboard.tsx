import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mini Arrow Toggle Button - Floats on the right side of the screen */}
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed top-1/2 right-0 z-40 bg-amber-500 text-black p-2 rounded-l-md shadow-lg transform -translate-y-1/2 hover:bg-amber-400 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Dark Overlay (Click to close) */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Slide-out Sidebar Panel */}
      <div 
        className={`fixed top-0 right-0 h-full w-80 bg-zinc-900 border-l border-zinc-800 z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 h-full flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-bold text-amber-500 uppercase tracking-widest">Dashboard</h2>
            <button onClick={() => setIsOpen(false)} className="text-zinc-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Quick Details Area */}
          <div className="space-y-6 flex-grow">
            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <h3 className="text-xs uppercase text-zinc-500 font-bold mb-2">Cart Status</h3>
              <p className="text-sm">3 Items Pending</p>
              <Link to="/cart" className="text-amber-500 text-xs hover:underline mt-1 inline-block">View Cart &rarr;</Link>
            </div>

            <div className="bg-zinc-950 p-4 rounded-lg border border-zinc-800">
              <h3 className="text-xs uppercase text-zinc-500 font-bold mb-2">Recent Orders</h3>
              <p className="text-sm">Order #CC-9921 (Shipped)</p>
              <Link to="/order/CC-9921" className="text-amber-500 text-xs hover:underline mt-1 inline-block">Track Order &rarr;</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
