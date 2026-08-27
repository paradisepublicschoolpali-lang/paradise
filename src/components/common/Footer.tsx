import React from 'react';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Send, ExternalLink, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const [email, setEmail] = React.useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast('Subscribed!', 'You will receive the monthly school newsletter.', 'success');
    setEmail('');
  };

  const navTo = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Col 1: Brand */}
          <div className="space-y-4">
            <div className="bg-white/10 p-3 rounded-2xl inline-block">
              <Logo size="md" showSubtitle={false} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Empowering global leaders of tomorrow through holistic academic rigor, STEM innovation, and character building since 1994.
            </p>
            <div className="text-xs text-blue-400 font-semibold">
              CBSE Affiliation No: 992140 • IB World School
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-cinzel">Quick Links</h4>
            <ul className="space-y-2 text-xs">
              {['Home', 'About Us', 'Academics', 'Admissions', 'Events', 'Gallery', 'Notices', 'Contact'].map(link => {
                const id = link.toLowerCase().replace(' ', '');
                return (
                  <li key={link}>
                    <button
                      onClick={() => navTo(id === 'aboutus' ? 'about' : id)}
                      className="hover:text-white hover:underline transition-colors cursor-pointer"
                    >
                      {link}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-cinzel">Contact Us</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>42 Heritage Avenue, North Campus Enclave, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0" />
                <span>+1 (800) 842-PARADISE</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span>info@paradiseschool.edu</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Portals */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-cinzel">Newsletter</h4>
            <p className="text-xs text-slate-400">Subscribe for admission alerts and circulars.</p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="Enter email..."
                className="w-full px-3 py-2 rounded-xl bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors cursor-pointer shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-2">
              <button
                onClick={logout}
                className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <span>Switch Portal (Login)</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© 2026 Paradise Public School. All rights reserved.</div>
          <div className="flex items-center gap-4">
            <a href="#" className="hover:text-slate-400">Privacy Policy</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Terms of Service</a>
            <span>•</span>
            <a href="#" className="hover:text-slate-400">Anti-Ragging Compliance</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
