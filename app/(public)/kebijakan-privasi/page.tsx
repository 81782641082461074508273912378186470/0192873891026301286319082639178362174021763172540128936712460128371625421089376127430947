import { NextPage } from 'next';

const PrivacyPolicy: NextPage = () => {
  return (
    <div className="flex flex-col items-start w-full py-24 max-w-screen-xl gap-10 text-white border-x-[1px] border-b-[1px] border-white/10">
      <div className="w-full justify-center flex">
        <h1 className="text-5xl font-bold mb-4 __gradient_text">Kebijakan Privasi Autolaku</h1>
      </div>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Informasi yang Kami Kumpulkan</h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Data Pengguna:</strong> Kami mengumpulkan nama, alamat email, informasi
            pembayaran, dan data lain yang diperlukan untuk pembuatan akun dan pemrosesan langganan.
          </li>
          <li>
            <strong>Data Penggunaan:</strong> Kami melacak bagaimana Anda menggunakan layanan kami,
            termasuk produk yang di-scrape, di-upload, dan statistik lainnya yang relevan dengan
            aktivitas dropshipping Anda.
          </li>
          <li>
            <strong>Data Perangkat:</strong> Informasi tentang perangkat yang Anda gunakan untuk
            mengakses layanan kami, seperti jenis perangkat, sistem operasi, dan data log.
          </li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Penggunaan Informasi</h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Menyediakan Layanan:</strong> Untuk memberikan, memelihara, dan meningkatkan
            layanan kami.
          </li>
          <li>
            <strong>Pemrosesan Pembayaran:</strong> Untuk memproses pembayaran langganan Anda.
          </li>
          <li>
            <strong>Komunikasi:</strong> Untuk mengirimkan informasi penting, pembaruan layanan,
            atau pemberitahuan terkait akun Anda.
          </li>
          <li>
            <strong>Analisis dan Statistik:</strong> Untuk memahami bagaimana layanan kami digunakan
            dan untuk meningkatkan pengalaman pengguna.
          </li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Keamanan Data</h2>
        <p>
          Kami mengimplementasikan langkah-langkah keamanan teknis dan organisasional untuk
          melindungi data Anda dari akses, penggunaan, atau pengungkapan yang tidak sah. Password
          dienkripsi menggunakan standar enkripsi modern.
        </p>
        <p>
          Meskipun demikian, tidak ada metode transmisi melalui internet atau metode penyimpanan
          elektronik yang 100% aman. Kami berusaha untuk menggunakan cara-cara yang diterima secara
          komersial untuk melindungi data Anda, namun kami tidak dapat menjamin keamanan mutlak.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Berbagi Informasi</h2>
        <p>
          Kami tidak menjual, memperdagangkan, atau mentransfer data pribadi Anda ke pihak luar
          tanpa persetujuan Anda, kecuali:
        </p>
        <ul className="list-disc pl-5">
          <li>Untuk memenuhi kewajiban hukum.</li>
          <li>
            Untuk melindungi hak, properti, atau keselamatan kami, pengguna kami, atau publik.
          </li>
          <li>
            Untuk pihak ketiga yang menyediakan layanan atas nama kami (misalnya, pemroses
            pembayaran), dengan kesepakatan bahwa mereka harus menjaga kerahasiaan informasi
            tersebut.
          </li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">
          Hak-hak Anda Terhadap Data Pribadi
        </h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Akses:</strong> Anda berhak untuk meminta salinan data pribadi yang kami miliki
            tentang Anda.
          </li>
          <li>
            <strong>Koreksi:</strong> Anda dapat meminta kami untuk memperbaiki data pribadi Anda
            jika ada kesalahan.
          </li>
          <li>
            <strong>Penghapusan:</strong> Anda dapat meminta kami untuk menghapus data pribadi Anda
            dari sistem kami, kecuali jika kami diwajibkan untuk menyimpannya untuk keperluan hukum
            atau kewajiban bisnis.
          </li>
        </ul>
        <p>
          Untuk menggunakan hak-hak ini, silakan hubungi kami melalui email yang tersedia di
          autolaku.com.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Retensi Data</h2>
        <p>
          Kami menyimpan data Anda selama diperlukan untuk tujuan yang dikumpulkan atau sebagaimana
          diwajibkan oleh hukum. Setelah tidak lagi diperlukan, data akan dihapus atau diAnonimkan.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Cookies dan Teknologi Pelacakan</h2>
        <p>
          Kami menggunakan cookies dan teknologi pelacakan serupa untuk mengumpulkan informasi
          tentang penggunaan situs web kami. Anda dapat mengatur preferensi cookie melalui
          pengaturan browser Anda, namun ini mungkin mempengaruhi fungsionalitas situs.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Perubahan pada Kebijakan Privasi</h2>
        <p>
          Kebijakan Privasi ini dapat diubah sewaktu-waktu untuk mencerminkan perubahan dalam
          praktik kami atau perubahan hukum. Perubahan akan diberitahukan melalui website kami atau
          email kepada pengguna terdaftar. Penggunaan layanan setelah pemberitahuan perubahan
          berarti Anda menerima perubahan tersebut.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-20 py-5 w-full text-white/70 font-light">
        <h2 className="text-xl font-semibold mb-2 text-white">Kontak</h2>
        <p>
          Untuk pertanyaan mengenai Kebijakan Privasi ini atau untuk menggunakan hak-hak Anda
          terkait dengan data pribadi, silakan hubungi kami melalui email yang tersedia di
          autolaku.com.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
