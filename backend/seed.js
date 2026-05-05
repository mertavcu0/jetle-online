const Listing = require("./models/Listing");
const User = require("./models/User");

const demoListings = [
  {
    title: "BMW 3.20d M Sport, bakımlı",
    price: 1450000,
    city: "İstanbul",
    category: "Otomobil",
    description: "Yetkili servis bakımlı, hatasız ve günlük kullanıma hazır temiz aile aracı.",
    image: "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Mercedes C180 AMG paket",
    price: 1725000,
    city: "Ankara",
    category: "Otomobil",
    description: "Düşük kilometre, ekspertiz raporlu, iç dış kondisyonu çok iyi.",
    image: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Volkswagen Golf 1.5 TSI",
    price: 985000,
    city: "İzmir",
    category: "Otomobil",
    description: "Otomatik vites, ekonomik yakıt tüketimi, şehir içi kullanım için ideal.",
    image: "https://images.unsplash.com/photo-1549924231-f129b911e442?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Audi A3 Sportback",
    price: 1180000,
    city: "Bursa",
    category: "Otomobil",
    description: "Sportback kasa, temiz iç mekan, lastikler yeni değişti.",
    image: "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Toyota Corolla Hybrid",
    price: 1060000,
    city: "Antalya",
    category: "Otomobil",
    description: "Hybrid motor, düşük yakıt tüketimi ve sorunsuz kullanım.",
    image: "https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Renault Megane Icon",
    price: 820000,
    city: "Konya",
    category: "Otomobil",
    description: "Aile kullanımı için uygun, bakımları zamanında yapılmıştır.",
    image: "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Kadıköy'de deniz manzaralı 2+1",
    price: 6250000,
    city: "İstanbul",
    category: "Emlak",
    description: "Merkezi konumda, metroya yakın, aydınlık ve ferah daire.",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Çankaya'da site içinde 3+1",
    price: 4850000,
    city: "Ankara",
    category: "Emlak",
    description: "Kapalı otoparklı, güvenlikli, aile yaşamına uygun geniş daire.",
    image: "https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bornova'da eşyalı kiralık 1+1",
    price: 22000,
    city: "İzmir",
    category: "Emlak",
    description: "Üniversiteye yakın, temiz eşyalı, hızlı taşınmaya hazır.",
    image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Bursa Nilüfer'de bahçeli villa",
    price: 11250000,
    city: "Bursa",
    category: "Emlak",
    description: "Sessiz sokakta, geniş bahçeli, modern mutfaklı villa.",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Antalya Lara'da yazlık daire",
    price: 3650000,
    city: "Antalya",
    category: "Emlak",
    description: "Sahile yakın, bakımlı bina, yatırım ve yaşam için uygun.",
    image: "https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Konya Meram'da müstakil ev",
    price: 3900000,
    city: "Konya",
    category: "Emlak",
    description: "Bahçeli, sakin mahallede, aile kullanımına uygun müstakil ev.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "iPhone 15 Pro Max 256 GB",
    price: 68500,
    city: "İstanbul",
    category: "Elektronik",
    description: "Kutulu, garantili, pil sağlığı yüksek ve kozmetik durumu temiz.",
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "MacBook Pro M2 14 inç",
    price: 72000,
    city: "Ankara",
    category: "Elektronik",
    description: "Grafik ve yazılım işleri için güçlü, temiz kullanılmış cihaz.",
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Samsung OLED 55 inç TV",
    price: 38500,
    city: "İzmir",
    category: "Elektronik",
    description: "Akıllı TV, canlı renkler, duvar aparatı ile teslim edilebilir.",
    image: "https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "PlayStation 5 çift kollu set",
    price: 24500,
    city: "Bursa",
    category: "Elektronik",
    description: "Temiz kullanılmış, iki kol ve popüler oyunlarla beraber.",
    image: "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Canon EOS R10 lens kit",
    price: 41500,
    city: "Antalya",
    category: "Elektronik",
    description: "Vlog ve fotoğraf için ideal, az kullanılmış aynasız kamera.",
    image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Gaming PC RTX 4070 sistem",
    price: 63500,
    city: "Konya",
    category: "Elektronik",
    description: "Yeni nesil oyunlar ve yayın için güçlü masaüstü bilgisayar.",
    image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Şişli'de ofis kullanıma hazır",
    price: 7800000,
    city: "İstanbul",
    category: "Emlak",
    description: "Plaza içinde, toplantı odalı, merkezi konumda hazır ofis.",
    image: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=900&q=80",
  },
  {
    title: "Honda Civic Executive Plus",
    price: 1260000,
    city: "Adana",
    category: "Otomobil",
    description: "Benzin otomatik, geniş bagaj, aile kullanımına uygun.",
    image: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?auto=format&fit=crop&w=900&q=80",
  },
];

async function seedListingsIfEmpty() {
  const count = await Listing.countDocuments();
  if (count >= 20) return;

  let demoUser = await User.findOne({ email: "demo@jetle.online" });
  if (!demoUser) {
    demoUser = await User.create({
      username: "Jetle Demo",
      email: "demo@jetle.online",
      password: "demo1234",
    });
  }

  const now = Date.now();
  const needed = Math.max(0, 20 - count);
  const listings = demoListings.slice(0, needed).map((listing, index) => ({
    ...listing,
    images: [listing.image],
    createdBy: demoUser._id,
    createdAt: new Date(now - index * 60 * 60 * 1000),
  }));

  if (!listings.length) return;
  await Listing.insertMany(listings);
  console.log(`Seed tamamlandı: ${listings.length} ilan eklendi.`);
}

module.exports = seedListingsIfEmpty;
