'use client';

import { Business, Theme } from '@/types';

interface PaymentMethodSelectProps {
  value: 'onsite' | 'transfer';
  onChange: (value: 'onsite' | 'transfer') => void;
  theme: Theme;
  business: Business;
}

export default function PaymentMethodSelect({
  value,
  onChange,
  theme,
  business,
}: PaymentMethodSelectProps) {
  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 mb-3">
        Skema Pembayaran
      </label>
      <div className="space-y-3">
        {/* Bayar di Lokasi */}
        <div>
          <input
            type="radio"
            id="payment_onsite"
            name="payment_method"
            value="onsite"
            checked={value === 'onsite'}
            onChange={() => onChange('onsite')}
            className="peer hidden"
          />
          <label
            htmlFor="payment_onsite"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 peer-checked:border-${theme.accentColor}-500 peer-checked:bg-${theme.accentColor}-50 cursor-pointer transition-all`}
          >
            <div className={`w-10 h-10 bg-${theme.accentColor}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 text-${theme.accentColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-zinc-900">Bayar di Lokasi</div>
              <div className="text-xs text-zinc-500">Pembayaran langsung saat layanan</div>
            </div>
          </label>
        </div>

        {/* Transfer Bank */}
        <div>
          <input
            type="radio"
            id="payment_transfer"
            name="payment_method"
            value="transfer"
            checked={value === 'transfer'}
            onChange={() => onChange('transfer')}
            className="peer hidden"
          />
          <label
            htmlFor="payment_transfer"
            className={`flex items-center gap-3 p-4 rounded-xl border-2 border-zinc-200 peer-checked:border-${theme.accentColor}-500 peer-checked:bg-${theme.accentColor}-50 cursor-pointer transition-all`}
          >
            <div className={`w-10 h-10 bg-${theme.accentColor}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
              <svg className={`w-5 h-5 text-${theme.accentColor}-600`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="font-semibold text-zinc-900">Transfer Bank</div>
              <div className="text-xs text-zinc-500">Bayar DP/Lunas via transfer</div>
            </div>
          </label>
        </div>
      </div>

      {/* Bank Account Info (shown when transfer is selected) */}
      {value === 'transfer' && (
        <div className="mt-4">
          <div className="p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-blue-900 mb-1">Nomor Rekening</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-blue-800">
                    <span className="font-semibold">Bank:</span> {business.bankName || 'Bank BCA'}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-semibold">No. Rekening:</span> {business.accountNumber || '1234567890'}
                  </p>
                  <p className="text-blue-800">
                    <span className="font-semibold">Atas Nama:</span> {business.accountName || business.name}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-blue-700 bg-blue-100 px-3 py-2 rounded-lg">
              <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Silakan transfer minimal DP 50% dari total biaya</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
