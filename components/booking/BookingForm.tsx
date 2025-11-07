'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Business, Theme } from '@/types';
import PaymentMethodSelect from './PaymentMethodSelect';
import PaymentProofUpload from './PaymentProofUpload';

type FieldKey =
  | 'name'
  | 'service'
  | 'phone'
  | 'date'
  | 'time'
  | 'notes'
  | 'payment'
  | 'paymentProof';

type BookingFieldSettings = {
  name: {
    visible: boolean;
    required: boolean;
    internalNote: string;
  };
  service: {
    visible: boolean;
    promoBadge: boolean;
  };
  phone: {
    visible: boolean;
    autoConfirmation: boolean;
    reminderDayBefore: boolean;
  };
  date: {
    visible: boolean;
    minLeadDays: number;
    maxLeadDays: number | null;
  };
  time: {
    visible: boolean;
    slotIntervalMinutes: number;
  };
  notes: {
    visible: boolean;
    requiredForComplex: boolean;
  };
  payment: {
    visible: boolean;
    enabledMethods: {
      onsite: boolean;
      transfer: boolean;
    };
    minDepositPercent: number;
    transferDetails: {
      bankName: string;
      accountNumber: string;
      accountName: string;
    };
    transferNote: string;
  };
  paymentProof: {
    visible: boolean;
    requireProof: boolean;
    minDepositThreshold: number;
  };
};

type PartialBookingFieldSettings = {
  [K in keyof BookingFieldSettings]?: Partial<BookingFieldSettings[K]>;
};

const mergeFieldSettings = (
  base: BookingFieldSettings,
  saved?: PartialBookingFieldSettings
): BookingFieldSettings => ({
  ...base,
  name: { ...base.name, ...saved?.name },
  service: { ...base.service, ...saved?.service },
  phone: { ...base.phone, ...saved?.phone },
  date: { ...base.date, ...saved?.date },
  time: { ...base.time, ...saved?.time },
  notes: { ...base.notes, ...saved?.notes },
  payment: {
    ...base.payment,
    ...saved?.payment,
    enabledMethods: {
      ...base.payment.enabledMethods,
      ...saved?.payment?.enabledMethods,
    },
    transferDetails: {
      ...base.payment.transferDetails,
      ...saved?.payment?.transferDetails,
    },
    transferNote: saved?.payment?.transferNote ?? base.payment.transferNote,
  },
  paymentProof: { ...base.paymentProof, ...saved?.paymentProof },
});

const DEFAULT_FIELD_SETTINGS: BookingFieldSettings = {
  name: {
    visible: true,
    required: true,
    internalNote: '',
  },
  service: {
    visible: true,
    promoBadge: true,
  },
  phone: {
    visible: true,
    autoConfirmation: true,
    reminderDayBefore: true,
  },
  date: {
    visible: true,
    minLeadDays: 0,
    maxLeadDays: 30,
  },
  time: {
    visible: true,
    slotIntervalMinutes: 60,
  },
  notes: {
    visible: true,
    requiredForComplex: false,
  },
  payment: {
    visible: true,
    enabledMethods: {
      onsite: true,
      transfer: true,
    },
    minDepositPercent: 50,
    transferDetails: {
      bankName: '',
      accountNumber: '',
      accountName: '',
    },
    transferNote: 'Silakan transfer minimal DP 50% dari total biaya',
  },
  paymentProof: {
    visible: true,
    requireProof: true,
    minDepositThreshold: 50,
  },
};

const FIELD_LABELS: Record<FieldKey, string> = {
  name: 'Nama Lengkap',
  service: 'Pilih Layanan',
  phone: 'Nomor WhatsApp',
  date: 'Pilih Tanggal',
  time: 'Pilih Waktu',
  notes: 'Catatan',
  payment: 'Skema Pembayaran',
  paymentProof: 'Bukti Pembayaran',
};

interface BookingFormProps {
  business: Business;
  theme: Theme;
  isOwner?: boolean;
}

