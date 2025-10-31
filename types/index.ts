export interface Business {
  id: string;
  slug: string;
  name: string;
  category: 'barbershop' | 'salon-wanita' | 'spa' | 'cafe' | 'nail-art' | 'photobooth';
  bio?: string;
  phone: string;
  address: string;
  email?: string;
  instagram?: string;
  whatsapp?: string;
  bankName?: string;
  accountNumber?: string;
  accountName?: string;
  operatingHours?: Record<string, string>;
  theme: string;
  photos: string[];
  services: Service[];
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: string;
}

export interface Booking {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  service: string;
  price: number;
  date: Date;
  time: string;
  duration: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  notes?: string;
  paymentMethod: 'onsite' | 'transfer';
  paymentProofUrl?: string;
  businessId: string;
  createdAt: Date;
}

export interface Theme {
  name: string;
  category: string;
  headerGradient: string;
  avatarGradient: string;
  accentColor: string;
  buttonGradient: string;
  buttonHover: string;
  // Extended properties
  borderRadius: 'sharp' | 'rounded' | 'soft';
  fontWeight: 'light' | 'normal' | 'semibold' | 'bold';
  infoBoxStyle: {
    gradient: string;
    borderColor: string;
    iconColor: string;
  };
}
