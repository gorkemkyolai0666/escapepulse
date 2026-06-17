'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  DoorOpen,
  Users,
  Puzzle,
  ClipboardCheck,
  Package,
  Tags,
  Settings,
  Sun,
  Moon,
  LogOut,
  KeyRound,
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { useTheme } from '@/lib/theme-context';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const navItems = [
  { href: '/dashboard', label: 'Panel', icon: LayoutDashboard },
  { href: '/escape-rooms', label: 'Odalar', icon: DoorOpen },
  { href: '/game-sessions', label: 'Oyunlar', icon: Users },
  { href: '/puzzle-maintenance', label: 'Bulmaca', icon: Puzzle },
  { href: '/reset-checklists', label: 'Sıfırlama', icon: ClipboardCheck },
  { href: '/prop-orders', label: 'Prop', icon: Package },
  { href: '/rate-tiers', label: 'Fiyat', icon: Tags },
  { href: '/settings', label: 'Ayarlar', icon: Settings },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { escapeVenue, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <aside className="fixed inset-y-0 left-0 z-40 flex w-[4.5rem] flex-col border-r border-border bg-void text-candle lg:w-56">
      <Link
        href="/dashboard"
        className="flex h-16 flex-col items-center justify-center gap-1 border-b border-candle/20 bg-candle/10 px-2 lg:flex-row lg:justify-start lg:gap-3 lg:px-4"
        aria-label="EscapePulse ana sayfa"
      >
        <KeyRound className="h-6 w-6 shrink-0 text-candle" strokeWidth={2} />
        <div className="hidden text-left lg:block">
          <p className="font-display text-sm font-semibold leading-tight text-candle">EscapePulse</p>
          <p className="truncate text-[10px] text-fog">{escapeVenue?.name || 'Kaçış Odası'}</p>
        </div>
      </Link>

      <nav className="flex flex-1 flex-col gap-1 overflow-y-auto p-2" aria-label="Ana menü">
        {navItems.map((item) => {
          const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={cn(
                'flex flex-col items-center gap-0.5 rounded-md px-2 py-2.5 text-[10px] font-semibold uppercase tracking-wider transition-colors lg:flex-row lg:gap-3 lg:px-3 lg:text-xs',
                active
                  ? 'bg-candle/20 text-candle ring-1 ring-candle/40'
                  : 'text-fog hover:bg-candle/10 hover:text-candle',
              )}
              aria-current={active ? 'page' : undefined}
            >
              <Icon className="h-5 w-5 shrink-0" strokeWidth={active ? 2.25 : 1.75} />
              <span className="hidden lg:inline">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="flex flex-col gap-1 border-t border-candle/20 p-2">
        {user && (
          <p className="mb-1 hidden truncate px-2 text-center text-[10px] text-fog lg:block">
            {user.firstName} {user.lastName}
          </p>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleTheme}
          className="h-10 w-full text-fog hover:bg-candle/10 hover:text-candle"
          aria-label="Tema değiştir"
        >
          {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={logout}
          className="h-10 w-full text-fog hover:bg-crimson/20 hover:text-crimson"
          aria-label="Çıkış yap"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </aside>
  );
}
