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
  formatSessionStatus,
  formatRoomTheme,
  formatGameType,
} from '@/lib/utils';

interface EscapeRoomOption {
  id: string;
  name: string;
  wing: string;
}

interface GameSession {
  id: string;
  cashAmount: number;
  cardAmount: number;
  addOnRevenue: number;
  participants: number;
  sessionAt: string;
  gameType?: string;
  status: string;
  escapeRoom?: { id: string; name: string; wing: string; theme: string };
}

interface ListResponse {
  data: GameSession[];
  total: number;
}

const SESSION_STATUSES = ['recorded', 'verified', 'disputed'];
const GAME_TYPES = ['private_group', 'corporate', 'birthday', 'date_night', 'team_building'];

const emptyForm = {
  escapeRoomId: '',
  gameType: 'private_group',
  cashAmount: '0',
  cardAmount: '0',
  addOnRevenue: '0',
  participants: '0',
  sessionAt: new Date().toISOString().slice(0, 16),
  status: 'recorded',
};

export default function GameSessionsPage() {
  const { token } = useAuth();
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [escapeRooms, setEscapeRooms] = useState<EscapeRoomOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    Promise.all([api.gameSessions.list(token), api.escapeRooms.list(token)])
      .then(([sessionsRes, roomsRes]) => {
        setSessions((sessionsRes as ListResponse).data);
        setEscapeRooms(
          ((roomsRes as { data: EscapeRoomOption[] }).data || []).map((r) => ({
            id: r.id,
            name: r.name,
            wing: r.wing,
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
      await api.gameSessions.create(token, {
        escapeRoomId: form.escapeRoomId,
        gameType: form.gameType,
        cashAmount: parseFloat(form.cashAmount),
        cardAmount: parseFloat(form.cardAmount),
        addOnRevenue: parseFloat(form.addOnRevenue),
        participants: parseInt(form.participants, 10),
        sessionAt: form.sessionAt,
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
            <h1 className="font-display text-3xl text-primary">Oyun Oturumları</h1>
            <p className="text-muted-foreground">Günlük oyun geliri ve oturum kayıtları</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="mystery-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oturum'}
          </Button>
        </div>

        {showForm && (
          <Card className="mystery-card">
            <CardHeader>
              <CardTitle className="font-display">Oyun Oturumu Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="escapeRoomId">Kaçış Odası</Label>
                  <select
                    id="escapeRoomId"
                    value={form.escapeRoomId}
                    onChange={(e) => update('escapeRoomId', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                    required
                  >
                    <option value="">Oda seçin</option>
                    {escapeRooms.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name} — {r.wing}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gameType">Oyun Tipi</Label>
                  <select
                    id="gameType"
                    value={form.gameType}
                    onChange={(e) => update('gameType', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {GAME_TYPES.map((t) => (
                      <option key={t} value={t}>{formatGameType(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="participants">Katılımcı Sayısı</Label>
                  <Input id="participants" type="number" min={0} value={form.participants} onChange={(e) => update('participants', e.target.value)} />
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
                  <Label htmlFor="addOnRevenue">Ek Gelir ($)</Label>
                  <Input id="addOnRevenue" type="number" min={0} step="0.01" value={form.addOnRevenue} onChange={(e) => update('addOnRevenue', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="sessionAt">Oturum Tarihi</Label>
                  <Input id="sessionAt" type="datetime-local" value={form.sessionAt} onChange={(e) => update('sessionAt', e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select id="status" value={form.status} onChange={(e) => update('status', e.target.value)} className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm">
                    {SESSION_STATUSES.map((s) => (
                      <option key={s} value={s}>{formatSessionStatus(s)}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Button type="submit" disabled={submitting} className="mystery-btn">
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
              <Card key={session.id} className="mystery-card">
                <CardContent className="flex flex-wrap items-center justify-between gap-3 p-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-accent" />
                    <div>
                      <p className="font-semibold">{session.escapeRoom?.name || '—'}</p>
                      <p className="text-xs text-muted-foreground">
                        {session.escapeRoom?.wing} · {formatRoomTheme(session.escapeRoom?.theme || '')} · {formatGameType(session.gameType || '')} · {session.participants} katılımcı
                      </p>
                      <p className="text-xs text-muted-foreground">{formatDateTime(session.sessionAt)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-semibold">
                      {formatCurrency(session.cashAmount + session.cardAmount + session.addOnRevenue)}
                    </span>
                    <Badge variant="secondary">{formatSessionStatus(session.status)}</Badge>
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