export default function BookingForm({ business, theme, isOwner = false }: BookingFormProps) {
  const router = useRouter();
  const [paymentMethod, setPaymentMethod] = useState<'onsite' | 'transfer'>('onsite');
  const [paymentProof, setPaymentProof] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  const [timeError, setTimeError] = useState<string | null>(null);
  const [fieldSettings, setFieldSettings] = useState<BookingFieldSettings>(DEFAULT_FIELD_SETTINGS);
  const [activeField, setActiveField] = useState<FieldKey | null>(null);

  const storageKey = useMemo(() => `booking-field-settings-${business.id}`, [business.id]);
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);

  useEffect(() => {
    if (!isOwner) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored) as PartialBookingFieldSettings;
        setFieldSettings((prev) => mergeFieldSettings(prev, parsed));
      }
    } catch (error) {
      console.error('Failed to load booking field settings:', error);
    }
  }, [isOwner, storageKey]);

  useEffect(() => {
    if (!isOwner) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(fieldSettings));
    } catch (error) {
      console.error('Failed to save booking field settings:', error);
    }
  }, [fieldSettings, isOwner, storageKey]);

  // Generate available times from 08:00 to 22:00 (8 AM to 10 PM)
  const availableTimes = [
    '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00',
    '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
  ];
  const bookedTimes: string[] = []; // Will be fetched from API in the future

  const updateFieldSettings = <K extends FieldKey>(
    field: K,
    updater: (prev: BookingFieldSettings[K]) => BookingFieldSettings[K]
  ) => {
    setFieldSettings((prev) => ({
      ...prev,
      [field]: updater(prev[field]),
    }));
  };

  useEffect(() => {
    if (!fieldSettings.payment.enabledMethods.transfer && paymentMethod === 'transfer') {
      setPaymentMethod('onsite');
    }
  }, [fieldSettings.payment.enabledMethods.transfer, paymentMethod]);

  // Get selected service details
  const selectedServiceData = business.services.find(s => s.id === selectedService);

  const minDateInputValue = useMemo(() => {
    const base = new Date();
    base.setDate(base.getDate() + Math.max(0, fieldSettings.date.minLeadDays));
    return base.toISOString().split('T')[0];
  }, [fieldSettings.date.minLeadDays]);

  const maxDateInputValue = useMemo(() => {
    if (fieldSettings.date.maxLeadDays == null) return undefined;
    const base = new Date();
    base.setDate(base.getDate() + Math.max(fieldSettings.date.minLeadDays, fieldSettings.date.maxLeadDays));
    return base.toISOString().split('T')[0];
  }, [fieldSettings.date.maxLeadDays, fieldSettings.date.minLeadDays]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedService) {
      alert('Silakan pilih layanan terlebih dahulu!');
      return;
    }

    if (
      fieldSettings.payment.visible &&
      fieldSettings.payment.enabledMethods.transfer &&
      paymentMethod === 'transfer' &&
      fieldSettings.paymentProof.visible &&
      fieldSettings.paymentProof.requireProof &&
      !paymentProof
    ) {
      alert('Silakan upload bukti transfer terlebih dahulu!');
      return;
    }

    if (fieldSettings.time.visible && !selectedTime) {
      setTimeError('Silakan pilih jam kedatangan');
      document.getElementById('time-picker')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setTimeError(null);

    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Save form values before async operation
      const name = (formData.get('name') as string) || '';
      const phone = (formData.get('phone') as string) || '';
      const chosenDate = fieldSettings.date.visible ? (formData.get('date') as string) : today;

      if (paymentProof) {
        formData.append('payment_proof', paymentProof);
      }
      formData.append('business_id', business.id);
      formData.append('payment_method', paymentMethod);
      formData.append('service_id', selectedService);
      formData.set('date', selectedDate || chosenDate);
      if (selectedTime) {
        formData.set('time', selectedTime);
      }

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
          date: selectedDate || chosenDate,
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

  const shouldRenderField = (field: FieldKey) => fieldSettings[field].visible || isOwner;

  const isFieldHiddenForVisitors = (field: FieldKey) =>
    !fieldSettings[field].visible && isOwner;

  const openFieldSettings = (field: FieldKey) => {
    if (!isOwner) return;
    setActiveField(field);
  };

  const FieldHeader = ({
    field,
    label,
    htmlFor,
    marginBottom = 'mb-2',
  }: {
    field: FieldKey;
    label: string;
    htmlFor?: string;
    marginBottom?: string;
  }) => (
    <div className={`flex items-center justify-between ${marginBottom}`}>
      <label
        htmlFor={htmlFor}
        className="block text-sm font-semibold text-zinc-700"
      >
        {label}
        {isFieldHiddenForVisitors(field) && (
          <span className="ml-2 text-xs font-semibold text-amber-600">
            Tidak ditampilkan ke pengunjung
          </span>
        )}
      </label>
      {isOwner && (
        <button
          type="button"
          onClick={() => openFieldSettings(field)}
          className="p-1.5 rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-900 hover:border-zinc-300 transition"
          title="Atur field ini"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l.284.874a1 1 0 00.95.69h.924c.969 0 1.371 1.24.588 1.81l-.75.545a1 1 0 000 1.618l.75.545c.783.57.38 1.81-.588 1.81h-.924a1 1 0 00-.95.69l-.284.874c-.299.921-1.603.921-1.902 0l-.284-.874a1 1 0 00-.95-.69h-.924c-.969 0-1.371-1.24-.588-1.81l.75-.545a1 1 0 000-1.618l-.75-.545c-.783-.57-.38-1.81.588-1.81h.924a1 1 0 00.95-.69l.284-.874z"></path>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
          </svg>
        </button>
      )}
    </div>
  );

  const SettingsToggle = ({
    label,
    description,
    checked,
    onChange,
    children,
  }: {
    label: string;
    description?: string;
    checked: boolean;
    onChange: (value: boolean) => void;
    children?: React.ReactNode;
  }) => (
    <div className="border border-zinc-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between gap-4 px-4 py-3 bg-zinc-50 border-b border-zinc-200">
        <div>
          <p className="text-sm font-semibold text-zinc-900">{label}</p>
          {description && <p className="text-xs text-zinc-500 mt-0.5">{description}</p>}
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          onClick={() => onChange(!checked)}
          className={`w-14 h-8 rounded-full border-2 transition-all flex items-center px-1 ${
            checked ? 'bg-emerald-500 border-emerald-500 justify-end' : 'bg-zinc-100 border-zinc-300 justify-start'
          }`}
        >
          <span className="w-6 h-6 rounded-full bg-white shadow" />
        </button>
      </div>
      {children && checked && (
        <div className="px-4 pb-4 pt-3 bg-white">{children}</div>
      )}
    </div>
  );

  const closeSettingsModal = () => setActiveField(null);

  const renderSettingsContent = () => {
    if (!activeField) return null;
    const visibilityControl = (
      <SettingsToggle
        label="Tampilkan field ini"
        description="Pengunjung akan melihat field ini di form booking."
        checked={fieldSettings[activeField].visible}
        onChange={(value) =>
          updateFieldSettings(activeField, (prev) => ({
            ...prev,
            visible: value,
          }))
        }
      />
    );

    switch (activeField) {
      case 'name':
        return (
          <>
            {visibilityControl}
            <SettingsToggle
              label="Wajib diisi"
              description="Paksa pelanggan mengisi nama lengkap."
              checked={fieldSettings.name.required}
              onChange={(value) =>
                updateFieldSettings('name', (prev) => ({
                  ...prev,
                  required: value,
                }))
              }
            />
            <div>
              <p className="text-xs font-semibold text-zinc-600 mb-1">Catatan internal (optional)</p>
              <textarea
                rows={2}
                value={fieldSettings.name.internalNote}
                onChange={(e) =>
                  updateFieldSettings('name', (prev) => ({
                    ...prev,
                    internalNote: e.target.value,
                  }))
                }
                className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                placeholder="Contoh: 'ingatkan bawa kartu member'"
              />
            </div>
          </>
        );
      case 'date':
        return (
          <>
            {visibilityControl}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">
                  Jarak minimal booking (hari)
                </label>
                <input
                  type="number"
                  min={0}
                  value={fieldSettings.date.minLeadDays}
                  onChange={(e) =>
                    updateFieldSettings('date', (prev) => ({
                      ...prev,
                      minLeadDays: Math.max(0, Number(e.target.value) || 0),
                    }))
                  }
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-zinc-600 mb-1">
                  Jarak maksimal booking (hari)
                </label>
                <input
                  type="number"
                  min={0}
                  value={fieldSettings.date.maxLeadDays ?? ''}
                  placeholder="Mis. 30"
                  onChange={(e) =>
                    updateFieldSettings('date', (prev) => ({
                      ...prev,
                      maxLeadDays: e.target.value === '' ? null : Math.max(0, Number(e.target.value)),
                    }))
                  }
                  className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                />
                <p className="text-[11px] text-zinc-500 mt-1">
                  Kosongkan jika tidak ada batas maksimal.
                </p>
              </div>
            </div>
          </>
        );
      case 'payment':
        return (
          <>
            {visibilityControl}
            <SettingsToggle
              label="Bayar di lokasi"
              description="Tawarkan opsi bayar langsung saat kedatangan."
              checked={fieldSettings.payment.enabledMethods.onsite}
              onChange={(value) =>
                updateFieldSettings('payment', (prev) => ({
                  ...prev,
                  enabledMethods: {
                    ...prev.enabledMethods,
                    onsite: value,
                  },
                }))
              }
            />
            <SettingsToggle
              label="Transfer bank"
              description="Tawarkan opsi DP/lunas via transfer."
              checked={fieldSettings.payment.enabledMethods.transfer}
              onChange={(value) =>
                updateFieldSettings('payment', (prev) => ({
                  ...prev,
                  enabledMethods: {
                    ...prev.enabledMethods,
                    transfer: value,
                  },
                }))
              }
            >
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">
                      Nama Bank
                    </label>
                    <input
                      type="text"
                      value={fieldSettings.payment.transferDetails.bankName}
                      onChange={(e) =>
                        updateFieldSettings('payment', (prev) => ({
                          ...prev,
                          transferDetails: {
                            ...prev.transferDetails,
                            bankName: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="Contoh: BCA"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">
                      Nomor Rekening
                    </label>
                    <input
                      type="text"
                      value={fieldSettings.payment.transferDetails.accountNumber}
                      onChange={(e) =>
                        updateFieldSettings('payment', (prev) => ({
                          ...prev,
                          transferDetails: {
                            ...prev.transferDetails,
                            accountNumber: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="1234567890"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1">
                      Atas Nama
                    </label>
                    <input
                      type="text"
                      value={fieldSettings.payment.transferDetails.accountName}
                      onChange={(e) =>
                        updateFieldSettings('payment', (prev) => ({
                          ...prev,
                          transferDetails: {
                            ...prev.transferDetails,
                            accountName: e.target.value,
                          },
                        }))
                      }
                      className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200"
                      placeholder="Nama Pemilik Rekening"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1">
                    Catatan untuk pelanggan
                  </label>
                  <textarea
                    rows={2}
                    value={fieldSettings.payment.transferNote}
                    onChange={(e) =>
                      updateFieldSettings('payment', (prev) => ({
                        ...prev,
                        transferNote: e.target.value,
                      }))
                    }
                    className="w-full border border-zinc-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-200 resize-none"
                    placeholder="Silakan transfer minimal DP 50% dari total biaya"
                  />
                </div>
                <p className="text-[11px] text-purple-700">
                  * Detail ini akan tampil kepada pelanggan ketika memilih pembayaran transfer.
                </p>
              </div>
            </SettingsToggle>
          </>
        );
      case 'paymentProof':
        return (
          <>
            {visibilityControl}
            <SettingsToggle
              label="Wajibkan bukti transfer"
              description="Minta pelanggan upload bukti untuk konfirmasi."
              checked={fieldSettings.paymentProof.requireProof}
              onChange={(value) =>
                updateFieldSettings('paymentProof', (prev) => ({
                  ...prev,
                  requireProof: value,
                }))
              }
            />
          </>
        );
      default:
        return (
          <>
            {visibilityControl}
            <p className="text-sm text-zinc-500 mt-4">
              Pengaturan lanjutan untuk field <span className="font-semibold">{FIELD_LABELS[activeField]}</span>{' '}
              akan segera hadir.
            </p>
          </>
        );
    }
  };

  return (
    <>
      <form
        id="booking-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl shadow-md border border-zinc-200 p-6 space-y-4"
      >
        <h2 className="text-lg font-bold text-zinc-900">Booking Sekarang</h2>

        <div className="space-y-4">
        {/* Nama Lengkap */}
        {shouldRenderField('name') && (
          <div>
            <FieldHeader field="name" label="Nama Lengkap" htmlFor="booking-name" />
            <input
              id="booking-name"
              type="text"
              name="name"
              required={fieldSettings.name.visible && fieldSettings.name.required}
              className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
              placeholder="Nama Anda"
            />
            {fieldSettings.name.internalNote && isOwner && (
              <p className="text-xs text-zinc-500 mt-1">
                Catatan internal: {fieldSettings.name.internalNote}
              </p>
            )}
          </div>
        )}

        {/* Pilih Layanan */}
        {shouldRenderField('service') && (
          <div>
            <FieldHeader field="service" label="Pilih Layanan" htmlFor="booking-service" />
            <select
              id="booking-service"
              value={selectedService}
              onChange={(e) => setSelectedService(e.target.value)}
              required={fieldSettings.service.visible}
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
        )}

        {/* Nomor WhatsApp */}
        {shouldRenderField('phone') && (
          <div>
            <FieldHeader field="phone" label="Nomor WhatsApp" htmlFor="booking-phone" />
            <input
              id="booking-phone"
              type="tel"
              name="phone"
              required={fieldSettings.phone.visible}
              pattern="[0-9]{10,13}"
              className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
              placeholder="08xx xxxx xxxx"
            />
          </div>
        )}

        {/* Pilih Tanggal */}
        {shouldRenderField('date') && (
          <div>
            <FieldHeader field="date" label="Pilih Tanggal" htmlFor="booking-date" />
            <input
              id="booking-date"
              type="date"
              name="date"
              required={fieldSettings.date.visible}
              min={minDateInputValue}
              max={maxDateInputValue}
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setSelectedTime('');
                setTimeError(null);
              }}
              className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition`}
            />
            {fieldSettings.date.minLeadDays > 0 && (
              <p className="text-xs text-zinc-500 mt-1">
                Minimal {fieldSettings.date.minLeadDays} hari sebelum kedatangan.
              </p>
            )}
          </div>
        )}

        {/* Pilih Waktu */}
        {shouldRenderField('time') && (
          <div>
            <FieldHeader field="time" label="Pilih Waktu (08:00 - 22:00)" marginBottom="mb-3" />
            <input type="hidden" name="time" value={selectedTime} />
            {selectedDate ? (
              <>
                <div id="time-picker" className="grid grid-cols-4 gap-2 max-h-64 overflow-y-auto">
                  {availableTimes.map((time) => {
                    const isBooked = bookedTimes.includes(time);
                    const isSelected = selectedTime === time;
                    return (
                      <button
                        key={time}
                        type="button"
                        onClick={() => {
                          if (isBooked) return;
                          setSelectedTime(time);
                          setTimeError(null);
                        }}
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
                {timeError && (
                  <p className="mt-2 text-xs font-semibold text-red-600">{timeError}</p>
                )}
              </>
            ) : (
              <div className="p-4 border-2 border-dashed border-zinc-200 rounded-xl bg-zinc-50 text-sm text-zinc-600">
                Pilih tanggal terlebih dahulu untuk melihat slot waktu yang tersedia.
              </div>
            )}
          </div>
        )}

        {/* Catatan */}
        {shouldRenderField('notes') && (
          <div>
            <FieldHeader field="notes" label="Catatan (Opsional)" htmlFor="booking-notes" />
            <textarea
              id="booking-notes"
              name="notes"
              rows={3}
              className={`w-full px-4 py-2.5 rounded-xl border border-zinc-300 focus:border-${theme.accentColor}-500 focus:ring-2 focus:ring-${theme.accentColor}-200 outline-none transition resize-none`}
              placeholder="Tambahan informasi..."
            />
          </div>
        )}

        {/* Payment Method */}
        {shouldRenderField('payment') && (
          <div>
            <FieldHeader field="payment" label="Skema Pembayaran" />
            <PaymentMethodSelect
              value={paymentMethod}
              onChange={setPaymentMethod}
              theme={theme}
              business={business}
              enabledMethods={fieldSettings.payment.enabledMethods}
              transferDetails={{
                ...fieldSettings.payment.transferDetails,
                transferNote: fieldSettings.payment.transferNote,
              }}
              hideLabel
            />
          </div>
        )}

        {/* Payment Proof Upload */}
        {shouldRenderField('paymentProof') &&
          fieldSettings.payment.visible &&
          fieldSettings.payment.enabledMethods.transfer &&
          paymentMethod === 'transfer' && (
            <div>
              <FieldHeader field="paymentProof" label="Upload Bukti Transfer/DP" />
              <PaymentProofUpload
                file={paymentProof}
                previewUrl={previewUrl}
                onFileChange={(file, preview) => {
                  setPaymentProof(file);
                  setPreviewUrl(preview);
                }}
                theme={theme}
                required={fieldSettings.paymentProof.requireProof}
                hideLabel
              />
            </div>
          )}
        </div>

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

      {isOwner && activeField && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={closeSettingsModal}
        >
          <div
            className="w-full max-w-lg bg-white rounded-2xl shadow-2xl border border-zinc-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
              <div>
                <p className="text-xs font-semibold text-purple-600 uppercase">Pengaturan Field</p>
                <h3 className="text-lg font-bold text-zinc-900">{FIELD_LABELS[activeField]}</h3>
              </div>
              <button
                type="button"
                onClick={closeSettingsModal}
                className="p-2 rounded-full hover:bg-zinc-100 text-zinc-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="px-6 py-6 space-y-4">{renderSettingsContent()}</div>
          </div>
        </div>
      )}
    </>
  );
}
