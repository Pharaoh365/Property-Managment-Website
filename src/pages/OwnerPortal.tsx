import { useState } from 'react';
import { BarChart3, Building2, Users, DollarSign, TrendingUp, FileText, PieChart, Calendar, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

export default function OwnerPortal() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = [
    { label: 'Total Revenue', value: '$12,450.00', icon: DollarSign, trend: '+4.2%', color: 'text-emerald-600' },
    { label: 'Occupancy Rate', value: '98.5%', icon: Building2, trend: '+1.1%', color: 'text-blue-600' },
    { label: 'Active Leases', value: '42', icon: Users, trend: '0%', color: 'text-orange-600' },
    { label: 'Maintenance Cost', value: '$1,120.00', icon: TrendingUp, trend: '-12%', color: 'text-rose-600' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Owner Dashboard</h1>
          <p className="text-gray-600">Portfolio Performance • Last updated: Today, 10:45 AM</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Download Monthly Report
          </button>
          <button className="btn-secondary flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Schedule Inspection
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center", stat.color)}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className={cn("text-[10px] font-bold px-2 py-1 rounded-full flex items-center gap-1", 
                stat.trend.startsWith('+') ? "bg-emerald-50 text-emerald-600" : 
                stat.trend.startsWith('-') ? "bg-rose-50 text-rose-600" : "bg-gray-50 text-gray-500")}>
                {stat.trend.startsWith('+') ? <ArrowUpRight className="w-3 h-3" /> : 
                 stat.trend.startsWith('-') ? <ArrowDownRight className="w-3 h-3" /> : null}
                {stat.trend}
              </div>
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-serif font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Power BI Mockup */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2rem] border border-black/5 shadow-sm overflow-hidden h-[500px] flex flex-col">
            <div className="p-6 border-b border-black/5 flex justify-between items-center bg-gray-50/50">
              <div className="flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-brand-primary" />
                <h3 className="font-serif font-bold text-xl">Portfolio Analytics (Power BI)</h3>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-white border border-black/5 text-xs font-bold">Monthly</button>
                <button className="px-3 py-1 rounded-lg bg-brand-primary text-white text-xs font-bold">Yearly</button>
              </div>
            </div>
            <div className="flex-1 p-8 flex flex-col items-center justify-center text-center bg-[radial-gradient(circle_at_50%_50%,#f5f2ed_0%,transparent_100%)]">
              {/* Visual representation of a chart */}
              <div className="w-full max-w-md space-y-6">
                <div className="flex items-end gap-4 h-48">
                  {[40, 70, 45, 90, 65, 80, 55, 75, 95, 60, 85, 50].map((h, i) => (
                    <div key={i} className="flex-1 bg-brand-primary/20 rounded-t-lg relative group">
                      <motion.div 
                        initial={{ height: 0 }}
                        animate={{ height: `${h}%` }}
                        transition={{ duration: 1, delay: i * 0.05 }}
                        className="absolute bottom-0 left-0 right-0 bg-brand-primary rounded-t-lg group-hover:bg-brand-primary/80 transition-colors"
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                  <span>Jan</span>
                  <span>Jun</span>
                  <span>Dec</span>
                </div>
                <p className="text-sm text-gray-500 italic">"Real-time ROI data powered by Power BI integration"</p>
              </div>
            </div>
          </div>

          {/* Property List */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl">Managed Properties</h3>
              <button className="text-brand-primary text-sm font-bold hover:underline">Manage All</button>
            </div>
            <div className="divide-y divide-black/5">
              {[
                { name: 'Modern Downtown Loft', address: '123 Main St, Unit 4B', rent: '$2,200', status: 'Occupied', color: 'text-emerald-500' },
                { name: 'Cozy Suburban Home', address: '456 Oak Ave', rent: '$1,800', status: 'Occupied', color: 'text-emerald-500' },
                { name: 'Luxury Beachfront Condo', address: '789 Ocean Blvd', rent: '$3,500', status: 'Vacant', color: 'text-rose-500' },
              ].map((prop, i) => (
                <div key={i} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                      <img src={`https://picsum.photos/seed/${i+10}/100/100`} alt={prop.name} />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{prop.name}</div>
                      <div className="text-xs text-gray-500">{prop.address}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold text-sm">{prop.rent}</div>
                    <div className={cn("text-[10px] font-bold uppercase tracking-widest", prop.color)}>{prop.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Actions */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-brand-primary rounded-3xl p-8 text-white shadow-xl shadow-brand-primary/20">
            <PieChart className="w-10 h-10 mb-6 opacity-50" />
            <h3 className="text-2xl font-serif font-bold mb-4">Portfolio Health</h3>
            <p className="text-white/70 text-sm mb-8 leading-relaxed">Your portfolio is currently performing 12% above the local market average for Hampton Roads.</p>
            <button className="w-full py-3 rounded-2xl bg-white text-brand-primary font-bold text-sm hover:bg-brand-bg transition-colors">
              View Detailed Audit
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8">
            <h3 className="font-serif font-bold text-xl mb-6">Quick Actions</h3>
            <div className="space-y-3">
              {[
                { label: 'Review Maintenance', count: 3 },
                { label: 'Approve Lease', count: 1 },
                { label: 'Tax Documents', count: 0 },
                { label: 'Owner Statements', count: 12 },
              ].map((action, i) => (
                <button key={i} className="w-full flex items-center justify-between p-4 rounded-2xl bg-brand-bg hover:bg-gray-200 transition-all group">
                  <span className="text-sm font-bold text-gray-700 group-hover:text-brand-ink">{action.label}</span>
                  {action.count > 0 && (
                    <span className="bg-brand-primary text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {action.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

