import { Link } from "react-router-dom";

const menuItems = [
  { name: "Caffe Latte",            price: "$2.95", desc: "Fresh brewed coffee and steamed milk",              isNew: true  },
  { name: "Iced Caramel Latte",     price: "$4.67", desc: "Espresso, milk, ice and caramel sauce",             isNew: false },
  { name: "Caffe Mocha",            price: "$3.67", desc: "Espresso with milk and whipped cream",              isNew: false },
  { name: "Espresso Macchiato",     price: "$2.98", desc: "Rich espresso with milk and foam",                  isNew: false },
  { name: "White Chocolate Mocha",  price: "$2.79", desc: "Espresso, white chocolate, milk, ice and cream",    isNew: false },
  { name: "Caramel Macchiato",      price: "$2.54", desc: "Espresso, vanilla flavored syrup and milk",         isNew: false },
  { name: "Caffe Americano",        price: "$3.06", desc: "Espresso shots and light layer of crema",           isNew: false },
  { name: "Iced Smoked Latte",      price: "$3.05", desc: "Espresso, ice, with smoked butterscotch",           isNew: true  },
  { name: "Cappuccino",             price: "$4.03", desc: "Espresso and smoothed layer of foam",               isNew: false },
  { name: "Iced Caffe Mocha",       price: "$2.60", desc: "Espresso, bittersweet mocha sauce, milk and ice",   isNew: false },
  { name: "Vanilla Latte",          price: "$3.65", desc: "Espresso milk with flavor and cream",               isNew: false },
  { name: "Iced Gingerbread Latte", price: "$3.92", desc: "Espresso, milk, ice and gingerbread flavor",        isNew: false },
];

const specialties = {
  left: [
    { name: "Croissant",    desc: "Buttery, flaky layers baked fresh every morning to start your day right.",    emoji: "🥐" },
    { name: "French Toast", desc: "Golden brioche dipped in vanilla egg batter, dusted with powdered sugar.",    emoji: "🍞" },
    { name: "Pancakes",     desc: "Fluffy stacks served warm with maple syrup and a touch of fresh cream.",      emoji: "🥞" },
  ],
  right: [
    { name: "Turkish Coffee",  desc: "Rich, unfiltered espresso brewed in a traditional copper cezve.",           emoji: "☕" },
    { name: "Coffee To Go",    desc: "Your favorite blend in a cup — ready whenever you need that morning rush.", emoji: "🥤" },
    { name: "Morning Coffee",  desc: "A smooth, balanced roast to ease you into the day with warmth and calm.",   emoji: "🫖" },
  ],
};

