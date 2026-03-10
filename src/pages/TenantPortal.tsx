import { useState } from 'react';
import { CreditCard, Wrench, MessageSquare, FileText, Bell, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function TenantPortal() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const stats = [
    { label: 'Next Rent Due', value: 'April 1, 2026', icon: Clock, color: 'text-blue-600' },
    { label: 'Amount Due', value: '$2,200.00', icon: CreditCard, color: 'text-emerald-600' },
    { label: 'Active Requests', value: '1', icon: Wrench, color: 'text-orange-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Welcome back, Alex</h1>
          <p className="text-gray-600">123 Main St, Unit 4B • Virginia Beach, VA</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Pay Rent
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Wrench className="w-4 h-4" />
            Request Repair
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1 space-y-4">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Bell },
            { id: 'payments', label: 'Payments & Ledger', icon: CreditCard },
            { id: 'maintenance', label: 'Maintenance', icon: Wrench },
            { id: 'documents', label: 'Documents', icon: FileText },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl text-sm font-bold transition-all ${
                activeTab === item.id 
                  ? "bg-brand-primary text-white shadow-lg shadow-brand-primary/20" 
                  : "bg-white text-gray-600 hover:bg-gray-50 border border-black/5"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Stats Grid */}
          <div className="grid sm:grid-cols-3 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
                <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4", stat.color)}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
                <div className="text-xl font-serif font-bold">{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Recent Activity / Maintenance */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl">Recent Maintenance</h3>
              <button className="text-brand-primary text-sm font-bold hover:underline">View All</button>
            </div>
            <div className="divide-y divide-black/5">
              {[
                { title: 'Leaking Faucet', date: 'Mar 5, 2026', status: 'In Progress', icon: Clock, color: 'text-orange-500' },
                { title: 'AC Filter Replacement', date: 'Feb 12, 2026', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
                { title: 'Smoke Detector Battery', date: 'Jan 20, 2026', status: 'Completed', icon: CheckCircle2, color: 'text-emerald-500' },
              ].map((req, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={cn("p-2 rounded-lg bg-gray-50", req.color)}>
                      <req.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{req.title}</div>
                      <div className="text-xs text-gray-500">{req.date}</div>
                    </div>
                  </div>
                  <div className={cn("text-xs font-bold px-3 py-1 rounded-full bg-gray-50", req.color)}>
                    {req.status}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documents Section (OneDrive Mockup) */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <FileText className="w-6 h-6 text-brand-primary" />
              <h3 className="font-serif font-bold text-xl">Lease Documents</h3>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                { name: 'Lease_Agreement_2026.pdf', size: '2.4 MB' },
                { name: 'Property_Rules_Addendum.pdf', size: '1.1 MB' },
                { name: 'Move_In_Checklist.pdf', size: '800 KB' },
                { name: 'Parking_Permit_App.pdf', size: '450 KB' },
              ].map((doc, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-brand-bg hover:bg-gray-200 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <FileText className="w-4 h-4 text-gray-400 group-hover:text-brand-primary" />
                    <div className="truncate">
                      <div className="text-sm font-bold truncate">{doc.name}</div>
                      <div className="text-[10px] text-gray-500 uppercase">{doc.size}</div>
                    </div>
                  </div>
                  <button className="text-brand-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity">Download</button>
                </div>
              ))}
            </div>
          </div>

          {/* Vendor Deals & Requests */}
          <div className="grid sm:grid-cols-2 gap-8">
            <div className="bg-brand-primary rounded-3xl p-8 text-white">
              <h3 className="font-serif font-bold text-xl mb-4">Tenant Perks</h3>
              <p className="text-white/70 text-sm mb-6">Exclusive deals for MKDDY tenants from our local partners.</p>
              <div className="space-y-3">
                {[
                  { name: 'Cox Internet', deal: '$20/mo off' },
                  { name: 'Ghent Cleaners', deal: '15% Discount' },
                  { name: 'Local Movers', deal: 'Free Boxes' },
                ].map((perk, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-white/10 rounded-xl text-xs">
                    <span className="font-bold">{perk.name}</span>
                    <span className="text-white/60">{perk.deal}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-black/5 p-8">
              <h3 className="font-serif font-bold text-xl mb-4">Modify Request</h3>
              <p className="text-gray-500 text-sm mb-6">Want to paint or landscape? Submit a request for approval.</p>
              <button className="w-full py-3 rounded-2xl border-2 border-brand-primary text-brand-primary font-bold text-sm hover:bg-brand-primary hover:text-white transition-all">
                Submit Modification
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

