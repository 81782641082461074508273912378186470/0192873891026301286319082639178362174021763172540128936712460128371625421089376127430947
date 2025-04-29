import { generateMetadata } from '@/lib/utils';
import { Metadata, NextPage } from 'next';

export const metadata: Metadata = generateMetadata({
  title: 'Syarat dan Ketentuan | Autolaku - Platform Dropshipping',
  description:
    'Pelajari syarat dan ketentuan penggunaan Autolaku, platform dropshipping terkemuka di Indonesia. Pahami hak dan tanggung jawab Anda sebagai pengguna.',
  url: 'https://autolaku.com/ketentuan-layanan',
  keywords:
    'Syarat dan Ketentuan Autolaku, Kebijakan Dropshipping, Lisensi Pengguna, Langganan Autolaku, Hak Kekayaan Intelektual',
});
const TermsOfService: NextPage = () => {
  return (
    <div className="flex flex-col items-start w-full py-24 max-w-screen-xl gap-10 text-white border-x-[1px] border-b-[1px] border-white/10">
      <div className="w-full justify-center flex">
        <h1 className="lg:text-5xl text-xl font-bold mb-4 __gradient_text">
          Syarat dan Ketentuan Autolaku
        </h1>
      </div>
      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Pendahuluan</h2>
        <p>
          Selamat datang di Autolaku, platform dropshipping yang dirancang khusus untuk
          memfasilitasi proses dropshipping di Indonesia dengan efisiensi dan kemudahan yang tak
          tertandingi. Dengan mengakses atau menggunakan layanan kami, Anda menyetujui untuk terikat
          oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan syarat-syarat ini, mohon
          untuk tidak menggunakan layanan kami.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Definisi</h2>
        <ul className="list-disc pl-5">
          <li>
            <strong>Layanan:</strong> Mengacu pada platform Autolaku termasuk aplikasi desktop dan
            website autolaku.com.
          </li>
          <li>
            <strong>Pengguna:</strong> Individu atau entitas yang menggunakan layanan kami dengan
            Kunci Lisensi.
          </li>
          <li>
            <strong>Admin:</strong> Pemilik bisnis dropshipping yang berlangganan untuk mengelola
            beberapa Kunci Lisensi.
          </li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Pendaftaran dan Akun</h2>
        <p>
          Untuk menggunakan layanan kami, Anda harus mendaftar dan membuat akun. Anda bertanggung
          jawab atas kerahasiaan informasi login Anda.
        </p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Kunci Lisensi:</strong> Pengguna individu menerima satu Kunci Lisensi yang hanya
            bisa digunakan pada satu perangkat. Lisensi ini tidak dapat dipindahkan atau dibagikan.
          </li>
          <li>
            <strong>Admin:</strong> Admin dapat membeli paket langganan yang memungkinkan mereka
            untuk mengelola beberapa Kunci Lisensi, memantau kinerja karyawan, dan mengatur akses
            aplikasi sesuai dengan batasan langganan yang dipilih.
          </li>
          <li>
            <strong>Pemilik (Owner):</strong> Hanya satu peran ini yang ada, dengan kontrol penuh
            atas platform, termasuk manajemen admin, lisensi, dan fitur lainnya.
          </li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Pembayaran dan Langganan</h2>
        <p>Layanan Autolaku tersedia melalui langganan bulanan dengan beberapa tingkatan:</p>
        <ul className="list-disc pl-5">
          <li>
            <strong>Starter:</strong> Pembelian Kunci Lisensi tunggal.
          </li>
          <li>
            <strong>Basic:</strong> Admin dengan limit kecil untuk membuat/mengelola Kunci Lisensi.
          </li>
          <li>
            <strong>Pro:</strong> Admin dengan limit lebih besar untuk memiliki Kunci Lisensi.
          </li>
          <li>
            <strong>Enterprise:</strong> Paket khusus yang dapat dinegosiasikan langsung dengan
            pemilik.
          </li>
        </ul>
        <p>
          Pembayaran harus dilakukan melalui metode yang tersedia di autolaku.com. Kami tidak
          menerima pembayaran tunai atau transfer langsung kecuali disetujui secara khusus.
        </p>
        <p>
          Langganan otomatis diperpanjang setiap bulan kecuali dibatalkan sebelum tanggal pembayaran
          berikutnya.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Kebijakan Pengembalian</h2>
        <p>
          Tidak ada pengembalian dana untuk langganan yang telah dibayar, kecuali dalam kasus
          kesalahan teknis dari pihak kami atau jika ada perjanjian khusus yang disepakati dengan
          pemilik.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">6. Hak Kekayaan Intelektual</h2>
        <p>
          Semua hak kekayaan intelektual terkait dengan Autolaku, termasuk tetapi tidak terbatas
          pada perangkat lunak, desain, logo, teks, grafik, dan konten lainnya, adalah milik kami
          atau pemberi lisensi kami. Anda setuju untuk tidak mereproduksi, mendistribusikan, atau
          membuat karya turunan dari material ini tanpa izin tertulis dari kami.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Pembatasan Penggunaan</h2>
        <p>Anda tidak diperbolehkan untuk:</p>
        <ul className="list-disc pl-5">
          <li>Menggunakan layanan kami untuk tujuan ilegal atau melanggar hak pihak ketiga.</li>
          <li>Mencoba mengakses bagian dari layanan yang tidak diizinkan untuk Anda.</li>
          <li>Mengganggu atau mencoba mengganggu operasi layanan kami.</li>
        </ul>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Tanggung Jawab</h2>
        <p>
          Kami tidak bertanggung jawab atas kerugian langsung, tidak langsung, insidental, khusus,
          atau konsekuensial yang timbul dari penggunaan atau ketidakmampuan untuk menggunakan
          layanan kami, kecuali jika diwajibkan oleh hukum.
        </p>
        <p>
          Anda setuju untuk membebaskan kami dari segala tuntutan yang mungkin timbul dari
          pelanggaran Syarat dan Ketentuan ini oleh Anda.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">
          9. Perubahan pada Syarat dan Ketentuan
        </h2>
        <p>
          Kami berhak untuk mengubah Syarat dan Ketentuan ini kapan saja. Perubahan akan
          diberitahukan melalui website kami atau email kepada pengguna terdaftar. Penggunaan
          layanan setelah pemberitahuan perubahan berarti Anda menerima perubahan tersebut.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Penutupan Akun</h2>
        <p>
          Kami berhak untuk menutup akun Anda jika kami menemukan pelanggaran terhadap Syarat dan
          Ketentuan ini atau jika kami menentukan bahwa tindakan tersebut diperlukan untuk
          melindungi kepentingan kami atau pengguna lain.
        </p>
      </section>

      <section className="border-white/10 border-y-[1px] px-10 py-5 w-full text-white/70 font-light bg-gradient-to-bl from-white/10 from-5% via-transparent via-70% to-transparent to-100%">
        <h2 className="text-xl font-semibold mb-2 text-white">Kontak</h2>
        <p>
          Untuk pertanyaan atau masalah terkait dengan Syarat dan Ketentuan ini, hubungi kami
          melalui email yang tersedia di autolaku.com.
        </p>
      </section>
    </div>
  );
};

export default TermsOfService;
