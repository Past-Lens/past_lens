import ImmersiveMuseumScene from '@/components/immmersive 3d/immersiveMuseum';
import MuseumHeader from '@/components/custom/MuseumHeader';

export default function ImmersiveMuseum() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <MuseumHeader />
            <main className="flex-1 relative">
                <ImmersiveMuseumScene />
            </main>
        </div>
    );
}
