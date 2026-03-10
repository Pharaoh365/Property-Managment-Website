/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import Home from './pages/Home';
import Vacancies from './pages/Vacancies';
import TenantPortal from './pages/TenantPortal';
import OwnerPortal from './pages/OwnerPortal';
import PMPortal from './pages/PMPortal';
import About from './pages/About';
import MilitaryRelocation from './pages/MilitaryRelocation';

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/vacancies" element={<Vacancies />} />
            <Route path="/tenant" element={<TenantPortal />} />
            <Route path="/owner" element={<OwnerPortal />} />
            <Route path="/pm" element={<PMPortal />} />
            <Route path="/military" element={<MilitaryRelocation />} />
            <Route path="/about" element={<About />} />
            {/* Fallback routes for demo */}
            <Route path="/contact" element={<Home />} />
          </Routes>
        </main>
        
        <footer className="bg-brand-ink text-white py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 border-b border-white/10 pb-12 mb-12">
              <div className="col-span-2">
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg" />
                  <span className="text-2xl font-serif font-bold">MKDDY PM</span>
                </div>
                <p className="text-white/60 max-w-sm leading-relaxed">
                  Professional property management services in Virginia Beach, Norfolk, and the surrounding Hampton Roads area. 
                  Committed to excellence, transparency, and local expertise.
                </p>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Quick Links</h4>
                <ul className="space-y-4 text-sm text-white/60">
                  <li><a href="/vacancies" className="hover:text-brand-primary transition-colors">Vacancies</a></li>
                  <li><a href="/tenant" className="hover:text-brand-primary transition-colors">Tenant Portal</a></li>
                  <li><a href="/owner" className="hover:text-brand-primary transition-colors">Owner Portal</a></li>
                  <li><a href="/military" className="hover:text-brand-primary transition-colors">Military Relocation</a></li>
                </ul>
              </div>
              <div>
                <h4 className="font-bold mb-6 uppercase tracking-widest text-xs">Contact</h4>
                <ul className="space-y-4 text-sm text-white/60">
                  <li>Virginia Beach, VA</li>
                  <li>(757) 555-0123</li>
                  <li>office@mkddypm.com</li>
                </ul>
              </div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6 text-white/40 text-xs">
              <p>© 2026 MKDDY Property Management. All rights reserved.</p>
              <div className="flex gap-8">
                <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                <a href="#" className="hover:text-white transition-colors">Fair Housing</a>
              </div>
            </div>
          </div>
        </footer>

        <Chatbot />
      </div>
    </Router>
  );
}

