import React from 'react';
import { Logo } from './Logo';
import { Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { useAuth } from '../../context/AuthContext';
import { useSchoolData } from '../../context/SchoolDataContext';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  const { toast } = useToast();
  const { logout } = useAuth();
  const { schoolConfig } = useSchoolData();
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Col 1: Brand (4 cols on desktop to eliminate overlap) */}
          <div className="lg:col-span-4 space-y-4 min-w-0">
            <div className="bg-white/5 border border-white/10 p-2.5 sm:p-3 rounded-2xl max-w-full inline-flex items-center">
              <Logo size="md" showSubtitle={false} inverted={true} />
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              Empowering global leaders of tomorrow through holistic academic rigor, STEM innovation, and character building since {schoolConfig.establishedYear || '1994'}.
            </p>
            {schoolConfig.affiliationCode && (
              <div className="text-xs text-blue-400 font-semibold break-words">
                {schoolConfig.affiliationCode}
              </div>
            )}
          </div>

          {/* Col 2: Quick Links (2 cols on desktop) */}
          <div className="lg:col-span-2 space-y-3">
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

          {/* Col 3: Contact (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-3 min-w-0">
            <h4 className="text-sm font-bold text-white uppercase tracking-wider font-cinzel">Contact Us</h4>
            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="break-words leading-relaxed">{schoolConfig.address}</span>
              </div>
              <div className="flex items-start gap-2.5">
                <Phone className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span className="break-words">
                  {schoolConfig.contactPhone}
                  {schoolConfig.secondaryPhone ? ` / ${schoolConfig.secondaryPhone}` : ''}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="break-all">{schoolConfig.contactEmail}</span>
              </div>
            </div>
          </div>

          {/* Col 4: Newsletter & Portals (3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
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
                <span>School Portal Login</span>
                <ArrowRight className="w-3.5 h-3.5 text-blue-400" />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>© {new Date().getFullYear()} {schoolConfig.schoolName}. All rights reserved.</div>
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
