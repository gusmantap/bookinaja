'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

type DayHours = {
  closed: boolean;
  open: string;
  close: string;
};

type OperatingHours = {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
};

const dayLabels = {
  monday: 'Senin',
  tuesday: 'Selasa',
  wednesday: 'Rabu',
  thursday: 'Kamis',
  friday: 'Jumat',
  saturday: 'Sabtu',
  sunday: 'Minggu',
};

const defaultHours: DayHours = {
  closed: false,
  open: '09:00',
  close: '21:00',
};

const defaultWeekendHours: DayHours = {
  closed: false,
  open: '09:00',
  close: '22:00',
};

export default function OnboardingStep3() {
  const router = useRouter();
  const { data: session, update } = useSession();
  const [operatingHours, setOperatingHours] = useState<OperatingHours>({
    monday: { ...defaultHours },
    tuesday: { ...defaultHours },
    wednesday: { ...defaultHours },
    thursday: { ...defaultHours },
    friday: { ...defaultHours },
    saturday: { ...defaultWeekendHours },
    sunday: { ...defaultWeekendHours },
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load from sessionStorage
    const savedStep3 = sessionStorage.getItem('onboarding_step3');

    if (savedStep3) {
      setOperatingHours(JSON.parse(savedStep3));
    }
  }, []);

  const toggleDay = (day: keyof OperatingHours) => {
    setOperatingHours({
      ...operatingHours,
      [day]: {
        ...operatingHours[day],
        closed: !operatingHours[day].closed,
      },
    });
  };

  const updateTime = (day: keyof OperatingHours, field: 'open' | 'close', value: string) => {
    setOperatingHours({
      ...operatingHours,
      [day]: {
        ...operatingHours[day],
        [field]: value,
      },
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Save to sessionStorage
      sessionStorage.setItem('onboarding_step3', JSON.stringify(operatingHours));

      // Navigate to step 4 (theme selection)
      router.push('/onboarding/step4');
    } catch (error) {
      console.error('Error:', error);
      alert('Terjadi kesalahan. Coba lagi.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 to-purple-50 min-h-screen">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 3 of 4</span>
            <span className="text-sm font-medium text-zinc-600">75%</span>
          </div>
          <div className="h-2 bg-zinc-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all"
              style={{ width: '75%' }}
            />
          </div>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-zinc-900 mb-2">Jam Operasional</h1>
            <p className="text-zinc-600">Tentukan jam buka bisnis Anda setiap harinya</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} id="hoursForm">
            {/* Days Container */}
            <div className="space-y-4 mb-6">
              {Object.entries(dayLabels).map(([dayKey, dayLabel]) => {
                const day = dayKey as keyof OperatingHours;
                const hours = operatingHours[day];

                return (
                  <div key={day} className="p-4 border-2 border-zinc-200 rounded-xl">
                    <div className="flex items-center justify-between mb-3">
                      <label className="font-semibold text-zinc-700">{dayLabel}</label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={hours.closed}
                          onChange={() => toggleDay(day)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-zinc-600">Tutup</span>
                      </label>
                    </div>
                    <div
                      className={`grid grid-cols-2 gap-3 transition-all ${
                        hours.closed ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Buka
                        </label>
                        <input
                          type="time"
                          value={hours.open}
                          onChange={(e) => updateTime(day, 'open', e.target.value)}
                          disabled={hours.closed}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-zinc-600 mb-1">
                          Tutup
                        </label>
                        <input
                          type="time"
                          value={hours.close}
                          onChange={(e) => updateTime(day, 'close', e.target.value)}
                          disabled={hours.closed}
                          className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:border-blue-500 focus:ring-2 focus:ring-blue-100 outline-none transition-all text-sm"
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => router.push('/onboarding/step2')}
                disabled={isSubmitting}
                className="px-6 py-3 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all disabled:opacity-50"
              >
                ← Kembali
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? 'Menyimpan...' : 'Selesai & Lihat Preview →'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
