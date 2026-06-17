'use client';

import { useEffect, useState } from 'react';
import { Plus, Trash2, DoorOpen } from 'lucide-react';
import { AppLayout } from '@/components/app-layout';
import { LoadingSpinner, ErrorState, EmptyState } from '@/components/states';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/lib/auth-context';
import { api } from '@/lib/api';
import { formatRoomStatus, formatRoomTheme } from '@/lib/utils';

interface EscapeRoomItem {
  id: string;
  name: string;
  wing: string;
  theme: string;
  puzzleMechanism?: string;
  status: string;
}

interface ListResponse {
  data: EscapeRoomItem[];
  total: number;
}

const ROOM_THEMES = ['horror', 'mystery', 'sci_fi', 'historical', 'fantasy', 'adventure'];
const STATUSES = ['available', 'in_game', 'resetting', 'maintenance', 'closed'];

const emptyForm = {
  name: '',
  wing: '',
  theme: 'mystery',
  puzzleMechanism: '',
  status: 'available',
};

export default function EscapeRoomsPage() {
  const { token } = useAuth();
  const [rooms, setRooms] = useState<EscapeRoomItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);

  const load = () => {
    if (!token) return;
    setLoading(true);
    setError(false);
    api.escapeRooms
      .list(token)
      .then((res) => setRooms((res as ListResponse).data))
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
      await api.escapeRooms.create(token, {
        name: form.name,
        wing: form.wing,
        theme: form.theme,
        puzzleMechanism: form.puzzleMechanism || undefined,
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

  const handleDelete = async (id: string) => {
    if (!token || !confirm('Bu odayı silmek istediğinize emin misiniz?')) return;
    try {
      await api.escapeRooms.delete(token, id);
      load();
    } catch {
      setError(true);
    }
  };

  const update = (field: string, value: string) => setForm((f) => ({ ...f, [field]: value }));

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl text-primary">Kaçış Odaları</h1>
            <p className="text-muted-foreground">Korku, gizem, bilim kurgu ve macera temalı oda envanteri</p>
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="mystery-btn">
            <Plus className="mr-2 h-4 w-4" />
            {showForm ? 'İptal' : 'Yeni Oda'}
          </Button>
        </div>

        {showForm && (
          <Card className="mystery-card">
            <CardHeader>
              <CardTitle className="font-display">Oda Ekle</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="name">Oda Adı</Label>
                  <Input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required placeholder="Örn: The Crypt" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="wing">Kanat / Kat</Label>
                  <Input id="wing" value={form.wing} onChange={(e) => update('wing', e.target.value)} required placeholder="Örn: Basement Wing" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Tema</Label>
                  <select
                    id="theme"
                    value={form.theme}
                    onChange={(e) => update('theme', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {ROOM_THEMES.map((t) => (
                      <option key={t} value={t}>{formatRoomTheme(t)}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="puzzleMechanism">Bulmaca Mekanizması</Label>
                  <Input
                    id="puzzleMechanism"
                    value={form.puzzleMechanism}
                    onChange={(e) => update('puzzleMechanism', e.target.value)}
                    placeholder="Örn: RFID kilit zinciri + basınç plakaları"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Durum</Label>
                  <select
                    id="status"
                    value={form.status}
                    onChange={(e) => update('status', e.target.value)}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 text-sm"
                  >
                    {STATUSES.map((s) => (
                      <option key={s} value={s}>{formatRoomStatus(s)}</option>
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
        {error && !loading && rooms.length === 0 && <ErrorState onRetry={load} />}
        {!loading && !error && rooms.length === 0 && (
          <EmptyState
            title="Oda bulunamadı"
            description="Henüz kaçış odası eklenmemiş."
            action={
              <Button onClick={() => setShowForm(true)} className="mystery-btn">
                <Plus className="mr-2 h-4 w-4" />
                Oda Ekle
              </Button>
            }
          />
        )}
        {!loading && rooms.length > 0 && (
          <div className="grid gap-3 sm:grid-cols-2">
            {rooms.map((room) => (
              <Card key={room.id} className="mystery-card">
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent/15 text-accent">
                      <DoorOpen className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div>
                      <p className="font-display text-lg">{room.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {room.wing} · {formatRoomTheme(room.theme)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {room.puzzleMechanism || 'Mekanizma belirtilmemiş'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">{formatRoomStatus(room.status)}</Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(room.id)}
                      className="text-destructive"
                      aria-label="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
