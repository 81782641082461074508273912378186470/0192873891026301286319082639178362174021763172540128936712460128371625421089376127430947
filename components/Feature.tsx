/* eslint-disable @typescript-eslint/no-unused-vars */
import { LuScanSearch } from 'react-icons/lu';
import { PiChartLineUpBold } from 'react-icons/pi';
import { IoFileTrayStackedOutline } from 'react-icons/io5';
import { IoFlashOutline } from 'react-icons/io5';
import { RiFolderUploadLine } from 'react-icons/ri';
import { RiRobot2Line } from 'react-icons/ri';
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
      icon: <IoFileTrayStackedOutline />,
      title: 'Susun Inventaris Anda',
      description:
        'Pilih produk untuk di-scrape dan atur ke dalam folder. Evaluasi setiap item berdasarkan permintaan, persaingan, dan profitabilitas untuk membangun inventaris yang kuat dan sesuai dengan toko Anda.',
    },
    {
      icon: <IoFlashOutline />,
      title: 'Otomatisasi Pengumpulan Data (Scraping)',
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
      icon: <RiRobot2Line />,
      title: 'Optimasi Berbasis AI',
      description:
        'Tingkatkan informasi produk dengan alat AI Autolaku. Optimalkan judul, deskripsi, dan gambar untuk visibilitas dan daya tarik maksimal guna mendorong hasil yang lebih baik di marketplace.',
    },
    {
      icon: <RiFolderUploadLine />,
      title: 'Publikasikan Produk Anda',
      description:
        'Unggah listing yang telah diselesaikan ke marketplace. Autolaku menyederhanakan proses upload, memastikan produk Anda siap dan tersedia untuk pelanggan dengan efisien.',
    },
  ];
  return (
    <div className="max-w-screen-xl mx-auto flex flex-col lg:items-start justify-start text-center  text-white z-10 py-24 px-5 2xl:px-0 lg:my-40">
      <div className="space-y-8 mb-10">
        <div>
          <div className="tracking-widest text-neutral-600 flex items-center gap-2 text-sm">
            <span>[</span> <span>Fitur Autolaku</span> <span>]</span>
          </div>
        </div>
        <h2 className="whitespace-nowrap tracking-tight w-fit text-3xl __gradient_text font-bold">
          Dropship Mudah, Cepat, Efisien, dan Pintar
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[1px] bg-dark-800">
        {stepByStep.map((feature, i) => (
          <FeatureCard
            key={i}
            stepNumber={i + 1}
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
