'use client';

import { useEffect, useState } from 'react';
import { Plus, Users } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import {
  formatCurrency,
  formatDateTime,
  formatBatchStatus,
  formatWorkstationType,
  formatPourType,
} from '@/lib/utils';

interface WorkstationOption {
  id: string;
  name: string;
  zone: string;
}

interface PourBatch {
  id: string;
  cashAmount: number;
  cardAmount: number;
  hardenerRatio: number;
  pieceCount: number;
  scheduledAt: string;
  pouringType?: string;
  status: string;
  workstation?: { id: string; name: string; zone: string; workstationType: string };
}

interface ListResponse {
  data: PourBatch[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];
const GAME_TYPES = ['private_group', 'corporate', 'birthday', 'date_night', 'team_building'];

const emptyForm = {
  workstationId: '',
  pouringType: 'private_group',
  cashAmount: '0',
  cardAmount: '0',
  hardenerRatio: '0',
  pieceCount: '0',
  scheduledAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function PourBatchsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<PourBatch[]>([]);
  const [workstations, setWorkstations] = useState<WorkstationOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.pourBatches.list(token), api.workstations.list(token)])
      .then(([sessionsRes, roomsRes]) => {
        setSessions((sessionsRes as ListResponse).data);
        setWorkstations(
          ((roomsRes as { data: WorkstationOption[] }).data || []).map((r) => ({
            id: r.id,
            name: r.name,
            zone: r.zone,
          })),
        );
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, [token]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSubmitting(true);
    try {
      await api.pourBatches.create(token, {
        workstationId: form.workstationId,
        pouringType: form.pouringType,
        cashAmount: parseFloat(form.cashAmount),
        cardAmount: parseFloat(form.cardAmount),
        hardenerRatio: parseFloat(form.hardenerRatio),
        pieceCount: parseInt(form.pieceCount, 10),
        scheduledAt: form.scheduledAt,
        status: form.status,
      });
      setForm(emptyForm);
      setShowForm(false);
      load();
    } catch {
      setError(true);
    } finally {
      setSubmitting(false);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Döküm İşleri</h1>
            <p className="text-muted-foreground">Günlük oyun geliri ve oturum kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="workstation-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="workstation-card">
            <CardHeader>
              <CardTitle className="font-display">Döküm İşi Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="workstationId">Terzi Atölyesi</Label>
                  <select
                    id="workstationId"
                    value={form.workstationId}
                    onChange={(e) => update('workstationId', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Oda seçin</option>
                    {workstations.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pouringType">İş Tipi</Label>
                  <select
                    id="pouringType"
                    value={form.pouringType}
                    onChange={(e) => update('pouringType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {GAME_TYPES.map((t) => (
                      <option key={t} value={t}>{formatPourType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pieceCount">Katılımcı Sayısı</Label>
                  <Input id="pieceCount" type="number" min={0} value={form.pieceCount} onChange={(e) => update('pieceCount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cashAmount">Nakit ($)</Label>
                  <Input id="cashAmount" type="number" min={0} step="0.01" value={form.cashAmount} onChange={(e) => update('cashAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cardAmount">Kart ($)</Label>
                  <Input id="cardAmount" type="number" min={0} step="0.01" value={form.cardAmount} onChange={(e) => update('cardAmount', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="hardenerRatio">Ek Gelir ($)</Label>
                  <Input id="hardenerRatio" type="number" min={0} step="0.01" value={form.hardenerRatio} onChange={(e) => update('hardenerRatio', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">Oturum Tarihi</Label>
                  <Input id="scheduledAt" type="datetime-local" value={form.scheduledAt} onChange={(e) => update('scheduledAt', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatBatchStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="workstation-btn">
                    {submitting ? 'Kaydediliyor...' : 'Kaydet'}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        )}

        {loading && <LoadingSpinner />}
        {error && !loading && sessions.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && sessions.length === 0 && (
          <EmptyState title="Oturum bulunamadı" description="Henüz oyun oturumu eklenmemiş." />
        )}
        {!loading && sessions.length > 0 && (
          <div className="space-y-3">
            {sessions.map((session) => (
              <Card key={session.id} className="workstation-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{session.workstation?.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.workstation?.zone} · {formatWorkstationType(session.workstation?.workstationType || '')} · {formatPourType(session.pouringType || '')} · {session.pieceCount} parça
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(session.scheduledAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">
                      {formatCurrency(session.cashAmount + session.cardAmount + session.hardenerRatio)}
                    </span>
                    <Badge variant="secondary">{formatBatchStatus(session.status)}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </AppLayout>
  );
}
