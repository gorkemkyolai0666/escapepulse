'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Flame,
  Layers,
  Wrench,
  Droplets,
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
  { href: '/workstations', label: 'İstasyonlar', icon: Flame },
  { href: '/pour-batches', label: 'Dökümler', icon: Layers },
  { href: '/equipment-repairs', label: 'Bakım', icon: Wrench },
  { href: '/curing-checklists', label: 'Kürlemelar', icon: Droplets },
  { href: '/mold-orders', label: 'Kalıp Siparişleri', icon: Package },
  { href: '/workshop-rates', label: 'Atölye Ücretiler', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function SideRail() {
  const pathname = usePathname();
  const { resinStudio, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/80 bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/90">
      <div className="flex items-center gap-3 border-b border-border/60 px-5 py-5">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-accent-foreground shadow-sm">
          <Flame className="h-5 w-5" strokeWidth={2} />
        </div>
        <div className="min-w-0">
          <p className="font-display text-lg leading-none text-primary">ResinPulse</p>
          <p className="truncate text-[11px] text-muted-foreground">{resinStudio?.name || 'Atölye'}</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Ana menü">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active
                  ? 'bg-accent text-accent-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-4 w-4 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-border/60 p-4">
        {user && (
          <p className="mb-3 truncate text-xs text-muted-foreground">
            {user.firstName} {user.lastName}
          </p>
        )}
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="h-9 w-9 rounded-xl"
            aria-label="Tema değiştir"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={logout}
            className="h-9 w-9 rounded-xl text-muted-foreground hover:text-destructive"
            aria-label="Çıkış yap"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
