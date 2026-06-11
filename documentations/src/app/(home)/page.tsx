import { Hero } from '@/components/home/hero';
import { Features } from '@/components/home/features';

export default function HomePage() {
  return (
    <div className="flex flex-col flex-1">
      <Hero />
      <Features />
    </div>
  );
}
