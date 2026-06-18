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
  formatBatchStatus,
  formatEquipmentRepairStatus,
  formatEquipmentRepairPriority,
  formatWorkstationType,
  formatPourType,
} from '@/lib/utils';

interface DashboardStats {
  totalWorkstations: number;
  availableWorkstations: number;
  pouringWorkstations: number;
  workstationUtilizationRate: number;
  openEquipmentRepair: number;
  urgentEquipmentRepair: number;
  pendingCuringChecklist: number;
  dailyRevenue: number;
  recentBatches: Array<{
    id: string;
    cashAmount: number;
    cardAmount: number;
    hardenerRatio: number;
    scheduledAt: string;
    pouringType?: string;
    status: string;
    workstation?: { name: string; zone: string; workstationType: string };
  }>;
  recentEquipmentRepair: Array<{
    id: string;
    title: string;
    priority: string;
    status: string;
    reportedAt: string;
    workstation?: { name: string; zone: string };
  }>;
  studioZones: Array<{ zone: string; workstationCount: number }>;
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
          <p className="text-muted-foreground">İstasyon kullanımı ve günlük gelir özeti</p>
        </div>

        {loading && <LoadingSpinner />}
        {error && <ErrorState onRetry={loadStats} />}
        {stats && !loading && (
          <>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="İstasyon Kullanımı"
                value={formatPercent(stats.workstationUtilizationRate)}
                description={`${stats.availableWorkstations}/${stats.totalWorkstations} istasyon müsait`}
                icon={<CircleDot className="h-4 w-4" />}
              />
              <StatCard
                title="Günlük Gelir"
                value={formatCurrency(stats.dailyRevenue)}
                description={`${stats.pouringWorkstations} istasyon dökümde`}
                icon={<DollarSign className="h-4 w-4" />}
              />
              <StatCard
                title="İstasyon Bakımı"
                value={stats.openEquipmentRepair}
                description={`${stats.urgentEquipmentRepair} acil/yüksek öncelik`}
                icon={<Puzzle className="h-4 w-4" />}
              />
              <StatCard
                title="Kürleme Kontrol Planı"
                value={stats.pendingCuringChecklist}
                description="7 gün içinde planlanan"
                icon={<ClipboardCheck className="h-4 w-4" />}
              />
            </div>

            <Card className="workstation-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <Users className="h-4 w-4 text-accent" />
                  Son Döküm Partileri
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentBatches.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Henüz döküm kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentBatches.map((session) => (
                      <div
                        key={session.id}
                        className="flex flex-wrap items-center justify-between gap-2 bg-muted/40 px-4 py-3"
                      >
                        <div>
                          <p className="font-semibold">{session.workstation?.name || '—'}</p>
                          <p className="text-xs text-muted-foreground">
                            {session.workstation?.zone} · {formatWorkstationType(session.workstation?.workstationType || '')} · {formatPourType(session.pouringType || '')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono font-semibold">
                            {formatCurrency(
                              session.cashAmount + session.cardAmount + session.hardenerRatio,
                            )}
                          </p>
                          <p className="text-xs text-muted-foreground">{formatDateTime(session.scheduledAt)}</p>
                        </div>
                        <Badge variant="secondary">{formatBatchStatus(session.status)}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="workstation-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 font-display text-lg">
                  <AlertTriangle className="h-4 w-4 text-destructive" />
                  Açık İstasyon Bakım Kayıtları
                </CardTitle>
              </CardHeader>
              <CardContent>
                {stats.recentEquipmentRepair.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Açık bakım kaydı yok.</p>
                ) : (
                  <div className="space-y-3">
                    {stats.recentEquipmentRepair.map((item) => (
                      <div key={item.id} className="bg-muted/40 px-4 py-3">
                        <p className="font-semibold">{item.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {item.workstation?.name || 'İstasyon belirtilmemiş'} · {item.workstation?.zone} · {formatEquipmentRepairPriority(item.priority)} ·{' '}
                          {formatEquipmentRepairStatus(item.status)}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="grid gap-4 sm:grid-cols-2">
              <Card className="workstation-card">
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

              <Card className="workstation-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 font-display text-lg">
                    <CircleDot className="h-4 w-4 text-accent" />
                    Kanat Dağılımı
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {stats.studioZones.map((w) => (
                    <div key={w.zone} className="flex justify-between text-sm">
                      <span>{w.zone}</span>
                      <Badge variant="secondary">{w.workstationCount} oda</Badge>
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
