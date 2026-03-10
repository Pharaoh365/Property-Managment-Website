import { useState, useEffect } from 'react';
import Hero from '@/src/components/Hero';
import PropertyCard from '@/src/components/PropertyCard';
import { Property } from '@/src/types';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Shield, Clock, Phone, Star, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [upcoming, setUpcoming] = useState<Property[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data.slice(0, 3)));

    fetch('/api/properties/upcoming')
      .then(res => res.json())
      .then(data => setUpcoming(data));
  }, []);

  useEffect(() => {
    if (upcoming.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % upcoming.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [upcoming]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star 
            key={star} 
            className={`w-3 h-3 ${star <= Math.round(rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-24 pb-24">
      <Hero />

      {/* Trust Stack */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Shield, title: "Licensed & Insured", desc: "Full compliance with VA real estate laws" },
            { icon: Clock, title: "24/7 Maintenance", desc: "Emergency response team always on call" },
            { icon: Phone, title: "Direct Support", desc: "No automated phone trees, real local people" },
            { icon: Shield, title: "Fair Housing", desc: "Committed to equal opportunity housing" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 glass-panel rounded-3xl">
              <div className="w-12 h-12 bg-brand-primary/10 text-brand-primary rounded-2xl flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm mb-1">{item.title}</h3>
              <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-4xl font-serif font-bold mb-4">Featured Listings</h2>
            <p className="text-gray-600">Discover hand-picked properties in Virginia Beach and Norfolk.</p>
          </div>
          <Link to="/vacancies" className="hidden sm:flex items-center gap-2 text-brand-primary font-bold hover:gap-3 transition-all">
            View All Vacancies <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {properties.map((prop) => (
            <motion.div
              key={prop.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <PropertyCard property={prop} />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Upcoming Availability Section */}
      {upcoming.length > 0 && (
        <section className="bg-brand-bg py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-12 text-center">
              <h2 className="text-4xl font-serif font-bold mb-4">Upcoming Availability</h2>
              <p className="text-gray-600">Currently occupied properties with projected move-in dates.</p>
            </div>

            <div className="relative h-[200px] max-w-4xl mx-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-white rounded-3xl border border-black/5 shadow-sm p-8 flex flex-col md:flex-row items-center gap-8"
                >
                  <div className="w-24 h-24 rounded-2xl overflow-hidden flex-shrink-0">
                    <img 
                      src={upcoming[currentIndex].image_url} 
                      alt={upcoming[currentIndex].title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex items-center justify-center md:justify-start gap-4 mb-2">
                      <h3 className="text-xl font-bold">{upcoming[currentIndex].title}</h3>
                      {renderStars(upcoming[currentIndex].rating)}
                    </div>
                    <p className="text-sm text-gray-500 mb-4">{upcoming[currentIndex].address}</p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-6">
                      <div className="flex items-center gap-2 text-brand-primary font-bold">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm uppercase tracking-widest">Available: {upcoming[currentIndex].available_date}</span>
                      </div>
                      <div className="text-sm font-bold text-gray-700">
                        ${upcoming[currentIndex].price}/mo
                      </div>
                    </div>
                  </div>
                  <button className="btn-secondary text-xs px-6">Join Waitlist</button>
                </motion.div>
              </AnimatePresence>
            </div>
            
            <div className="flex justify-center gap-2 mt-8">
              {upcoming.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-2 h-2 rounded-full transition-all ${i === currentIndex ? "bg-brand-primary w-6" : "bg-gray-300"}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Dual Path CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/owner/1200/800" 
              alt="Owners" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-ink/40 flex flex-col justify-end p-10">
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Maximize Your ROI</h3>
              <p className="text-white/80 mb-6 max-w-sm">Professional management for property owners looking for peace of mind and consistent returns.</p>
              <Link to="/owner" className="btn-primary w-fit">Owner Services</Link>
            </div>
          </div>
          
          <div className="relative h-[400px] rounded-[2rem] overflow-hidden group">
            <img 
              src="https://picsum.photos/seed/tenant/1200/800" 
              alt="Tenants" 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-brand-primary/40 flex flex-col justify-end p-10">
              <h3 className="text-3xl font-serif font-bold text-white mb-4">Find Your Next Home</h3>
              <p className="text-white/80 mb-6 max-w-sm">Browse our curated selection of high-quality rentals and enjoy a seamless moving experience.</p>
              <Link to="/vacancies" className="btn-primary bg-white text-brand-primary w-fit">Browse Rentals</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
