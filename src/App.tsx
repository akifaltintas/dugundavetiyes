/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Heart, 
  ChevronDown, 
  ExternalLink,
  Music
} from 'lucide-react';

// --- Constants ---
const WEDDING_DATE = new Date('2026-04-25T19:00:00');
const KINA_DATE = new Date('2026-04-22T19:30:00');

const EVENTS = [
  {
    id: 'kina',
    title: 'Kına Gecesi',
    date: '22 Nisan 2026 Çarşamba',
    time: '19:30',
    location: 'Hacı Evhaddin Çok Amaçlı Salon',
    address: 'Yedikule Mahallesi, Hacı Evhaddin Caddesi No: 76, Fatih/İstanbul',
    mapsUrl: 'https://maps.app.goo.gl/bAD1g5vdEsdQRkgo8',
    icon: <Music className="w-5 h-5" />,
    color: 'bg-rose-50'
  },
  {
    id: 'dugun',
    title: 'Düğün Töreni',
    date: '25 Nisan 2026 Cumartesi',
    time: '19:00',
    location: 'Neslişah Sultan Kültür Merkezi',
    address: 'Karagümrük, Kaleboyu Cd. No:107, Fatih/İstanbul',
    mapsUrl: 'https://maps.app.goo.gl/7aaVEwM2VeYhuzXz8',
    icon: <Heart className="w-5 h-5" />,
    color: 'bg-purple-50'
  }
];

