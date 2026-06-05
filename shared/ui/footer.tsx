import { UtensilsCrossed } from "lucide-react";

const footerSections = [
  {
    title: "Company",
    links: ["About", "Careers", "Blog", "Press"],
  },
  {
    title: "Support",
    links: ["Help Center", "Safety", "Terms of Service", "Privacy Policy"],
  },
];

const contactInfo = [
  "support@buybites.com",
  "+639178294742",
  "Address: Poblacion, Baybay",
  "Pangasinan, Baybay",
];

const bottomLinks = ["Privacy", "Terms", "Cookies"];

export default function Footer() {
  return (
    <footer className="bg-[#1F2421] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-b from-[var(--accent-yellow)]/80 to-[var(--accent-orange)] rounded-lg flex items-center justify-center">
                <UtensilsCrossed className="w-6 h-6" />
              </div>
              <span className="text-xl font-bold">Buybites</span>
            </div>
            <p className="text-white/70 text-sm leading-relaxed">
              Your favorite food delivery service. Fast, reliable, and delicious meals delivered to your door.
            </p>
          </div>

          {/* Dynamic link sections */}
          {footerSections.map((section) => (
            <FooterLinks
              key={section.title}
              title={section.title}
              links={section.links}
            />
          ))}

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Get In Touch</h3>
            <ul className="space-y-2 text-sm text-white/70">
              {contactInfo.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm">
            <p className="text-white/70">© 2025 Buybites. All rights reserved.</p>
            <div className="flex gap-6">
              {bottomLinks.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterLinks({ title, links }: { title: string; links: string[] }) {
  return (
    <div>
      <h3 className="font-semibold mb-4">{title}</h3>
      <ul className="space-y-2 text-sm">
        {links.map((link: string) => (
          <li key={link}>
            <a
              href="#"
              className="text-white/70 hover:text-white transition-colors"
            >
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

