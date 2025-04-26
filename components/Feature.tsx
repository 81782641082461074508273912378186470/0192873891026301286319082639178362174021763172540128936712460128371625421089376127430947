/* eslint-disable @typescript-eslint/no-unused-vars */
import { LuScanSearch } from 'react-icons/lu';
import { HiMiniRectangleStack } from 'react-icons/hi2';
import { TbDatabaseShare } from 'react-icons/tb';
import { PiChartLineUpBold } from 'react-icons/pi';
import { LuBrainCircuit } from 'react-icons/lu';
import { MdFileUpload } from 'react-icons/md';
import React from 'react';
import { FeatureCard } from './FeaturedCard';

const Feature = () => {
  const stepByStep = [
    {
      icon: <LuScanSearch />,
      title: 'Temukan Produk Menguntungkan',
      description:
        'Gunakan alat pencarian Autolaku untuk menemukan produk potensial. Terapkan filter seperti peringkat, tipe penjual, dan rentang harga untuk menentukan produk yang sesuai dengan strategi bisnis dan kebutuhan pasar Anda.',
    },
    {
      icon: <HiMiniRectangleStack />,
      title: 'Susun Inventaris Anda',
      description:
        'Pilih produk untuk di-scrape dan atur ke dalam folder. Evaluasi setiap item berdasarkan permintaan, persaingan, dan profitabilitas untuk membangun inventaris yang kuat dan sesuai dengan toko Anda.',
    },
    {
      icon: <TbDatabaseShare />,
      title: 'Otomatisasi Pengumpulan Data',
      description:
        'Scrape semua produk dalam folder menggunakan teknologi Autolaku. Kumpulkan detail penting seperti deskripsi, gambar, dan harga dari berbagai sumber secara otomatis dengan mudah.',
    },
    {
      icon: <PiChartLineUpBold />,
      title: 'Optimalkan untuk Profitabilitas',
      description:
        'Ubah data produk, termasuk dimensi, kategori, dan harga, untuk meningkatkan margin keuntungan. Hapus kata-kata terlarang untuk memastikan kepatuhan terhadap standar marketplace.',
    },
    {
      icon: <LuBrainCircuit />,
      title: 'Optimasi Berbasis AI',
      description:
        'Tingkatkan informasi produk dengan alat AI Autolaku. Optimalkan judul, deskripsi, dan gambar untuk visibilitas dan daya tarik maksimal guna mendorong hasil yang lebih baik di marketplace.',
    },
    {
      icon: <MdFileUpload />,
      title: 'Publikasikan Produk Anda',
      description:
        'Unggah listing yang telah diselesaikan ke marketplace. Autolaku menyederhanakan proses upload, memastikan produk Anda siap dan tersedia untuk pelanggan dengan efisien.',
    },
  ];
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col lg:items-start justify-start text-center  text-white z-10 pt-24 px-5 2xl:px-0 lg:mt-40">
      <div className="space-y-8 mb-10">
        <div>
          <div className="tracking-widest text-neutral-600 flex items-center gap-2 text-sm">
            <span>[</span> <span>Fitur Autolaku</span> <span>]</span>
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-xl space-y-12">
            <h2 className="text-balance tracking-tight text-3xl __gradient_text">
              Dropship Mudah, Cepat, Efisien, dan Pintar
            </h2>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-dark-800">
        {stepByStep.map((feature, i) => (
          <FeatureCard
            key={i}
            icon={feature.icon}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>
    </div>
  );
};

export default Feature;