// --- Components ---

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = WEDDING_DATE.getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        return;
      }

      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((distance % (1000 * 60)) / 1000)
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const units = [
    { label: 'GÜN', value: timeLeft.days },
    { label: 'SAAT', value: timeLeft.hours },
    { label: 'DAKİKA', value: timeLeft.minutes },
    { label: 'SANİYE', value: timeLeft.seconds }
  ];

  return (
    <div className="flex flex-col items-center max-w-md mx-auto">
      <div className="flex items-center justify-center gap-1 md:gap-4 py-4">
        {units.map((item, idx) => (
          <React.Fragment key={idx}>
            <div className="flex flex-col items-center px-1 md:px-2 min-w-[50px] md:min-w-[70px]">
              <div className="relative overflow-hidden h-10 md:h-14 flex items-center justify-center">
                <AnimatePresence mode="wait">
                  <motion.span 
                    key={item.value}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -20, opacity: 0 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="text-3xl md:text-5xl font-mono font-bold text-wedding-gold tracking-tight"
                  >
                    {item.value.toString().padStart(2, '0')}
                  </motion.span>
                </AnimatePresence>
              </div>
              <span className="text-[8px] md:text-[9px] text-stone-500 font-bold tracking-[0.25em] mt-2">
                {item.label}
              </span>
            </div>
            {idx < units.length - 1 && (
              <div className="flex flex-col justify-center h-10 md:h-14 pb-4 md:pb-6">
                <span className="text-xl md:text-3xl font-mono font-bold text-wedding-gold/30">:</span>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

const AddToCalendar = () => {
  const handleAddToCalendar = () => {
    const title = "Şeymanur & Akif Düğün";
    const description = "Düğünümüze davetlisiniz!";
    const location = "Neslişah Sultan Kültür Merkezi, Fatih/İstanbul";
    const startDate = "20260425T190000";
    const endDate = "20260426T000000";

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startDate}/${endDate}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`;
    
    window.open(googleUrl, '_blank');
  };

  return (
    <button 
      onClick={handleAddToCalendar}
      className="flex items-center gap-2 px-6 py-3 bg-stone-800 text-white rounded-full hover:bg-stone-700 transition-colors shadow-lg"
    >
      <Calendar className="w-4 h-4" />
      <span className="text-sm font-medium">Takvime Ekle</span>
    </button>
  );
};

export default function App() {
  return (
    <div className="min-h-screen selection:bg-wedding-gold selection:text-white overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative min-h-[100dvh] flex flex-col items-center justify-between text-center px-6 pt-8 pb-12 overflow-hidden">
        {/* Background Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?auto=format&fit=crop&q=80&w=1920" 
            alt="Wedding Background" 
            className="w-full h-full object-cover opacity-30"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-wedding-cream/60 via-wedding-cream/20 to-wedding-cream"></div>
        </div>

        {/* Top Verse */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className="z-10 max-w-3xl mt-0 px-4"
        >
          <p className="font-quran text-lg md:text-xl text-stone-700 mb-4" dir="rtl">
            بِسْمِ ٱللَّٰهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-stone-600 text-xs md:text-sm font-light italic mb-2">
            "Kendileri ile huzur bulasınız diye sizin için türünüzden eşler yaratması ve aranızda bir sevgi ve merhamet var etmesi de O'nun (varlığının ve kudretinin) delillerindendir. Şüphesiz bunda düşünen bir toplum için elbette ibretler vardır."
          </p>
          <p className="text-stone-500 text-[10px] md:text-xs uppercase tracking-widest">
            Rûm Suresi, 21. Ayet
          </p>
        </motion.div>

        {/* Center Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="z-10 my-8"
        >
          <p className="text-wedding-gold font-script text-4xl md:text-5xl mb-4 animate-float">
            Düğünümüze Davetlisiniz
          </p>
          <h1 className="text-5xl md:text-8xl font-serif font-light tracking-tight text-stone-900 mb-6">
            Şeymanur <span className="text-wedding-gold font-script text-4xl md:text-6xl">&</span> Akif
          </h1>
          <div className="w-12 h-[1px] bg-wedding-gold mx-auto mb-8"></div>
          <p className="text-stone-700 font-sans font-light text-xl md:text-2xl tracking-[0.4em] mb-12">
            25 NİSAN 2026
          </p>
          
          <CountdownTimer />
        </motion.div>

        {/* Bottom Arrow */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="z-10 flex flex-col items-center gap-2 mb-4"
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-stone-400 font-medium">
            Aşağı Kaydırınız
          </span>
          <motion.div 
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-wedding-gold"
          >
            <ChevronDown className="w-5 h-5" />
          </motion.div>
        </motion.div>
      </section>

      {/* Invitation Text */}
      <section className="py-24 px-6 text-center max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.21, 0.47, 0.32, 0.98] }}
        >
          <Heart className="w-8 h-8 text-wedding-gold mx-auto mb-8" />
          <h2 className="text-3xl md:text-4xl font-serif italic mb-8">
            "Bir ömür boyu sürecek mutluluğumuza ortak olmanızdan onur duyarız."
          </h2>
          <p className="text-stone-500 leading-relaxed font-light text-lg">
            Hayatımızın en özel gününde, sevdiklerimizle bir arada olmanın mutluluğunu yaşamak istiyoruz. 
            Bu anlamlı yolculuğun başlangıcında sizleri de aramızda görmekten büyük sevinç duyacağız.
          </p>
        </motion.div>
      </section>

      {/* Events Section */}
      <section className="py-24 px-6 bg-wedding-sage/30">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-serif text-center mb-16">Etkinlik Bilgileri</h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {EVENTS.map((event, idx) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: idx === 0 ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className={`p-8 rounded-3xl glass-card relative overflow-hidden group`}
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform">
                  {event.icon}
                </div>
                
                <h3 className="text-2xl font-serif font-bold mb-2 text-stone-900">{event.title}</h3>
                
                {event.id === 'kina' && (
                  <p className="text-rose-600 text-sm font-semibold mb-6 tracking-wide animate-pulse">
                    (Hanımlara özeldir)
                  </p>
                )}
                
                {event.id !== 'kina' && <div className="mb-6" />}
                
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3 text-stone-600">
                    <Calendar className="w-5 h-5 text-wedding-gold shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-stone-600">
                    <Clock className="w-5 h-5 text-wedding-gold shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-start gap-3 text-stone-600">
                    <MapPin className="w-5 h-5 text-wedding-gold shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-stone-800">{event.location}</p>
                      <p className="text-sm">{event.address}</p>
                    </div>
                  </div>
                </div>

                <a 
                  href={event.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 w-full justify-center px-6 py-3 border border-stone-200 rounded-xl hover:bg-stone-50 transition-colors text-sm font-medium text-stone-800"
                >
                  <ExternalLink className="w-4 h-4" />
                  Yol Tarifi Al
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Add to Calendar Section */}
      <section className="py-24 px-6 bg-wedding-pink/30 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="max-w-md mx-auto"
        >
          <h2 className="text-3xl font-serif mb-6">Bize Katılın</h2>
          <p className="text-stone-500 mb-10">
            Bu özel günü unutmamak için takviminize şimdiden not edin.
          </p>
          <div className="flex justify-center">
            <AddToCalendar />
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 text-center border-t border-stone-100">
        <p className="font-script text-3xl text-wedding-gold mb-2">Şeymanur & Akif</p>
        <p className="text-stone-400 text-xs uppercase tracking-widest">
          25.04.2026 • İstanbul
        </p>
      </footer>

    </div>
  );
}
