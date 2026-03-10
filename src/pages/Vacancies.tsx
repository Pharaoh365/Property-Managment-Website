import { useState, useEffect, useRef } from 'react';
import PropertyCard from '@/src/components/PropertyCard';
import { Property } from '@/src/types';
import { Search, Filter, Map as MapIcon, Grid, Building2, ShoppingCart, Stethoscope, Info } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

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

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 3958.8;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

export default function Vacancies() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'map'>('grid');
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroups = useRef<{
    properties: L.LayerGroup;
    bases: L.LayerGroup;
    exchanges: L.LayerGroup;
    medical: L.LayerGroup;
  } | null>(null);

  const [activeLayers, setActiveLayers] = useState({
    properties: true,
    bases: false,
    exchanges: false,
    medical: false
  });

  useEffect(() => {
    fetch('/api/properties')
      .then(res => res.json())
      .then(data => setProperties(data));
  }, []);

  const filteredProperties = properties.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || p.type === filter;
    return matchesSearch && matchesFilter;
  });

  useEffect(() => {
    if (viewMode === 'map' && mapRef.current && !mapInstanceRef.current) {
      const map = L.map(mapRef.current).setView([36.8529, -76.15], 11);
      
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; MKDDY Property Management'
      }).addTo(map);

      layerGroups.current = {
        properties: L.layerGroup().addTo(map),
        bases: L.layerGroup(),
        exchanges: L.layerGroup(),
        medical: L.layerGroup()
      };

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

      mapInstanceRef.current = map;
    }

    if (viewMode === 'map' && mapInstanceRef.current && layerGroups.current) {
      const groups = layerGroups.current;
      groups.properties.clearLayers();
      
      const homeIcon = L.divIcon({
        html: `<div style="background-color: #4a5d4d; width: 12px; height: 12px; border: 2px solid white; border-radius: 50%;"></div>`,
        className: 'custom-marker',
        iconSize: [12, 12]
      });

      filteredProperties.forEach(prop => {
        if (prop.lat && prop.lng) {
          const commuteInfo = LANDMARKS.bases.map(base => {
            const dist = getDistance(prop.lat!, prop.lng!, base.coords[0], base.coords[1]);
            const time = Math.round(dist * 2.5 + 5);
            return `<li><b>${base.name}:</b> ${time} mins</li>`;
          }).join('');

          L.marker([prop.lat, prop.lng], { icon: homeIcon })
            .addTo(groups.properties)
            .bindPopup(`
              <div style="font-family: sans-serif; min-width: 180px;">
                <img src="${prop.image_url}" style="width: 100%; height: 80px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />
                <strong style="color: #4a5d4d; display: block; margin-bottom: 4px;">${prop.title}</strong>
                <span style="display: block; font-size: 12px; margin-bottom: 4px; font-weight: bold;">$${prop.price}/mo</span>
                <div style="font-size: 10px; color: #666; border-top: 1px solid #eee; padding-top: 8px; margin-top: 8px;">
                  <div style="font-weight: bold; margin-bottom: 4px; text-transform: uppercase;">Commute Times:</div>
                  <ul style="margin: 0; padding-left: 12px;">${commuteInfo}</ul>
                </div>
              </div>
            `);
        }
      });
    }

    return () => {
      if (viewMode !== 'map' && mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        layerGroups.current = null;
      }
    };
  }, [viewMode, filteredProperties]);

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
  }, [activeLayers, viewMode]);

  const toggleLayer = (key: keyof typeof activeLayers) => {
    setActiveLayers(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-5xl font-serif font-bold mb-4">Available Vacancies</h1>
        <p className="text-gray-600">Find your perfect home in Virginia Beach or Norfolk.</p>
      </div>

      {/* Search and Filter Bar */}
      <div className="glass-panel p-4 rounded-3xl mb-12 flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by address or title..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-brand-bg rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/20"
          />
        </div>
        
        <div className="flex gap-2 w-full md:w-auto">
          {['All', 'Apartment', 'Single Family', 'Condo'].map((type) => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-4 py-3 rounded-2xl text-xs font-bold transition-all flex-1 md:flex-none ${
                filter === type 
                  ? "bg-brand-primary text-white" 
                  : "bg-brand-bg text-gray-600 hover:bg-gray-200"
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        <div className="flex gap-2 border-l border-black/5 pl-4 hidden md:flex">
          <button 
            onClick={() => setViewMode('grid')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'grid' ? "bg-brand-bg text-brand-primary" : "text-gray-400 hover:bg-brand-bg")}
          >
            <Grid className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setViewMode('map')}
            className={cn("p-3 rounded-xl transition-all", viewMode === 'map' ? "bg-brand-bg text-brand-primary" : "text-gray-400 hover:bg-brand-bg")}
          >
            <MapIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Results Grid / Map */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-3 gap-8">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((prop: Property) => (
              <motion.div
                key={prop.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <PropertyCard property={prop} />
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-gray-400 mb-4">
                <Search className="w-12 h-12 mx-auto opacity-20" />
              </div>
              <h3 className="text-xl font-serif font-bold">No properties found</h3>
              <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Map Controls */}
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'bases', label: 'Military Bases', icon: Building2, color: 'bg-[#d9534f]' },
              { key: 'exchanges', label: 'Exchanges', icon: ShoppingCart, color: 'bg-[#f0ad4e]' },
              { key: 'medical', label: 'VA/Hospitals', icon: Stethoscope, color: 'bg-[#5cb85c]' },
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
          
          <div className="w-full h-[600px] bg-gray-200 rounded-[2rem] overflow-hidden relative border border-black/5 shadow-inner">
            <div ref={mapRef} className="w-full h-full z-0" />
          </div>
        </div>
      )}
    </div>
  );
}
