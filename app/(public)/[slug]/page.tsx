import { notFound } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getThemeByName } from '@/lib/themes';
import BookingForm from '@/components/booking/BookingForm';
import Image from 'next/image';
import AdminLayoutWrapper from '@/components/layout/AdminLayoutWrapper';

// Helper function to get border radius class
function getBorderRadiusClass(radius: 'sharp' | 'rounded' | 'soft'): string {
  switch (radius) {
    case 'sharp': return 'rounded-lg';
    case 'rounded': return 'rounded-xl';
    case 'soft': return 'rounded-2xl';
    default: return 'rounded-xl';
  }
}

// Helper function to get font weight class
function getFontWeightClass(weight: 'light' | 'normal' | 'semibold' | 'bold'): string {
  switch (weight) {
    case 'light': return 'font-light';
    case 'normal': return 'font-medium';
    case 'semibold': return 'font-semibold';
    case 'bold': return 'font-bold';
    default: return 'font-medium';
  }
}

export default async function BusinessProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Fetch business from database
  const business = await prisma.business.findUnique({
    where: { slug },
    include: {
      services: {
        where: { isActive: true },
        orderBy: { createdAt: 'asc' },
      },
    },
  });

  if (!business) {
    notFound();
  }

  // Transform database data to match component structure
  const businessData = {
    ...business,
    services: business.services.map(service => ({
      id: service.id,
      name: service.name,
      price: service.price,
      duration: service.duration,
    })),
    operatingHours: business.operatingHours as Record<string, { open: string; close: string; closed: boolean }> | null,
  };

  const theme = getThemeByName(business.theme);
  const borderRadius = getBorderRadiusClass(theme.borderRadius);
  const fontWeight = getFontWeightClass(theme.fontWeight);

  // Content component that will be wrapped
  const content = (
    <div className="bg-zinc-50 antialiased min-h-screen">
      {/* Hero Section */}
      <div className="relative">
        <div className={`bg-gradient-to-br ${theme.headerGradient} pb-32 pt-8`}>
          <div className="max-w-6xl mx-auto px-4 sm:px-6">
            {/* Top Bar */}
            <div className="flex justify-end items-center mb-8">
              <button className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white px-4 py-2 rounded-xl text-sm font-medium transition-all flex items-center gap-2 border border-white/20">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                Bagikan
              </button>
            </div>

            {/* Profile Header */}
            <div className="flex items-center gap-4 text-white">
              <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-md border-2 border-white/20 flex items-center justify-center shadow-2xl">
                <span className="text-3xl font-black text-white">
                  {businessData.name.charAt(0)}
                </span>
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-1">{businessData.name}</h1>
                <p className="text-white/80 text-sm flex items-center gap-1.5">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {businessData.address}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 -mt-20 pb-12">
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Main Content - Left Side */}
            <div className="lg:col-span-2 space-y-6">
              {/* About Card */}
              <div className={`bg-white ${borderRadius} shadow-sm border border-zinc-200 p-6`}>
                <h2 className={`text-lg ${fontWeight} text-zinc-900 mb-3`}>Tentang Kami</h2>
                <p className="text-zinc-600 leading-relaxed">{businessData.bio}</p>

                {/* Contact Quick Actions */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <a
                    href={`https://wa.me/${businessData.whatsapp || businessData.phone}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>
                    WhatsApp
                  </a>
                  <a
                    href={`tel:${businessData.phone}`}
                    className="flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-3 rounded-xl font-medium transition-all shadow-sm"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Telepon
                  </a>
                </div>
              </div>

              {/* Services */}
              <div className={`bg-white ${borderRadius} shadow-sm border border-zinc-200 p-6`}>
                <h2 className={`text-lg ${fontWeight} text-zinc-900 mb-4`}>Layanan Kami</h2>
                <div className="space-y-3">
                  {businessData.services.map((service) => (
                    <div
                      key={service.id}
                      className={`flex items-center justify-between p-4 rounded-xl border border-zinc-200 hover:border-${theme.accentColor}-300 hover:bg-${theme.accentColor}-50/30 transition-all group cursor-pointer`}
                    >
                      <div className="flex-1">
                        <h4 className="font-semibold text-zinc-900 mb-1">{service.name}</h4>
                        <p className="text-sm text-zinc-500 flex items-center gap-1.5">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          {service.duration}
                        </p>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-zinc-500 mb-0.5">Mulai dari</div>
                        <div className={`text-xl font-bold text-${theme.accentColor}-600`}>
                          Rp {service.price.toLocaleString('id-ID')}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Gallery */}
              {businessData.photos && businessData.photos.length > 0 && (
                <div className={`bg-white ${borderRadius} shadow-sm border border-zinc-200 p-6`}>
                  <h2 className={`text-lg ${fontWeight} text-zinc-900 mb-4`}>Galeri</h2>
                  <div className="grid grid-cols-3 gap-3">
                    {businessData.photos.map((photo, index) => (
                      <div key={index} className="aspect-square rounded-xl overflow-hidden bg-zinc-100 group cursor-pointer relative">
                        <Image
                          src={photo}
                          alt={`Gallery ${index + 1}`}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar - Right Side */}
            <div className="lg:col-span-1 space-y-6">
              {/* Booking Form */}
              <BookingForm business={businessData} theme={theme} />

              {/* Info Box */}
              <div className={`bg-gradient-to-br ${theme.infoBoxStyle.gradient} ${borderRadius} border border-${theme.infoBoxStyle.borderColor} p-6`}>
                <h3 className={`${fontWeight} text-zinc-900 mb-4 flex items-center gap-2`}>
                  <svg className={`w-5 h-5 text-${theme.infoBoxStyle.iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Jam Operasional
                </h3>
                <div className="space-y-2">
                  {businessData.operatingHours && Object.entries(businessData.operatingHours).map(([day, hours]) => {
                    const dayHours = hours as { open: string; close: string; closed: boolean };
                    const dayLabel = day.charAt(0).toUpperCase() + day.slice(1);
                    return (
                      <div key={day} className="flex justify-between text-sm">
                        <span className={`${fontWeight} text-zinc-700`}>{dayLabel}</span>
                        <span className="text-zinc-600">
                          {dayHours.closed ? 'Tutup' : `${dayHours.open} - ${dayHours.close}`}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contact Info */}
              <div className={`bg-white ${borderRadius} shadow-sm border border-zinc-200 p-6`}>
                <h3 className={`${fontWeight} text-zinc-900 mb-4`}>Hubungi Kami</h3>
                <div className="space-y-3">
                  {businessData.email && (
                    <a href={`mailto:${businessData.email}`} className={`flex items-center gap-3 text-sm text-zinc-600 hover:text-${theme.accentColor}-600 transition`}>
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <span>{businessData.email}</span>
                    </a>
                  )}
                  {businessData.instagram && (
                    <a
                      href={`https://instagram.com/${businessData.instagram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-3 text-sm text-zinc-600 hover:text-${theme.accentColor}-600 transition`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                        </svg>
                      </div>
                      <span>{businessData.instagram}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="text-center mt-12 pt-8 border-t border-zinc-200">
            <p className="text-sm text-zinc-500">
              Powered by{' '}
              <a href="/" className={`font-semibold text-${theme.accentColor}-600 hover:text-${theme.accentColor}-700 transition`}>
                Bookinaja
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  // Wrap with AdminLayoutWrapper if user is owner
  return (
    <AdminLayoutWrapper businessSlug={slug}>
      {content}
    </AdminLayoutWrapper>
  );
}
