'use client';

import { useState } from 'react';

type Service = {
  id: string;
  name: string;
  duration: string;
  price: number;
  isActive: boolean;
};

export default function ServicesClient({ initialServices }: { initialServices: Service[] }) {
  const [services, setServices] = useState<Service[]>(initialServices);
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    duration: '',
    price: '',
  });

  const handleToggleActive = async (id: string) => {
    const service = services.find(s => s.id === id);
    if (!service) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !service.isActive }),
      });

      if (response.ok) {
        setServices(
          services.map((s) =>
            s.id === id ? { ...s, isActive: !s.isActive } : s
          )
        );
      }
    } catch (error) {
      console.error('Error toggling service:', error);
      alert('Gagal mengubah status layanan');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus layanan ini?')) return;

    try {
      const response = await fetch(`/api/services/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setServices(services.filter((service) => service.id !== id));
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      alert('Gagal menghapus layanan');
    }
  };

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          duration: formData.duration,
          price: parseFloat(formData.price),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setServices([...services, data.service]);
        setFormData({ name: '', duration: '', price: '' });
        setShowAddForm(false);
      } else {
        alert('Gagal menambahkan layanan');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      alert('Gagal menambahkan layanan');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-zinc-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Kelola Layanan</h1>
          <p className="text-zinc-600">Atur layanan yang ditawarkan bisnis Anda</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 border-2 border-zinc-200">
            <div className="text-2xl font-bold text-zinc-900">{services.length}</div>
            <div className="text-sm text-zinc-600">Total Layanan</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-zinc-200">
            <div className="text-2xl font-bold text-green-600">
              {services.filter((s) => s.isActive).length}
            </div>
            <div className="text-sm text-zinc-600">Aktif</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-zinc-200">
            <div className="text-2xl font-bold text-red-600">
              {services.filter((s) => !s.isActive).length}
            </div>
            <div className="text-sm text-zinc-600">Nonaktif</div>
          </div>
          <div className="bg-white rounded-xl p-4 border-2 border-zinc-200">
            <div className="text-2xl font-bold text-purple-600">
              {services.length > 0
                ? `Rp ${Math.min(...services.map((s) => s.price)).toLocaleString('id-ID')}`
                : '-'}
            </div>
            <div className="text-sm text-zinc-600">Harga Terendah</div>
          </div>
        </div>

        {/* Add Service Button */}
        <div className="mb-6">
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
            </svg>
            {showAddForm ? 'Tutup Form' : 'Tambah Layanan Baru'}
          </button>
        </div>

        {/* Add Service Form */}
        {showAddForm && (
          <div className="bg-white rounded-xl p-6 border-2 border-purple-200 mb-6">
            <h2 className="text-xl font-bold text-zinc-900 mb-4">Tambah Layanan Baru</h2>
            <form onSubmit={handleAddService} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-zinc-700 mb-2">
                  Nama Layanan <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                  placeholder="Contoh: Haircut Classic"
                />
              </div>

              {/* Duration and Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Duration */}
                <div>
                  <label htmlFor="duration" className="block text-sm font-semibold text-zinc-700 mb-2">
                    Durasi <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="duration"
                    name="duration"
                    required
                    value={formData.duration}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="Contoh: 30 menit"
                  />
                </div>

                {/* Price */}
                <div>
                  <label htmlFor="price" className="block text-sm font-semibold text-zinc-700 mb-2">
                    Harga (Rp) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    id="price"
                    name="price"
                    required
                    min="0"
                    step="1000"
                    value={formData.price}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border-2 border-zinc-300 rounded-xl focus:border-purple-500 focus:ring-4 focus:ring-purple-100 outline-none transition-all"
                    placeholder="50000"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 px-6 py-3 border-2 border-zinc-300 text-zinc-700 font-semibold rounded-xl hover:bg-zinc-50 transition-all"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Menyimpan...' : 'Simpan Layanan'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Services List */}
        <div className="space-y-4">
          {services.map((service) => (
            <div
              key={service.id}
              className={`bg-white rounded-xl p-6 border-2 transition-all ${
                service.isActive
                  ? 'border-zinc-200 hover:border-purple-300'
                  : 'border-zinc-100 opacity-60'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                {/* Service Info */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-bold text-zinc-900">{service.name}</h3>
                    {service.isActive ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold">
                        AKTIF
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold">
                        NONAKTIF
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2 text-zinc-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-2 font-bold text-purple-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                      Rp {service.price.toLocaleString('id-ID')}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  {/* Toggle Active */}
                  <button
                    onClick={() => handleToggleActive(service.id)}
                    className={`p-2 rounded-lg transition-all ${
                      service.isActive
                        ? 'bg-green-50 text-green-600 hover:bg-green-100'
                        : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
                    }`}
                    title={service.isActive ? 'Nonaktifkan' : 'Aktifkan'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>

                  {/* Edit */}
                  <button
                    className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-all"
                    title="Edit"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                    </svg>
                  </button>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-all"
                    title="Hapus"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {services.length === 0 && (
          <div className="bg-white rounded-xl p-12 border-2 border-zinc-200 text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path>
            </svg>
            <h3 className="text-lg font-bold text-zinc-900 mb-2">Belum ada layanan</h3>
            <p className="text-zinc-600 mb-4">Mulai tambahkan layanan pertama Anda</p>
            <button
              onClick={() => setShowAddForm(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
              </svg>
              Tambah Layanan
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
