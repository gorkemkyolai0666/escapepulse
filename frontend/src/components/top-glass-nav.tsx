'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Beaker,
  Layers,
  Wrench,
  Thermometer,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/workstations', label: 'İstasyonlar', icon: Beaker },
  { href: '/pour-batches', label: 'Dökümler', icon: Layers },
  { href: '/equipment-repairs', label: 'Bakım', icon: Wrench },
  { href: '/curing-checklists', label: 'Kürleme', icon: Thermometer },
  { href: '/mold-orders', label: 'Kalıplar', icon: Package },
  { href: '/workshop-rates', label: 'Ücretler', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function TopGlassNav() {
  const pathname = usePathname();
  const { resinStudio, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 border-b border-border/40 bg-card/60 backdrop-blur-xl supports-[backdrop-filter]:bg-card/50">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <div className="flex shrink-0 items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-gradient-to-br from-accent to-primary text-accent-foreground shadow-lg shadow-accent/20">
            <Beaker className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div className="hidden sm:block">
            <p className="font-display text-base leading-none text-primary">ResinPulse</p>
            <p className="max-w-[140px] truncate text-[10px] text-muted-foreground">
              {resinStudio?.name || 'Atölye'}
            </p>
          </div>
        </div>

        <nav
          className="flex flex-1 items-center gap-1 overflow-x-auto pb-0.5 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          aria-label="Ana menü"
        >
          {navItems.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex shrink-0 items-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-medium transition-all sm:text-sm',
                  active
                    ? 'bg-accent/15 text-accent shadow-sm ring-1 ring-accent/30'
                    : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground',
                )}
                aria-current={active ? 'page' : undefined}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {user && (
            <span className="mr-1 hidden text-xs text-muted-foreground lg:inline">
              {user.firstName}
            </span>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-8 w-8 rounded-xl"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-8 w-8 rounded-xl text-muted-foreground hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
