export interface Property {
  id: number;
  title: string;
  address: string;
  price: number;
  beds: number;
  baths: number;
  sqft: number;
  type: string;
  status: string;
  image_url: string;
  description: string;
  neighborhood: string;
  rating: number;
  available_date?: string;
  lat?: number;
  lng?: number;
}

export interface MaintenanceRequest {
  id: number;
  property_id: number;
  tenant_id: string;
  issue: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface User {
  id: string;
  name: string;
  role: 'tenant' | 'owner' | 'admin';
  email: string;
}
