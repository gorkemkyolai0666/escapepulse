'use client';

import { useEffect, useState } from 'react';
import { CircleDot, DollarSign, Puzzle, ClipboardCheck, TrendingUp, AlertTriangle, Users } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { StatCard } from '@/components/stat-card';
import { LoadingSpinner, ErrorState } from '@/components/states';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatPercent,
  formatSessionStatus,
  formatPuzzleMaintenanceStatus,
  formatPuzzleMaintenancePriority,
  formatRoomTheme,
  formatGameType,
} from '@/lib/utils';

interface DashboardStats {
  totalRooms: number;
  availableRooms: number;
  inGameRooms: number;
  roomUtilizationRate: number;
  openPuzzleMaintenance: number;
  urgentPuzzleMaintenance: number;
  pendingResetChecklist: number;
  dailyRevenue: number;
  recentGames: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    addOnRevenue: number;
    sessionAt: string;
    gameType?: string;
    status: string;
    escapeRoom?: { name: string; wing: string; theme: string };
  }>;
  recentPuzzleMaintenance: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    escapeRoom?: { name: string; wing: string };
  }>;
  roomWings: Array<{ wing: string; roomCount: number }>;
  monthlyTrend: Array<{ month: string; games: number; revenue: number }>;
}

function formatTrendMonth(monthKey: string): string {
  const [year, month] = monthKey.split('-');
  const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1);
  return new Intl.DateTimeFormat('tr-TR', { month: 'short', year: 'numeric' }).format(date);
}

export default function DashboardPage() {
  const { token } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const loadStats = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.dashboard
      .stats(token)
      .then((data) => setStats(data as DashboardStats))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadStats();
  }, [token]);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl text-primary">Operasyon Paneli</h1>
          <p className="text-muted-foreground">Oda kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Oda Kullanımı"
                value={formatPercent(stats.roomUtilizationRate)}
                description={`${stats.availableRooms}/${stats.totalRooms} oda müsait`}
                icon={<CircleDot className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.inGameRooms} oda oyunda`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="Bulmaca Bakımı"
                value={stats.openPuzzleMaintenance}
                description={`${stats.urgentPuzzleMaintenance} acil/yüksek öncelik`}
                icon={<Puzzle className="h-4 w-4" />}
              />
              <StatCard
                title="Sıfırlama Planı"
                value={stats.pendingResetChecklist}
                description="7 gün içinde planlanan"
                icon={<ClipboardCheck className="h-4 w-4" />}
              />
            </div>

            <Card className="mystery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <Users className="h-4 w-4 text-accent" />
                  Son Oyun Oturumları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentGames.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz oturum kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentGames.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.escapeRoom?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.escapeRoom?.wing} · {formatRoomTheme(session.escapeRoom?.theme || '')} · {formatGameType(session.gameType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(
                              session.cashAmount + session.cardAmount + session.addOnRevenue,
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="mystery-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık Bulmaca Bakım Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentPuzzleMaintenance.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık bakım kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentPuzzleMaintenance.map((item) => (
                      <div key={item.id} className="bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.escapeRoom?.name || 'Oda belirtilmemiş'} · {item.escapeRoom?.wing} · {formatPuzzleMaintenancePriority(item.priority)} ·{' '}
                          {formatPuzzleMaintenanceStatus(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="mystery-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <TrendingUp className="h-4 w-4 text-accent" />
                    Aylık Trend
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.monthlyTrend.map((row) => (
                    <div key={row.month} className="flex justify-between text-sm">
                      <span>{formatTrendMonth(row.month)}</span>
                      <span className="font-mono font-semibold">{formatCurrency(row.revenue)}</span>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="mystery-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <CircleDot className="h-4 w-4 text-accent" />
                    Kanat Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.roomWings.map((w) => (
                    <div key={w.wing} className="flex justify-between text-sm">
                      <span>{w.wing}</span>
                      <Badge variant="secondary">{w.roomCount} oda</Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
