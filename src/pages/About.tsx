import { motion } from 'motion/react';
import { CheckCircle2, Users, History, ShieldCheck } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="relative h-[500px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://picsum.photos/seed/about-hero/1920/1080" 
            alt="About MKDDY" 
            className="w-full h-full object-cover opacity-40"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-brand-bg via-transparent to-brand-bg" />
        </div>
        
        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-bold mb-6"
          >
            Stress-Free Property Management
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-gray-600 leading-relaxed"
          >
            Specializing in single-family homes, townhomes, condos, and multiplexes in Virginia Beach, Norfolk, Portsmouth, Newport News, and Hampton.
          </motion.p>
        </div>
      </section>

      {/* Core Story */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-xs font-bold uppercase tracking-widest">
              Our Story
            </div>
            <h2 className="text-4xl font-serif font-bold">A Family-Owned Legacy</h2>
            <p className="text-gray-600 leading-relaxed">
              MKDDY Property Management is a family-owned company with over 20 years of experience in Property Management and Real Estate Investing. Our team's goal is to help property owners make the most of their real estate investment, and it shows in our diligence and customer-focused approach.
            </p>
            <p className="text-gray-600 leading-relaxed">
              From the quality tenants we rent to, to the maintenance of your home, every detail of this business has been carefully perfected over time. Our unique business setup allows us to manage the portfolio of homes that we care for with the personal touch our investors expect.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl overflow-hidden">
                <img src="https://picsum.photos/seed/team1/600/800" className="w-full h-full object-cover" alt="Team" />
              </div>
              <div className="bg-brand-primary rounded-3xl p-6 text-white">
                <div className="text-3xl font-bold mb-1">20+</div>
                <div className="text-xs uppercase font-bold opacity-60">Years Experience</div>
              </div>
            </div>
            <div className="space-y-4 pt-8">
              <div className="bg-brand-ink rounded-3xl p-6 text-white">
                <div className="text-3xl font-bold mb-1">500+</div>
                <div className="text-xs uppercase font-bold opacity-60">Units Managed</div>
              </div>
              <div className="h-64 rounded-3xl overflow-hidden">
                <img src="https://picsum.photos/seed/team2/600/800" className="w-full h-full object-cover" alt="Service" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="bg-brand-ink py-24 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold mb-4">Comprehensive Services</h2>
            <p className="text-white/60">Everything you need to maximize your investment.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { title: "Marketing & Advertising", desc: "Strategic placement to find the best tenants quickly." },
              { title: "Tenant Screening", desc: "Rigorous background and credit checks for peace of mind." },
              { title: "Lease Management", desc: "Professional drafting and execution of all legal documents." },
              { title: "Rent Collection", desc: "Seamless online portals for timely payments." },
              { title: "Maintenance", desc: "24/7 emergency response and proactive property care." },
              { title: "Financial Reporting", desc: "Detailed tracking of ROI and property performance." },
            ].map((service, i) => (
              <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all group">
                <CheckCircle2 className="w-8 h-8 text-brand-primary mb-6 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-sm text-white/60 leading-relaxed">{service.desc}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-20 p-12 rounded-[3rem] bg-brand-primary text-center">
            <h3 className="text-3xl font-serif font-bold mb-6">Are you owed rent?</h3>
            <p className="text-white/80 mb-8 max-w-2xl mx-auto">We specialize in recovery and management of delinquent accounts. Give us a call to discuss how we can help stabilize your portfolio.</p>
            <button className="px-8 py-4 bg-white text-brand-primary rounded-full font-bold hover:scale-105 transition-transform">
              Contact Us Today
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
