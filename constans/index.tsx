import { MdFormatQuote } from 'react-icons/md';
import {
  IoMdDocument,
  IoMdHelpCircle,
  IoMdHome,
  IoMdInformationCircle,
  IoMdListBox,
  IoMdMail,
  IoMdPerson,
  IoMdPricetag,
} from 'react-icons/io';
import { BsShield } from 'react-icons/bs';
import { LiaFileContractSolid } from 'react-icons/lia';
import AIConfig from '@/assets/images/Screenshot-AI-Config.png';
import OptimasiInformasiProduk from '@/assets/images/Screenshot-AI-Optimasi-Informasi-Produk.png';
import ScreenshotAntrianScrape from '@/assets/images/Screenshot-Antrian-Scrape.png';
import AturKeuntungan from '@/assets/images/Screenshot-Atur-Keuntungan.png';
import HapusKataTerlarang from '@/assets/images/Screenshot-Hapus-Kata-Terlarang.png';
import KelolaProduk from '@/assets/images/Screenshot-Kelola-Produk.png';
import LoginAutolaku from '@/assets/images/Screenshot-Login-Autolaku.png';
import PencarianProduk from '@/assets/images/Screenshot-Pencarian-Produk.png';

export const navButtons = [
  {
    title: 'Beranda',
    url: '/',
    icon: <IoMdHome />,
    description: 'Kembali ke halaman utama',
  },
  {
    title: 'Tentang Kami',
    url: '/tentang-kami',
    icon: <IoMdInformationCircle />,
    description: 'Pelajari lebih lanjut tentang kami',
  },
  {
    title: 'Paket Harga',
    url: '/harga',
    icon: <IoMdPricetag />,
    description: 'Lihat berbagai paket harga kami',
  },
  {
    title: 'Fitur',
    url: '/fitur',
    icon: <IoMdListBox />,
    description: 'Jelajahi fitur-fitur yang kami tawarkan',
  },
  {
    title: 'Blog',
    url: '/blog',
    icon: <IoMdDocument />,
    description: 'Baca artikel terbaru dari kami',
  },
  {
    title: 'Pusat Bantuan',
    url: '/bantuan',
    icon: <IoMdHelpCircle />,
    description: 'Dapatkan bantuan dan dukungan',
  },
  {
    title: 'FAQ',
    url: '/faq',
    icon: <MdFormatQuote />,
    description: 'Temukan jawaban atas pertanyaan umum',
  },
  {
    title: 'Hubungi Kami',
    url: '/hubungi-kami',
    icon: <IoMdMail />,
    description: 'Kirim pesan atau hubungi kami',
  },

  {
    title: 'Kebijakan Privasi',
    url: '/kebijakan-privasi',
    icon: <BsShield />,
    description: 'Buat akun baru/Masuk dengan akun mu',
  },
  {
    title: 'Ketentuan Layanan',
    url: '/ketentuan-layanan',
    icon: <LiaFileContractSolid />,
    description: 'Buat akun baru/Masuk dengan akun mu',
  },
  {
    title: 'Masuk/Daftar',
    url: '/auth',
    icon: <IoMdPerson />,
    description: 'Buat akun baru/Masuk dengan akun mu',
  },
];

export const autolakuScreenshots = [
  {
    title: 'Halaman Masuk Autolaku',
    description: 'Akses cepat dan aman untuk memulai pengalaman dropshipping Anda.',
    image: LoginAutolaku,
  },
  {
    title: 'Pencarian Produk',
    description: 'Cari produk terbaik dengan fitur pencarian cerdas dan efisien.',
    image: PencarianProduk,
  },
  {
    title: 'Kelola Produk',
    description:
      'Kelola produk pilihan Anda secara sistematis untuk memudahkan akses ke koleksi produk terbaik dalam satu lokasi terpadu.',
    image: KelolaProduk,
  },
  {
    title: 'Antrian Scrape',
    description:
      'Menyusun folder secara terstruktur untuk memudahkan pengambilan detail data produk yang rapi dan mudah dipahami oleh manajemen.',
    image: ScreenshotAntrianScrape,
  },
  {
    title: 'Atur Keuntungan',
    description: 'Sesuaikan persentase margin keuntungan Anda dengan fleksibilitas penuh.',
    image: AturKeuntungan,
  },
  {
    title: 'Hapus Kata Terlarang',
    description:
      'Hapus kata-kata sensitif untuk memastikan listing produk aman dan sesuai dengan regulasi marketplace.',
    image: HapusKataTerlarang,
  },
  {
    title: 'Optimasi Informasi Produk',
    description:
      'Tingkatkan daya tarik produk Anda dengan informasi yang dioptimalkan oleh kecerdasan buatan (AI) hanya dalam satu klik.',
    image: OptimasiInformasiProduk,
  },
  {
    title: 'AI Config',
    description:
      'Sesuaikan pengaturan AI untuk meningkatkan performa dropshipping yang lebih cerdas dan personal, yang telah terintegrasi dengan xAI dan OpenAI.',
    image: AIConfig,
  },
];
