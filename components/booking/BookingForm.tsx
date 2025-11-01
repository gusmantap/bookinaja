'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business, Theme } from '@/types';
import PaymentMethodSelect from './PaymentMethodSelect';
import PaymentProofUpload from './PaymentProofUpload';

interface BookingFormProps {
  business: Business;
  theme: Theme;
}

export default function BookingForm({ business, theme }: BookingFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'transfer'>('onsite');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const today = new Date().toISOString().split('T')[0];

  // Generate available times from 08:00 to 22:00 (8 AM to 10 PM)
  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];
  const bookedTimes: string[] = []; // Will be fetched from API in the future

  // Get selected service details
  const selectedServiceData = business.services.find(s => s.id === selectedService);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService) {
      alert('Silakan pilih layanan terlebih dahulu!');
      return;
    }

    if (paymentMethod === 'transfer' && !paymentProof) {
      alert('Silakan upload bukti transfer terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Save form values before async operation
      const name = formData.get('name') as string;
      const phone = formData.get('phone') as string;
      const date = formData.get('date') as string;

      if (paymentProof) {
        formData.append('payment_proof', paymentProof);
      }
      formData.append('business_id', business.id);
      formData.append('payment_method', paymentMethod);
      formData.append('service_id', selectedService);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        // Redirect to thank you page with booking info
        const params = new URLSearchParams({
          business: business.name,
          slug: business.slug,
          name: name,
          service: selectedServiceData?.name || '',
          date: date,
          time: selectedTime,
          phone: phone,
        });

        router.push(`/booking-success?${params.toString()}`);
      } else {
        throw new Error('Failed to create booking');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="booking-form" className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 lg:sticky lg:top-6">
      <h2 className="text-lg font-bold text-zinc-900 mb-4">Booking Sekarang</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nama Lengkap
          </label>
          <input
            type="text"
            name="name"
            required
            className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
            placeholder="Nama Anda"
          />
        </div>

        {/* Pilih Layanan */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Pilih Layanan
          </label>
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            required
            className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
          >
            <option value="">-- Pilih Layanan --</option>
            {business.services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name} - Rp {service.price.toLocaleString('id-ID')} ({service.duration})
              </option>
            ))}
          </select>
          {selectedServiceData && (
            <div className="mt-2 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-900">
                <span className="font-semibold">Harga:</span> Rp {selectedServiceData.price.toLocaleString('id-ID')} <br />
                <span className="font-semibold">Durasi:</span> {selectedServiceData.duration}
              </p>
            </div>
          )}
        </div>

        {/* Nomor WhatsApp */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Nomor WhatsApp
          </label>
          <input
            type="tel"
            name="phone"
            required
            pattern="[0-9]{10,13}"
            className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
            placeholder="08xx xxxx xxxx"
          />
        </div>

        {/* Pilih Tanggal */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Pilih Tanggal
          </label>
          <input
            type="date"
            name="date"
            required
            min={today}
            className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
          />
        </div>

        {/* Pilih Waktu */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-3">
            Pilih Waktu (08:00 - 22:00)
          </label>
          <input type="hidden" name="time" value={selectedTime} required />
          <div className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
            {availableTimes.map((time) => {
              const isBooked = bookedTimes.includes(time);
              const isSelected = selectedTime === time;
              return (
                <button
                  key={time}
                  type="button"
                  onClick={() => !isBooked && setSelectedTime(time)}
                  disabled={isBooked}
                  className={`py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                    isBooked
                      ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                      : isSelected
                      ? 'border-2 border-blue-500 bg-blue-50 text-blue-700 font-semibold'
                      : 'border-2 border-zinc-200 text-zinc-900 hover:border-blue-400 hover:bg-blue-50'
                  }`}
                >
                  {time}
                  {isBooked && <div className="text-[10px]">Penuh</div>}
                </button>
              );
            })}
          </div>
        </div>

        {/* Catatan */}
        <div>
          <label className="block text-sm font-semibold text-zinc-700 mb-2">
            Catatan (Opsional)
          </label>
          <textarea
            name="notes"
            rows={3}
            className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition resize-none`}
            placeholder="Tambahan informasi..."
          />
        </div>

        {/* Payment Method */}
        <PaymentMethodSelect
          value={paymentMethod}
          onChange={setPaymentMethod}
          theme={theme}
          business={business}
        />

        {/* Payment Proof Upload */}
        {paymentMethod === 'transfer' && (
          <PaymentProofUpload
            file={paymentProof}
            previewUrl={previewUrl}
            onFileChange={(file, preview) => {
              setPaymentProof(file);
              setPreviewUrl(preview);
            }}
            theme={theme}
          />
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 bg-gradient-to-r ${theme.buttonGradient} hover:${theme.buttonHover} text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? 'Memproses...' : 'Konfirmasi Booking'}
        </button>

        <p className="text-xs text-center text-zinc-500">
          💬 Konfirmasi otomatis via WhatsApp
        </p>
      </form>
    </div>
  );
}
