import React from 'react';

const page = () => {
  return (
    <div className="bg-black w-screen h-screen flex flex-col justify-center items-center z-[999999] text-white top-0 left-0 fixed">
      <div className="max-w-lg p-10">
        <h2 className="text-xl mb-3">
          Website Sedang Dalam Proses Maintenance
        </h2>
        <p className="text-light-600">
          Terima kasih atas kunjungan Anda ke Autolaku! Saat ini, kami sedang
          melakukan proses maintenance untuk memastikan platform kami siap
          memberikan layanan terbaik yang cepat, aman, dan efisien. Kami
          berkomitmen untuk memberikan pengalaman terbaik bagi Anda. Mohon
          bersabar, kami akan segera kembali. Terima kasih atas pengertian Anda!
        </p>
      </div>
    </div>
  );
};

export default page;
