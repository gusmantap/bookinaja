import TeamChatMessage from './TeamChatMessage';
import TeamChatThread from './TeamChatThread';
import ChatToSolutionTransition from './ChatToSolutionTransition';

export default function ProblemSection3() {
  return (
    <section className="py-12 bg-zinc-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Description */}
          <div className="space-y-6">
            <div className="inline-flex px-3 py-1 rounded-full bg-red-50 border border-red-200">
              <span className="text-sm font-medium text-red-700">Masalah #3</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Dua Pelanggan <span className="text-red-600">Pesan Jam Sama</span>
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Ribet banget kalau ada 2 orang pesan jam yang sama. Harus telepon satu-satu, minta maaf, cari jam pengganti.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Cek Otomatis Sebelum Pesan</h4>
                  <p className="text-sm text-zinc-600">Sistem langsung cek jadwal yang masih kosong. Jam yang sudah penuh tidak bisa dipilih</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Tidak Mungkin Bentrok</h4>
                  <p className="text-sm text-zinc-600">Pelanggan hanya bisa pilih jam yang benar-benar kosong. Jadi tidak ada kejadian bentrok</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="space-y-0">
            {/* PROBLEM: Team Chat showing conflict with customer */}
            <TeamChatThread channelName="pelanggan-komplain" channelIcon="📞" variant="problem">
              <TeamChatMessage
                author="Ibu Ani"
                avatar="A"
                avatarColor="bg-purple-500"
                message="Saya booking besok jam 10 ya"
                timestamp="14:31"
              />
              <TeamChatMessage
                author="Ibu Siti"
                avatar="S"
                avatarColor="bg-orange-500"
                message="Saya juga mau booking jam 10 besok"
                timestamp="16:00"
              />
              <div className="my-1.5 border-t-2 border-red-300"></div>
              <TeamChatMessage
                author="Owner"
                avatar="O"
                avatarColor="bg-red-500"
                message="Ya ampun... jam 10 sudah double booking! 😱 Harus telepon dan minta maaf..."
                timestamp="20:00"
                isHighlight
              />
            </TeamChatThread>

            {/* Transition */}
            <ChatToSolutionTransition />

            {/* SOLUTION: Auto-check booking form UI */}
            <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
              <h3 className="font-semibold text-zinc-900 mb-4">Form Booking Pelanggan</h3>

              <div className="space-y-3 mb-4">
                <div className="p-3 rounded-lg border-2 border-zinc-200 bg-white opacity-50 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-400">09:00 - 10:00</p>
                      <p className="text-xs text-zinc-400">Sudah dipesan: Ibu Siti</p>
                    </div>
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-zinc-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-zinc-600 bg-white px-2 py-1 rounded">Tidak Bisa Dipilih</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border-2 border-green-500 bg-green-50 cursor-pointer hover:bg-green-100 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">10:00 - 11:00</p>
                      <p className="text-xs text-green-700">✓ Tersedia</p>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg border-2 border-zinc-200 bg-white opacity-50 relative">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-400">11:00 - 12:00</p>
                      <p className="text-xs text-zinc-400">Sudah dipesan: Pak Budi</p>
                    </div>
                    <svg className="w-5 h-5 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div className="absolute inset-0 bg-zinc-100 bg-opacity-50 rounded-lg flex items-center justify-center">
                    <span className="text-xs font-semibold text-zinc-600 bg-white px-2 py-1 rounded">Tidak Bisa Dipilih</span>
                  </div>
                </div>

                <div className="p-3 rounded-lg border-2 border-zinc-200 bg-white hover:border-blue-300 hover:bg-blue-50 cursor-pointer transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-900">13:00 - 14:00</p>
                      <p className="text-xs text-blue-700">✓ Tersedia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-medium text-green-900">Tidak mungkin bentrok!</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
