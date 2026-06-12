import { RootProvider } from 'fumadocs-ui/provider/next';
import './global.css';
import { Inter, Geist } from 'next/font/google';
import { cn } from "@/lib/utils";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/footer";

import { Metadata } from 'next';
import { appUrl } from "@/lib/shared";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    template: '%s | Stria Icons',
    default: 'Stria Icons - Premium Open Source SVG Icons',
  },
  icons: {
    icon: '/stria-logo.svg',
  },
  description: 'A meticulously crafted set of open-source SVG icons, available in Solid, Regular, Light, Thin, and Duotone styles.',
  openGraph: {
    title: 'Stria Icons',
    description: 'A meticulously crafted set of open-source SVG icons.',
    url: 'https://stria-icons.dyzulk.com',
    siteName: 'Stria Icons',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Stria Icons',
    description: 'A meticulously crafted set of open-source SVG icons.',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={cn(inter.className, "font-sans", geist.variable)} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>
          <div className="flex-1 flex flex-col">{children}</div>
          <Footer />
        </RootProvider>
        <Toaster />
      </body>
    </html>
  );
}
