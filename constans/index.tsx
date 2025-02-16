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
