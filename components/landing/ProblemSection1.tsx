import TeamChatMessage from './TeamChatMessage';
import TeamChatThread from './TeamChatThread';
import ChatToSolutionTransition from './ChatToSolutionTransition';

export default function ProblemSection1() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Left: Description */}
          <div className="space-y-6">
            <div className="inline-flex px-3 py-1 rounded-full bg-blue-50 border border-blue-200">
              <span className="text-sm font-medium text-blue-700">Masalah #1</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Informasi <span className="text-blue-600">Hilang</span> Saat Ganti Jaga
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Staf pengganti sering tidak tahu ada pesanan apa saja. Harus tanya sana-sini, kadang informasi ketinggalan atau salah.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Semua Tersimpan Terpusat</h4>
                  <p className="text-sm text-zinc-600">Semua catatan pesanan ada di satu tempat yang bisa diakses semua staf kapan saja</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Tidak Perlu Serah Terima Manual</h4>
                  <p className="text-sm text-zinc-600">Staf pengganti langsung lihat sendiri, tidak perlu tunggu dijelasin</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Visual Demo */}
          <div className="space-y-0">
            {/* PROBLEM: Team Chat showing confusion */}
            <TeamChatThread channelName="tim-salon" variant="problem">
              <TeamChatMessage
                author="Dini (Shift Sore)"
                avatar="D"
                avatarColor="bg-purple-500"
                message="Ada pesanan apa aja sore ini? Yang mana yang alergi parfum?"
                timestamp="15:02"
              />
              <TeamChatMessage
                author="Rina (Shift Pagi)"
                avatar="R"
                avatarColor="bg-blue-500"
                message="Aduh lupa catat detail... coba cek buku catatan deh 😓"
                timestamp="15:05"
                isHighlight
              />
              <TeamChatMessage
                author="Dini (Shift Sore)"
                avatar="D"
                avatarColor="bg-purple-500"
                message="Buku catatannya gak ketemu... gimana nih? 😰"
                timestamp="15:08"
                isHighlight
              />
            </TeamChatThread>

            {/* Transition */}
            <ChatToSolutionTransition />

            {/* SOLUTION: Centralized system UI */}
            <div className="border border-zinc-200 rounded-xl p-4 shadow-sm bg-white">
              <div className="flex items-center justify-between mb-3 pb-3 border-b border-zinc-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-blue-700">A</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-zinc-900">Staf Jaga Pagi</p>
                    <p className="text-xs text-zinc-500">07:00 - 15:00</p>
                  </div>
                </div>
                <div className="px-2 py-1 rounded bg-green-100 text-green-700 text-xs font-medium">Aktif</div>
              </div>

              <div className="space-y-2 mb-3">
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-zinc-900 mb-0.5">Ibu Siti - 09:00</p>
                  <p className="text-xs text-zinc-600">Alergi parfum</p>
                </div>
                <div className="p-2.5 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-sm font-medium text-zinc-900 mb-0.5">Pak Budi - 11:00</p>
                  <p className="text-xs text-zinc-600">Pelanggan VIP</p>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
                <span className="text-xs font-medium text-zinc-500">Ganti Jaga 15:00</span>
                <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
              </div>

              <div className="p-2.5 rounded-lg bg-green-50 border border-green-200">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-sm font-semibold text-green-900">Staf pengganti langsung tahu semua info</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
