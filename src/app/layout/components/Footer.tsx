import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="mt-20 border-t border-coffee-200 bg-coffee-50 px-6 md:px-16 py-12">
      <div className="max-w-6xl mx-auto">

        {/* Top row */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-bebas text-2xl tracking-widest text-coffee-900">Jovanesh</span>
            <p className="text-coffee-600 text-xs leading-relaxed">
              Crafted coffee, warm atmosphere, unforgettable mornings. Visit us and taste the difference.
            </p>
          </div>

          {/* Quick links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bebas text-lg tracking-wide text-coffee-900">Quick Links</h4>
            {[
              { label: "Home",     to: "/"         },
              { label: "Menu",     to: "/#menu"    },
              { label: "Products", to: "/products" },
            ].map((l) => (
              <Link
                key={l.label}
                to={l.to}
                className="text-coffee-600 text-xs hover:text-amber-700 transition"
              >
                {l.label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bebas text-lg tracking-wide text-coffee-900">Contact</h4>
            <p className="text-coffee-600 text-xs">📍 12 Abay Avenue, Almaty</p>
            <p className="text-coffee-600 text-xs">📞 +7 (727) 123-45-67</p>
            <p className="text-coffee-600 text-xs">✉️ hello@jovaneshcafe.com</p>
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-3">
            <h4 className="font-bebas text-lg tracking-wide text-coffee-900">Hours</h4>
            <p className="text-coffee-600 text-xs">Mon – Fri: 7:00 AM – 9:00 PM</p>
            <p className="text-coffee-600 text-xs">Sat – Sun: 8:00 AM – 10:00 PM</p>
          </div>

        </div>

        {/* Bottom row */}
        <div className="border-t border-coffee-200 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-coffee-500 text-xs">
            © {new Date().getFullYear()} Jovanesh Cafe. All rights reserved.
          </p>
          <div className="flex gap-6">
            {["Instagram", "Twitter", "Facebook"].map((s) => (
              <a
                key={s}
                href="#"
                className="text-coffee-500 text-xs hover:text-amber-700 transition"
              >
                {s}
              </a>
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}
