import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Anchor, Shield, Map as MapIcon, CheckCircle2, Info, Navigation, Building2, ShoppingCart, Stethoscope } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { cn } from '@/src/lib/utils';

const LANDMARKS = {
  bases: [
    { name: "NAS Oceana", coords: [36.82, -76.03] },
    { name: "JEB Little Creek", coords: [36.91, -76.17] },
    { name: "NS Norfolk", coords: [36.94, -76.31] },
    { name: "Dam Neck Annex", coords: [36.78, -75.95] }
  ],
  exchanges: [
    { name: "Oceana Commissary & NEX", coords: [36.825, -76.035] },
    { name: "Little Creek NEX", coords: [36.915, -76.175] },
    { name: "Norfolk Navy Exchange", coords: [36.945, -76.315] }
  ],
  medical: [
    { name: "Hampton VA Medical Center", coords: [37.01, -76.34], type: 'Hospital' },
    { name: "Virginia Beach VA Clinic", coords: [36.84, -76.12], type: 'Clinic' },
    { name: "Sentara Norfolk General", coords: [36.86, -76.30], type: 'Hospital' }
  ]
};

// Helper to calculate distance in miles
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8; // Radius of the earth in miles
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function MilitaryRelocation() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const [activeLayers, setActiveLayers] = useState({
    properties: true,
    bases: true,
    exchanges: false,
    medical: false,
    efmp: true
  });

  const layerGroups = useRef<{
    properties: L.LayerGroup;
    bases: L.LayerGroup;
    exchanges: L.LayerGroup;
    medical: L.LayerGroup;
    efmp: L.LayerGroup;
  } | null>(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([36.8529, -76.15], 11);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; MKDDY Property Management'
      }).addTo(map);

      layerGroups.current = {
        properties: L.layerGroup().addTo(map),
        bases: L.layerGroup().addTo(map),
        exchanges: L.layerGroup(),
        medical: L.layerGroup(),
        efmp: L.layerGroup().addTo(map)
      };

      // Property Markers
      const listings = [
        { name: "VA Beach Family Home", coords: [36.85, -76.05], price: "$2,400" },
        { name: "Suffolk Modern Townhome", coords: [36.72, -76.58], price: "$2,100" },
        { name: "Ghent Historic Flat", coords: [36.8644, -76.2853], price: "$1,850" }
      ];

      listings.forEach(p => {
        const marker = L.circleMarker(p.coords as L.LatLngExpression, { 
          color: '#4a5d4d', 
          fillOpacity: 0.8, 
          radius: 8 
        });

        // Calculate commute times to bases
        const commuteInfo = LANDMARKS.bases.map(base => {
          const dist = getDistance(p.coords[0], p.coords[1], base.coords[0], base.coords[1]);
          const time = Math.round(dist * 2.5 + 5); // Rough estimate: 2.5 mins per mile + 5 mins base gate
          return `<li><b>${base.name}:</b> ${time} mins</li>`;
        }).join('');

        marker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 200px;">
            <strong style="font-size: 14px; color: #4a5d4d;">${p.name}</strong><br>
            <span style="font-weight: bold;">${p.price}</span>
            <hr style="margin: 8px 0; border: none; border-top: 1px solid #eee;">
            <div style="font-size: 11px; color: #666;">
              <div style="font-weight: bold; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Estimated Commutes:</div>
              <ul style="margin: 0; padding-left: 14px;">${commuteInfo}</ul>
            </div>
          </div>
        `);
        marker.addTo(layerGroups.current!.properties);
      });

      // Military Bases
      LANDMARKS.bases.forEach(b => {
        L.marker(b.coords as L.LatLngExpression, {
          icon: L.divIcon({ 
            html: '<div style="background:#d9534f; width:12px; height:12px; border:1px solid #fff; border-radius: 2px;"></div>',
            className: 'custom-marker'
          })
        }).bindPopup(`<b>MILITARY BASE:</b> ${b.name}`).addTo(layerGroups.current!.bases);
      });

      // Exchanges
      LANDMARKS.exchanges.forEach(e => {
        L.marker(e.coords as L.LatLngExpression, {
          icon: L.divIcon({ 
            html: '<div style="background:#f0ad4e; width:12px; height:12px; border:1px solid #fff; border-radius: 50%;"></div>',
            className: 'custom-marker'
          })
        }).bindPopup(`<b>EXCHANGE/COMMISSARY:</b> ${e.name}`).addTo(layerGroups.current!.exchanges);
      });

      // Medical
      LANDMARKS.medical.forEach(m => {
        L.marker(m.coords as L.LatLngExpression, {
          icon: L.divIcon({ 
            html: '<div style="background:#5cb85c; width:12px; height:12px; border:1px solid #fff; transform: rotate(45deg);"></div>',
            className: 'custom-marker'
          })
        }).bindPopup(`<b>${m.type.toUpperCase()}:</b> ${m.name}`).addTo(layerGroups.current!.medical);
      });

      // EFMP Resources
      const resources = [
        { name: "Children's Hospital (CHKD)", coords: [36.86, -76.29] },
        { name: "Specialized Education Center", coords: [36.75, -76.55] }
      ];

      resources.forEach(r => {
        L.marker(r.coords as L.LatLngExpression, {
          icon: L.divIcon({ 
            html: '<div style="width: 0; height: 0; border-left: 7px solid transparent; border-right: 7px solid transparent; border-bottom: 14px solid #5bc0de;"></div>',
            className: 'custom-marker'
          })
        }).bindPopup(`<b>EFMP RESOURCE:</b> ${r.name}`).addTo(layerGroups.current!.efmp);
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroups.current = null;
      }
    };
  }, []);

  // Sync layers with state
  useEffect(() => {
    if (!mapInstanceRef.current || !layerGroups.current) return;
    const map = mapInstanceRef.current;
    const groups = layerGroups.current;

    Object.entries(activeLayers).forEach(([key, active]) => {
      const group = groups[key as keyof typeof groups];
      if (active) {
        group.addTo(map);
      } else {
        group.remove();
      }
    });
  }, [activeLayers]);

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-24 pb-24">
      {/* Hero Section */}
      <section className="bg-brand-ink text-white py-24 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none">
          <Anchor className="w-full h-full rotate-12" />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-brand-primary text-xs font-bold uppercase tracking-widest mb-8"
            >
              <Shield className="w-4 h-4" /> Veteran to Veteran Guarantee
            </motion.div>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6">
              Relocation Stress is Real. <span className="text-brand-primary">We've Been There.</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              Retired Marine owned and operated. We understand PCS timelines, BAH landscapes, and the unique needs of military families in the Tidewater area.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { 
              title: "Virtual Readiness", 
              desc: "Since many families can't visit before they arrive, we offer 4K Virtual Walkthroughs and Detailed Floor Plans as a standard feature.",
              icon: Navigation
            },
            { 
              title: "EFMP-Friendly", 
              desc: "We help families find homes near specialized schools or clinics for those in the Exceptional Family Member Program.",
              icon: Info
            },
            { 
              title: "PCS Concierge", 
              desc: "Direct support for NAS Oceana, Dam Neck, Norfolk Naval, and JEB Little Creek inbound personnel.",
              icon: Anchor
            }
          ].map((pillar, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-white border border-black/5 shadow-sm hover:shadow-md transition-all">
              <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center mb-6 text-brand-primary">
                <pillar.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-4">{pillar.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Interactive Map */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-xl">
            <h2 className="text-4xl font-serif font-bold mb-4">Precision Proximity Map</h2>
            <p className="text-gray-600">Toggle layers to see how close our properties are to your next duty station and essential resources.</p>
          </div>
          
          {/* Landmark Toggles */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'bases', label: 'Bases', icon: Building2, color: 'bg-[#d9534f]' },
              { key: 'exchanges', label: 'Exchanges', icon: ShoppingCart, color: 'bg-[#f0ad4e]' },
              { key: 'medical', label: 'VA/Hospitals', icon: Stethoscope, color: 'bg-[#5cb85c]' },
              { key: 'efmp', label: 'EFMP Resources', icon: Info, color: 'bg-[#5bc0de]' },
            ].map((t) => (
              <button
                key={t.key}
                onClick={() => toggleLayer(t.key as any)}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all border",
                  activeLayers[t.key as keyof typeof activeLayers]
                    ? "bg-brand-ink text-white border-brand-ink"
                    : "bg-white text-gray-500 border-black/5 hover:border-black/10"
                )}
              >
                <div className={cn("w-2 h-2 rounded-full", t.color)} />
                <t.icon className="w-3 h-3" />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[600px] rounded-[3rem] overflow-hidden border-4 border-white shadow-2xl relative">
          <div ref={mapRef} className="w-full h-full z-0" />
          
          {/* Legend Overlay */}
          <div className="absolute bottom-8 left-8 z-[1000] glass-panel p-6 rounded-2xl space-y-3 hidden md:block">
            <div className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-2">Map Legend</div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 rounded-full bg-brand-primary" />
              <span>Available Properties</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-[#d9534f] rounded-sm" />
              <span>Military Bases</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-[#f0ad4e] rounded-full" />
              <span>Exchanges/Commissaries</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-3 h-3 bg-[#5cb85c] rotate-45" />
              <span>VA Clinics/Hospitals</span>
            </div>
            <div className="flex items-center gap-3 text-sm">
              <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-bottom-[12px] border-bottom-[#5bc0de]" />
              <span>EFMP Resources</span>
            </div>
          </div>
        </div>
      </section>

      {/* Concierge Form */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-brand-bg rounded-[3rem] p-12 border border-black/5">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold mb-4">PCS & EFMP Concierge</h2>
            <p className="text-gray-600">Tell us your requirements and we'll build a custom relocation briefing for you.</p>
          </div>
          
          <form className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 ml-2">Rank & Full Name</label>
                <input type="text" className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="e.g. Sgt John Doe" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 ml-2">Military Email</label>
                <input type="email" className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="john.doe@navy.mil" />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 ml-2">Gaining Command</label>
                <select className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 appearance-none">
                  <option>NAS Oceana</option>
                  <option>JEB Little Creek / Ft. Story</option>
                  <option>NS Norfolk</option>
                  <option>Dam Neck Annex</option>
                  <option>Other / Remote</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase text-gray-400 ml-2">Report Date (EDD)</label>
                <input type="date" className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20" />
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border-2 border-dashed border-brand-primary/20">
              <label className="flex items-center gap-4 cursor-pointer">
                <input type="checkbox" className="w-5 h-5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary" />
                <div>
                  <div className="font-bold text-brand-primary">EFMP / Neurodiversity Support Needed?</div>
                  <p className="text-xs text-gray-500">Check this if you require proximity to specific schools, clinics, or low-sensory environments.</p>
                </div>
              </label>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold uppercase text-gray-400 ml-2">Specific Housing Requirements</label>
              <textarea rows={4} className="w-full px-6 py-4 rounded-2xl bg-white border border-black/5 focus:outline-none focus:ring-2 focus:ring-brand-primary/20" placeholder="e.g. Fenced yard for K9, quiet cul-de-sac, school zone preferences..." />
            </div>

            <button className="w-full py-5 rounded-2xl bg-brand-primary text-white font-bold text-lg hover:scale-[1.02] transition-transform shadow-xl shadow-brand-primary/20">
              Request Relocation Briefing
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}
