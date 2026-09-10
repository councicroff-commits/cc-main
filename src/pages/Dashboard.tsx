import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';

// 1. Import your sub-components (Ensure these files exist!)
const Overview = () => <div>Overview Section</div>;
const Orders = () => <div>Orders Section</div>;
const ProfileSettings = () => <div>Profile Settings Section</div>;

const Dashboard = () => {
  const location = useLocation();
  
  const navItems = [
    { name: 'Overview', path: '/dashboard' },
    { name: 'Orders', path: '/dashboard/orders' },
    { name: 'Profile Settings', path: '/dashboard/profile' },
  ];

  return (
    <div className="flex min-h-screen bg-zinc-950 p-6 gap-6">
      <aside className="w-64 border border-zinc-800 p-6 h-fit sticky top-6">
        <h3 className="text-amber-500 font-bold mb-6 tracking-widest uppercase text-xs">Navigation</h3>
        <nav className="space-y-4">
          {navItems.map(item => (
            <Link key={item.path} to={item.path} 
              className={`block text-xs uppercase ${location.pathname === item.path ? 'text-white' : 'text-zinc-600 hover:text-white'}`}>
              {item.name}
            </Link>
          ))}
        </nav>
      </aside>

      <section className="flex-grow border border-zinc-800 p-8">
        {/* 2. These routes are now properly mapped to components */}
        <Routes>
          <Route path="/" element={<Overview />} />
          <Route path="orders" element={<Orders />} />
          <Route path="profile" element={<ProfileSettings />} />
        </Routes>
      </section>
    </div>
  );
};

export default Dashboard;
