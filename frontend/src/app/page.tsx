import Link from 'next/link';
import { Beaker, Layers, Wrench, Thermometer, Package, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    icon: Beaker,
    title: 'İstasyon Envanteri',
    description: 'Standart, premium, vakum ve basınç potu istasyonlarınızı bölge bazında takip edin.',
  },
  {
    icon: Layers,
    title: 'Döküm Partileri',
    description: 'Nehir masası, coaster ve takı dökümlerini sertleştirici oranı ve gelir kayıtlarıyla yönetin.',
  },
  {
    icon: Wrench,
    title: 'Ekipman Bakımı',
    description: 'Vakum pompası, karıştırıcı ve nem kontrol arızalarını öncelik sırasıyla takip edin.',
  },
  {
    icon: Thermometer,
    title: 'Kürleme Kontrolleri',
    description: 'Nem oranı, sıcaklık logları ve pigment karışımlarını planlayın.',
  },
  {
    icon: Package,
    title: 'Kalıp Siparişleri',
    description: 'Özel kalıp siparişlerini, tedarikçileri ve teslim durumlarını yönetin.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/40 bg-card/60 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-iris text-accent-foreground shadow-lg shadow-accent/20">
              <Beaker className="h-5 w-5" strokeWidth={2} />
            </div>
            <span className="font-display text-2xl text-primary">ResinPulse</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/login">Giriş Yap</Link>
            </Button>
            <Button asChild className="resin-btn bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/register">Ücretsiz Başla</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
          <div className="max-w-2xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-accent">
              Epoksi Reçine Atölyesi Operasyonları
            </p>
            <h1 className="font-display text-4xl leading-tight text-primary sm:text-5xl lg:text-6xl">
              Dökümlerinizi, kürlemelerinizi ve kalıplarınızı tek laboratuvarda yönetin
            </h1>
            <p className="mt-6 text-lg text-muted-foreground">
              Bağımsız epoksi reçine atölyeleri için istasyon envanteri, döküm planlaması, ekipman bakımı ve
              kürleme kontrolü — kağıt defterlerin yerini alan modern bir çözüm.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="resin-btn bg-accent text-accent-foreground hover:bg-accent/90">
                <Link href="/register">
                  Demo Hesabıyla Başla
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="resin-btn">
                <Link href="/login">Giriş Yap</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="border-t border-border/40 py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <h2 className="font-display text-2xl text-primary">Atölyeniz için her şey</h2>
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                return (
                  <div key={feature.title} className="glass-card p-6">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-2xl bg-accent/10 text-accent">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display text-lg text-primary">{feature.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        © {new Date().getFullYear()} ResinPulse — Epoksi Reçine Atölyesi Yönetim Platformu
      </footer>
    </div>
  );
}
