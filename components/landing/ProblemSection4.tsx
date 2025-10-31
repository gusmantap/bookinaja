import TeamChatMessage from './TeamChatMessage';
import TeamChatThread from './TeamChatThread';
import ChatToSolutionTransition from './ChatToSolutionTransition';

export default function ProblemSection4() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Visual Demo */}
          <div className="relative lg:order-1 order-2 space-y-0">
            {/* PROBLEM: Team Chat showing staff panic */}
            <TeamChatThread channelName="tim-kerja" channelIcon="⚠️" variant="problem">
              <TeamChatMessage
                author="Manager"
                avatar="M"
                avatarColor="bg-blue-600"
                message="@Lia Ibu Siti datang 5 menit lagi, udah siap?"
                timestamp="09:55"
              />
              <TeamChatMessage
                author="Lia"
                avatar="L"
                avatarColor="bg-purple-500"
                message="Ya ampun lupa! Belum siap sama sekali... 😰"
                timestamp="09:56"
                isHighlight
              />
              <TeamChatMessage
                author="Manager"
                avatar="M"
                avatarColor="bg-blue-600"
                message="Cepet siapin! Pelanggan bisa kecewa nih 😓"
                timestamp="09:57"
                isHighlight
              />
            </TeamChatThread>

            {/* Transition */}
            <ChatToSolutionTransition />

            {/* SOLUTION: Dashboard with notifications */}
            <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-200">
                <h3 className="font-semibold text-zinc-900">Dashboard Staf</h3>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-zinc-600">Live</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-400">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-yellow-400 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-yellow-900 mb-1">Pesanan Berikutnya!</p>
                      <p className="text-sm text-yellow-800 mb-2">Ibu Siti - 10 menit lagi (10:00)</p>
                      <p className="text-xs text-yellow-700">Catatan: Alergi parfum</p>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Pak Budi</p>
                      <p className="text-xs text-zinc-500">11:00 - 1 jam lagi</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-xs">Siap</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Ibu Ani</p>
                      <p className="text-xs text-zinc-500">13:00 - 3 jam lagi</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-xs">Siap</div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border border-zinc-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">Pak Joko</p>
                      <p className="text-xs text-zinc-500">15:00 - 5 jam lagi</p>
                    </div>
                    <div className="px-2 py-1 rounded bg-zinc-100 text-zinc-700 text-xs">Siap</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-900">Semua jadwal terpantau</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Description */}
          <div className="space-y-6 lg:order-2 order-1">
            <div className="inline-flex px-3 py-1 rounded-full bg-purple-50 border border-purple-200">
              <span className="text-sm font-medium text-purple-700">Masalah #4</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Staf <span className="text-purple-600">Lupa</span> Ada Jadwal
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Sibuk melayani pelanggan, lupa cek jadwal berikutnya. Tiba-tiba pelanggan sudah datang tapi belum siap.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Notifikasi Otomatis ke Staf</h4>
                  <p className="text-sm text-zinc-600">Staf dapat peringatan otomatis sebelum jadwal berikutnya. Tidak mungkin kelupaan</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Dashboard Real-time</h4>
                  <p className="text-sm text-zinc-600">Lihat semua jadwal hari ini dalam satu layar. Jadwal berikutnya ditampilkan paling atas</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
