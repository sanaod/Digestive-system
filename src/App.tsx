import { useState } from 'react';
import { Navbar } from './components/ui/Navbar';
import { HomeIntro } from './components/ui/HomeIntro';
import { ClassificationActivity } from './components/activities/ClassificationActivity';
import { OrderRouteActivity } from './components/activities/OrderRouteActivity';
import { OrganIdentificationActivity } from './components/activities/OrganIdentificationActivity';
import { DigestiveQuiz } from './components/activities/DigestiveQuiz';
import { CreativeCommonsSection } from './components/ui/CreativeCommonsSection';
import { OrganDetailModal } from './components/ui/OrganDetailModal';
import { Footer } from './components/ui/Footer';
import { GameMode, OrganInfo } from './types/digestive';
import { soundFx } from './utils/audio';

export default function App() {
  const [currentMode, setCurrentMode] = useState<GameMode>('explore');
  const [selectedOrgan, setSelectedOrgan] = useState<OrganInfo | null>(null);
  const [isMuted, setIsMuted] = useState(false);

  const handleToggleMute = () => {
    const muted = soundFx.toggleMute();
    setIsMuted(muted);
  };

  const handleSelectOrgan = (organ: OrganInfo) => {
    setSelectedOrgan(organ);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between font-cairo dir-rtl text-right selection:bg-emerald-500 selection:text-slate-950">
      {/* Header Navbar */}
      <Navbar
        currentMode={currentMode}
        onSelectMode={(mode) => {
          setCurrentMode(mode);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        isMuted={isMuted}
        onToggleMute={handleToggleMute}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 py-6 w-full flex-1">
        {currentMode === 'explore' && (
          <HomeIntro
            onSelectOrgan={handleSelectOrgan}
            selectedOrganId={selectedOrgan?.id || null}
          />
        )}

        {currentMode === 'journey' && (
          <HomeIntro
            onSelectOrgan={handleSelectOrgan}
            selectedOrganId={selectedOrgan?.id || null}
          />
        )}

        {currentMode === 'identify' && <OrganIdentificationActivity />}

        {currentMode === 'classify' && <ClassificationActivity />}

        {currentMode === 'order' && <OrderRouteActivity />}

        {currentMode === 'quiz' && <DigestiveQuiz />}

        {currentMode === 'license' && <CreativeCommonsSection />}
      </main>

      {/* Organ Details Modal Popup on 3D Click / Selection */}
      <OrganDetailModal
        organ={selectedOrgan}
        onClose={() => setSelectedOrgan(null)}
      />

      {/* Footer */}
      <Footer onSelectMode={setCurrentMode} />
    </div>
  );
}
