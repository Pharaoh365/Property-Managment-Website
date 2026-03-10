import { motion } from 'motion/react';
import { ArrowRight, ShieldCheck, Users, Building2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-brand-bg">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,#5A5A40_0%,transparent_50%)]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-wider mb-6">
              <ShieldCheck className="w-4 h-4" />
              Trusted Property Management
            </div>
            <h1 className="text-6xl md:text-8xl font-serif font-bold leading-[0.9] tracking-tight mb-8">
              Stress-Free <br />
              <span className="text-brand-primary italic">Property</span> <br />
              Management.
            </h1>
            <p className="text-xl text-gray-600 max-w-lg mb-10 leading-relaxed">
              We bridge the gap between property owners and tenants with modern technology, 
              transparent communication, and expert local knowledge.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/owner" className="btn-primary flex items-center justify-center gap-2 group">
                I'm an Owner
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/tenant" className="btn-secondary flex items-center justify-center gap-2">
                I'm a Tenant
              </Link>
            </div>

            <div className="mt-12 grid grid-cols-3 gap-8 border-t border-brand-primary/10 pt-8">
              <div>
                <div className="text-3xl font-serif font-bold">500+</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Properties</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold">98%</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Occupancy</div>
              </div>
              <div>
                <div className="text-3xl font-serif font-bold">24/7</div>
                <div className="text-xs text-gray-500 uppercase tracking-widest font-semibold">Support</div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative"
          >
            <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative">
              <img 
                src="https://picsum.photos/seed/modern-home/1200/1500" 
                alt="Modern Property" 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-ink/60 to-transparent" />
              
              <div className="absolute bottom-8 left-8 right-8 glass-panel p-6 rounded-2xl">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white">
                    <img src="https://i.pravatar.cc/150?u=manager" alt="Manager" />
                  </div>
                  <div>
                    <div className="text-white font-bold">Sarah Jenkins</div>
                    <div className="text-white/70 text-sm italic">Senior Property Manager</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 glass-panel p-4 rounded-2xl shadow-xl hidden md:block">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-xs text-gray-500 font-bold uppercase">New Listing</div>
                  <div className="text-sm font-bold">Oceanfront Condo</div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
