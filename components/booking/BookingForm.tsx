'use client';

import { useState } from 'react';
import { Business, Theme } from '@/types';
import PaymentMethodSelect from './PaymentMethodSelect';
import PaymentProofUpload from './PaymentProofUpload';

interface BookingFormProps {
  business: Business;
  theme: Theme;
}

export default function BookingForm({ business, theme }: BookingFormProps) {
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'transfer'>('onsite');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date().toISOString().split('T')[0];

  const bookedTimes = ['10:00', '14:00']; // Mock booked times
  const availableTimes = ['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (paymentMethod === 'transfer' && !paymentProof) {
      alert('Silakan upload bukti transfer terlebih dahulu!');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      if (paymentProof) {
        formData.append('payment_proof', paymentProof);
      }
      formData.append('business_id', business.id);
      formData.append('payment_method', paymentMethod);

      const response = await fetch('/api/bookings', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        alert('Booking berhasil! Kami akan segera menghubungi Anda via WhatsApp.');
        (e.target as HTMLFormElement).reset();
        setPaymentMethod('onsite');
        setPaymentProof(null);
        setPreviewUrl(null);
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
            Pilih Waktu
          </label>
          <div className="grid grid-cols-3 gap-2">
            {availableTimes.map((time) => {
              const isBooked = bookedTimes.includes(time);
              return (
                <div key={time}>
                  <input
                    type="radio"
                    id={`time_${time}`}
                    name="time"
                    value={time}
                    required
                    disabled={isBooked}
                    className="peer hidden"
                  />
                  <label
                    htmlFor={`time_${time}`}
                    className={`block text-center py-2 rounded-lg text-sm font-medium cursor-pointer transition-all ${
                      isBooked
                        ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed'
                        : `text-zinc-900 border-2 border-zinc-200 hover:border-${theme.accentColor}-400 peer-checked:border-${theme.accentColor}-500 peer-checked:bg-${theme.accentColor}-50 peer-checked:text-${theme.accentColor}-700`
                    }`}
                  >
                    {time}
                    {isBooked && <div className="text-[10px]">Penuh</div>}
                  </label>
                </div>
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
