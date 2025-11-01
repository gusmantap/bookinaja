'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

type Service = {
  id: number;
  name: string;
  price: string;
  duration: string;
};

export default function OnboardingStep2() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [serviceCount, setServiceCount] = useState(0);
  const maxServices = 10;

  useEffect(() => {
    // Load from sessionStorage
    const savedStep2 = sessionStorage.getItem('onboarding_step2');

    if (savedStep2) {
      const savedServices = JSON.parse(savedStep2);
      setServices(savedServices);
      setServiceCount(savedServices.length);
    } else {
      // Add first empty service
      addService();
    }
  }, []);

  const addService = (name = '', price = '', duration = '') => {
    if (serviceCount >= maxServices) {
      alert('Maksimal 10 layanan');
      return;
    }

    const newService: Service = {
      id: serviceCount + 1,
      name,
      price,
      duration,
    };

    setServices([...services, newService]);
    setServiceCount(serviceCount + 1);
  };

  const removeService = (id: number) => {
    setServices(services.filter(service => service.id !== id));
    setServiceCount(serviceCount - 1);
  };

  const updateService = (id: number, field: keyof Service, value: string) => {
    setServices(
      services.map(service =>
        service.id === id ? { ...service, [field]: value } : service
      )
    );
  };

  const formatPrice = (value: string) => {
    // Remove non-numeric characters
    return value.replace(/[^0-9]/g, '');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (services.length === 0) {
      alert('Tambahkan minimal 1 layanan');
      return;
    }

    // Save to sessionStorage
    sessionStorage.setItem('onboarding_step2', JSON.stringify(services));

    // Navigate to step 3
    router.push('/onboarding/step3');
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-3xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 2 of 4</span>
            <span className="text-sm font-medium text-zinc-600">50%</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
              style={{ width: '50%' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Layanan & Harga</h1>
            <p className="text-zinc-600">Tambahkan layanan yang Anda tawarkan beserta harganya</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} id="servicesForm">
            {/* Services Container */}
            <div className="space-y-4 mb-6">
              {services.map((service, index) => (
                <div
                  key={service.id}
                  className="p-4 border-2 border-zinc-200 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-zinc-700">Layanan {index + 1}</h3>
                    <button
                      type="button"
                      onClick={() => removeService(service.id)}
                      className="text-red-500 hover:text-red-700 font-semibold text-sm"
                    >
                      Hapus
                    </button>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">
                      Nama Layanan *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={100}
                      value={service.name}
                      onChange={(e) => updateService(service.id, 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                      placeholder="Contoh: Haircut Classic"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Harga (Rp) *
                      </label>
                      <input
                        type="text"
                        required
                        value={service.price}
                        onChange={(e) =>
                          updateService(service.id, 'price', formatPrice(e.target.value))
                        }
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        placeholder="50000"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-zinc-600 mb-1">
                        Durasi *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={50}
                        value={service.duration}
                        onChange={(e) => updateService(service.id, 'duration', e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        placeholder="30 menit"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Add Service Button */}
            <button
              type="button"
              onClick={() => addService()}
              className="w-full px-4 py-3 border-2 border-dashed border-zinc-300 text-zinc-600 font-semibold rounded-xl hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
            >
              + Tambah Layanan
            </button>

            <p className="text-xs text-zinc-500 mt-2">Minimal 1 layanan, maksimal 10 layanan</p>

            {/* Buttons */}
            <div className="flex gap-3 pt-6">
              <button
                type="button"
                onClick={() => router.push('/onboarding/step1')}
                className="px-6 py-3 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all"
              >
                ← Kembali
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
              >
                Lanjut ke Step 3 →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
