import { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Wrench, 
  BarChart3, 
  Plus, 
  Search, 
  ArrowUpRight, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  MoreVertical,
  TrendingUp
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import { Property } from '@/src/types';

export default function PMPortal() {
  const [stats, setStats] = useState<any>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    fetch('/api/pm/stats').then(res => res.json()).then(setStats);
    fetch('/api/properties/all').then(res => res.json()).then(setProperties);
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif font-bold mb-2">Manager Dashboard</h1>
          <p className="text-gray-600">Internal Property Management System • MKDDY PM</p>
        </div>
        <div className="flex gap-3">
          <button className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Property
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {[
          { label: 'Total Units', value: stats?.total || '0', icon: Building2, color: 'text-blue-600' },
          { label: 'Active Vacancies', value: stats?.active || '0', icon: Search, color: 'text-emerald-600' },
          { label: 'Occupancy Rate', value: `${stats?.occupancyRate || '0'}%`, icon: BarChart3, color: 'text-orange-600' },
          { label: 'Pending Repairs', value: stats?.pendingMaintenance || '0', icon: Wrench, color: 'text-rose-600' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-black/5 shadow-sm">
            <div className={cn("w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center mb-4", stat.color)}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-xs text-gray-500 font-bold uppercase tracking-widest mb-1">{stat.label}</div>
            <div className="text-2xl font-serif font-bold">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Property List */}
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-black/5 flex justify-between items-center">
              <h3 className="font-serif font-bold text-xl">Property Inventory</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded-lg bg-brand-primary text-white text-xs font-bold">All</button>
                <button className="px-3 py-1 rounded-lg bg-gray-50 border border-black/5 text-xs font-bold">Vacant</button>
              </div>
            </div>
            <div className="divide-y divide-black/5">
              {properties.map((prop) => (
                <div key={prop.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100">
                      <img src={prop.image_url} alt={prop.title} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{prop.title}</div>
                      <div className="text-xs text-gray-500">{prop.address}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right hidden sm:block">
                      <div className="text-xs text-gray-400 font-bold uppercase">Rent</div>
                      <div className="font-bold text-sm">${prop.price}</div>
                    </div>
                    <div className={cn(
                      "text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full",
                      prop.status === 'active' ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600"
                    )}>
                      {prop.status}
                    </div>
                    <button className="p-2 hover:bg-gray-100 rounded-lg">
                      <MoreVertical className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar: Maintenance Tracker */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-3xl border border-black/5 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-serif font-bold text-xl">Repair Tracker</h3>
              <Wrench className="w-5 h-5 text-brand-primary" />
            </div>
            <div className="space-y-6">
              {[
                { title: 'HVAC Repair', property: 'Downtown Loft', days: 2, status: 'urgent' },
                { title: 'Plumbing Leak', property: 'Suburban Home', days: 5, status: 'pending' },
                { title: 'Paint Touch-up', property: 'Beachfront Condo', days: 1, status: 'scheduled' },
              ].map((item, i) => (
                <div key={i} className="relative pl-6 border-l-2 border-brand-primary/20 pb-6 last:pb-0">
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-brand-primary" />
                  <div className="flex justify-between items-start mb-1">
                    <div className="text-sm font-bold">{item.title}</div>
                    <div className={cn("text-[10px] font-bold uppercase px-2 py-0.5 rounded", 
                      item.status === 'urgent' ? "bg-rose-50 text-rose-600" : "bg-gray-100 text-gray-500"
                    )}>
                      {item.status}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{item.property}</div>
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 font-bold uppercase">
                    <Clock className="w-3 h-3" />
                    {item.days} days since request
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analysis Card */}
          <div className="bg-brand-ink rounded-3xl p-8 text-white">
            <TrendingUp className="w-10 h-10 mb-6 text-emerald-400" />
            <h3 className="text-2xl font-serif font-bold mb-4">Repair Analysis</h3>
            <div className="space-y-4 mb-8">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Monthly Budget</span>
                <span className="font-bold">$5,000</span>
              </div>
              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-400 w-[65%]" />
              </div>
              <p className="text-xs text-white/40 italic">"Maintenance costs are 15% lower than last quarter."</p>
            </div>
            <button className="w-full py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-sm transition-all">
              Full Financial Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