export function HomePage() {
  return (
    <>
      {/* ── HERO ── */}
      <section className="relative min-h-[70vh] bg-[#F5ECD7] flex items-center rounded-4xl">
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-10 py-20 md:py-0 px-6 md:px-16">

          {/* Left — Text content */}
          <div className="flex-1 flex flex-col items-start gap-6 z-10">

            <span className="text-xs tracking-[0.3em] uppercase text-amber-700 font-medium">
              Jovanesh Coffee
            </span>

            <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl leading-tight text-neutral-900">
              Life Begins <br />
              After <span className="italic text-amber-800">Coffee</span>
            </h1>

            <p className="text-neutral-500 text-base md:text-lg max-w-sm leading-relaxed">
              Every cup is crafted with care — from the first roast to the last sip.
              Experience coffee the way it was meant to be.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mt-2">
              {/* Primary */}
              <Link
                to="/products"
                className="px-8 py-3 bg-amber-800 text-white text-sm tracking-wide font-medium hover:bg-amber-700 transition rounded-full"
              >
                Shop Now
              </Link>
              {/* Secondary */}
              <a
                href="#menu"
                className="px-8 py-3 border border-amber-800 text-amber-800 text-sm tracking-wide hover:bg-amber-800/10 transition rounded-full"
              >
                View Menu
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-6 border-t border-neutral-300 pt-6">
              <div>
                <p className="text-2xl font-bold text-neutral-900">12+</p>
                <p className="text-xs text-neutral-500 mt-1">Blends</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">4.9★</p>
                <p className="text-xs text-neutral-500 mt-1">Rating</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-neutral-900">10k+</p>
                <p className="text-xs text-neutral-500 mt-1">Happy Customers</p>
              </div>
            </div>
          </div>

          {/* Right spacer */}
          <div className="hidden md:flex flex-1" />

          {/* Coffee cup — absolute right, hidden on mobile */}
          <div className="hidden md:block absolute -right-20 top-[60%] -translate-y-1/2 pointer-events-none">
            <div className="absolute inset-0 rounded-full bg-amber-200/50 blur-3xl scale-50" />
            <img
              src="/coffee-cup.png"
              alt="Coffee splash"
              className="relative z-10 md:w-105 lg:w-230 drop-shadow-2xl"
            />
          </div>

        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section id="feature" className="mt-20 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-16">
            <span className="italic text-amber-700 text-sm">What Happens Here</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-wide text-center">
              Build Your Morning.
            </h2>
            <div className="w-16 h-px bg-amber-700 mt-1" />
          </div>

          {/* 3-column layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-10">

            {/* Left items — right-aligned, icon on the right */}
            <div className="flex flex-col gap-10 order-2">
              {specialties.left.map((item) => (
                <div key={item.name} className="flex  items-center gap-4 flex-col md:flex-row-reverse text-center md:text-right">
                  <span className="text-3xl shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-bebas text-xl tracking-wide text-white">{item.name}</h3>
                    <p className="text-xs text-coffee-200 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Center image */}
            <div className="flex justify-center order-1 md:order-2">
              <img
                src="/centerCup.png"
                alt="Our signature drink"
                className="w-50 md:w-72 drop-shadow-2xl"
              />
            </div>

            {/* Right items — left-aligned, icon on the left */}
            <div className="flex flex-col gap-10 order-3">
              {specialties.right.map((item) => (
                <div key={item.name} className="flex items-center gap-4 flex-col md:flex-row text-center md:text-left">
                  <span className="text-3xl shrink-0">{item.emoji}</span>
                  <div>
                    <h3 className="font-bebas text-xl tracking-wide text-white">{item.name}</h3>
                    <p className="text-xs text-coffee-200 leading-relaxed mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="mt-10 md:mt-20 py-10 md:py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-10 md:gap-16">

          {/* Mobile: single image */}
          <div className="md:hidden w-full h-64 rounded-2xl overflow-hidden shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=800&h=500&fit=crop"
              alt="Cafe interior"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Desktop: overlapping two images with blob */}
          <div className="hidden md:flex relative flex-1 items-center justify-center min-h-105">

            {/* Blob */}
            <img
              src="/Blop_1.png"
              alt=""
              aria-hidden="true"
              className="absolute inset-0 w-full h-full object-contain pointer-events-none z-0 opacity-45 scale-140"
            />

            {/* Image 1 — top left */}
            <div className="absolute left-10 top-6 w-80 h-60 rounded-2xl overflow-hidden shadow-2xl z-10">
              <img
                src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=400&h=300&fit=crop"
                alt="Cafe interior"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Image 2 — bottom right */}
            <div className="absolute right-4 bottom-0 w-80 h-70 rounded-2xl overflow-hidden shadow-2xl z-20">
              <img
                src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&h=300&fit=crop"
                alt="Coffee brewing"
                className="w-full h-full object-cover"
              />
            </div>

          </div>

          {/* Right — text */}
          <div className="flex-1 flex flex-col gap-5">

            <span className="text-xs tracking-[0.3em] uppercase text-coffee-300 font-semibold">
              About Us
            </span>

            <h2 className="font-bebas text-white text-5xl md:text-6xl leading-tight tracking-wide">
              About Jovanesh Cafe
            </h2>

            <p className="text-coffee-100 text-base leading-relaxed">
              We started with a simple belief — that great coffee changes your day.
              Every blend we roast, every cup we serve, is a reflection of our passion
              for quality and our love for the craft.
            </p>

            <p className="text-coffee-200 text-sm leading-relaxed">
              From single-origin beans sourced from the world's finest farms, to the
              skilled hands that brew each cup — we are dedicated to giving you an
              experience worth savoring, every single time.
            </p>

            {/* Secondary — on dark bg, border is white-tinted */}
            <Link
              to="/products"
              className="mt-2 self-start px-8 py-3 border border-amber-700 text-amber-500 text-sm font-semibold rounded-full hover:bg-amber-800/20 transition"
            >
              About Us
            </Link>

          </div>
        </div>
      </section>
      {/* ── MENU ── */}
      <section id="menu" className="mt-20 py-20 px-6 md:px-16 bg-coffee-50 rounded-2xl">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-12">
            <span className="italic text-amber-800 text-sm font-medium">What Happens Here</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-neutral-900 tracking-wide text-center">
              Explore Our Menu.
            </h2>
            <div className="w-16 h-px bg-amber-700 mt-1" />
          </div>

          {/* Two-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-0">
            {menuItems.map((item) => (
              <div key={item.name} className="flex items-start justify-between gap-4 py-5 border-b border-neutral-200">
                <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bebas text-xl tracking-wide text-neutral-900">{item.name}</span>
                    {item.isNew && (
                      <span className="text-[10px] font-semibold uppercase px-2 py-0.5 bg-amber-700 text-white rounded-sm">
                        New
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400 italic">{item.desc}</p>
                </div>
                <span className="font-semibold text-neutral-800 whitespace-nowrap">{item.price}</span>
              </div>
            ))}
          </div>

          {/* Bottom CTA */}
          <div className="flex justify-center mt-12">
            {/* Primary */}
            <Link
              to="/products"
              className="px-10 py-3 bg-amber-800 text-white font-semibold text-sm tracking-wide rounded-full hover:bg-amber-700 transition"
            >
              View All Products →
            </Link>
          </div>

        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="mt-20 py-20 px-6 md:px-16">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex flex-col items-center gap-3 mb-16">
            <span className="italic text-amber-700 text-sm">We'd Love to Hear From You</span>
            <h2 className="font-bebas text-5xl md:text-6xl text-white tracking-wide text-center">
              Find Us & Say Hello.
            </h2>
            <div className="w-16 h-px bg-amber-700 mt-1" />
          </div>

          {/* 4 info cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">

            {[
              {
                emoji: "📍",
                title: "Address",
                lines: ["проспект Достык, 52", "Медеуский район, Алматы", "Kazakhstan, 050010"],
              },
              {
                emoji: "🕐",
                title: "Opening Hours",
                lines: ["Mon – Fri: 7:00 AM – 9:00 PM", "Sat – Sun: 8:00 AM – 10:00 PM"],
              },
              {
                emoji: "📞",
                title: "Phone",
                lines: ["+7 (727) 123-45-67", "+7 (700) 987-65-43"],
              },
              {
                emoji: "✉️",
                title: "Email",
                lines: ["hello@jovaneshcafe.com", "order@jovaneshcafe.com"],
              },
            ].map((card) => (
              <div
                key={card.title}
                className="flex flex-col gap-3 bg-coffee-800 border border-coffee-700 rounded-2xl p-6"
              >
                <span className="text-3xl">{card.emoji}</span>
                <h3 className="font-bebas text-lg text-white tracking-wide">{card.title}</h3>
                <div className="flex flex-col gap-1">
                  {card.lines.map((line) => (
                    <p key={line} className="text-coffee-200 text-xs leading-relaxed">{line}</p>
                  ))}
                </div>
              </div>
            ))}

          </div>

          {/* 2GIS Map embed */}
          <div className="mt-10 rounded-2xl overflow-hidden border border-coffee-700 h-80 md:h-96 w-full">
            <iframe
              src="https://maps.google.com/maps?q=Dostyk+Avenue+52,+Almaty,+Kazakhstan&output=embed&z=16"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Jovanesh Cafe location on Google Maps"
            />
          </div>

        </div>
      </section>
    </>
  );
}
