export default function ProblemSection2() {
  return (
    <section className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          <div className="relative lg:order-1 order-2">
            <div className="border border-zinc-200 rounded-xl p-6 shadow-sm bg-white">
              <div className="space-y-4">
                <div className="p-4 rounded-lg bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-sm font-semibold text-blue-700">M</span>
                    </div>
                    <div>
                      <p className="font-semibold text-zinc-900">Ibu Maya</p>
                      <p className="text-sm text-zinc-600">Besok, 10:00</p>
                    </div>
                  </div>
                  <div className="px-3 py-2 rounded bg-yellow-100 border border-yellow-300">
                    <p className="text-xs font-medium text-yellow-900">Pesanan baru masuk</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
                  <span className="text-xs font-medium text-zinc-500">8 jam kemudian</span>
                  <div className="flex-1 border-t-2 border-dashed border-zinc-300"></div>
                </div>

                <div className="p-4 rounded-lg bg-green-50 border border-green-300">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500 flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-900 mb-2">Pengingat Otomatis Terkirim</p>
                      <div className="bg-white rounded-lg p-3 border border-green-200">
                        <p className="text-xs text-zinc-700 mb-1">Halo Ibu Maya! 👋</p>
                        <p className="text-xs text-zinc-700 mb-1">Pengingat: Anda memiliki jadwal besok pukul 10:00.</p>
                        <p className="text-xs text-zinc-500">Terima kasih!</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-sm font-medium text-blue-900">Pelanggan tidak lupa datang</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:order-2 order-1">
            <div className="inline-flex px-3 py-1 rounded-full bg-green-50 border border-green-200">
              <span className="text-sm font-medium text-green-700">Masalah #2</span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-bold text-zinc-900 leading-tight">
              Pelanggan <span className="text-green-600">Sering Lupa</span> Datang
            </h2>
            <p className="text-lg text-zinc-600 leading-relaxed">
              Sudah booking tapi lupa datang. Jadwal kosong sia-sia, padahal bisa diisi pelanggan lain.
            </p>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Pengingat Lewat WhatsApp</h4>
                  <p className="text-sm text-zinc-600">Pelanggan dapat pesan otomatis di WhatsApp beberapa jam sebelum jadwal mereka</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-1">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-zinc-900 mb-1">Atur Sendiri Waktunya</h4>
                  <p className="text-sm text-zinc-600">Mau kirim 2 jam sebelum atau 1 hari sebelum? Bisa diatur sesuai kebutuhan bisnis Anda</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
