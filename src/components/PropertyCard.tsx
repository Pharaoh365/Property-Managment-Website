import { Property } from '@/src/types';
import { Bed, Bath, Square, MapPin, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="group bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-500 border border-black/5">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img 
          src={property.image_url} 
          alt={property.title} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        <div className="absolute top-4 left-4 flex gap-2">
          <span className="bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-brand-ink">
            {property.type}
          </span>
          {property.rating > 4.5 && (
            <span className="bg-brand-primary text-white px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
              <Star className="w-3 h-3 fill-current" />
              Top Rated
            </span>
          )}
        </div>
        <div className="absolute bottom-4 right-4">
          <div className="bg-brand-ink text-white px-4 py-2 rounded-2xl font-bold text-lg">
            ${property.price.toLocaleString()}<span className="text-xs font-normal opacity-70">/mo</span>
          </div>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-center gap-1 text-gray-500 text-xs font-medium mb-2">
          <MapPin className="w-3 h-3" />
          {property.neighborhood}
        </div>
        <h3 className="text-xl font-serif font-bold mb-4 group-hover:text-brand-primary transition-colors">
          {property.title}
        </h3>
        
        <div className="grid grid-cols-3 gap-4 py-4 border-y border-black/5 mb-6">
          <div className="flex flex-col items-center gap-1">
            <Bed className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold">{property.beds} Beds</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Bath className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold">{property.baths} Baths</span>
          </div>
          <div className="flex flex-col items-center gap-1">
            <Square className="w-4 h-4 text-brand-primary" />
            <span className="text-xs font-bold">{property.sqft} sqft</span>
          </div>
        </div>
        
        <Link 
          to={`/vacancies/${property.id}`}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-brand-bg text-brand-ink font-bold text-sm hover:bg-brand-primary hover:text-white transition-all"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}
