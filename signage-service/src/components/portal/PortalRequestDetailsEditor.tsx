'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from '@/i18n/routing';

import type { PortalRequest } from '@/lib/portal/types';

type EditorCopy = {
  edit: string;
  cancel: string;
  save: string;
  saving: string;
  saved: string;
  unchanged: string;
  saveError: string;
  name: string;
  email: string;
  phone: string;
  address: string;
};

export default function PortalRequestDetailsEditor({
  request,
  copy,
}: {
  request: PortalRequest;
  copy: EditorCopy;
}) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [error, setError] = useState('');
  const [form, setForm] = useState({
    customerName: request.customerName ?? '',
    customerEmail: request.contactEmail ?? '',
    customerPhone: request.contactPhone ?? '',
    serviceLocation: request.serviceLocation ?? '',
  });

  function resetForm() {
    setForm({
      customerName: request.customerName ?? '',
      customerEmail: request.contactEmail ?? '',
      customerPhone: request.contactPhone ?? '',
      serviceLocation: request.serviceLocation ?? '',
    });
    setError('');
    setFeedback('');
  }

  async function saveDetails(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError('');
    setFeedback('');

    try {
      const response = await fetch(`/api/portal/requests/${encodeURIComponent(request.publicRequestNumber)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = (await response.json().catch(() => null)) as {
        success?: boolean;
        changed?: boolean;
        message?: string;
      } | null;

      if (!response.ok || !data?.success) {
        throw new Error(copy.saveError);
      }

      setFeedback(data.changed ? copy.saved : copy.unchanged);
      setIsEditing(false);
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : copy.saveError);
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isEditing) {
    return (
      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#EEF2F6] pt-4">
        <div className="min-h-5 flex-1">
          {feedback && <p className="text-[12px] font-bold text-emerald-700">{feedback}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsEditing(true);
          }}
          className="h-10 rounded-2xl border border-[#D9E0EA] bg-white px-4 text-[13px] font-black text-[#27364A] transition hover:border-[#B8643E] hover:text-[#B8643E]"
        >
          {copy.edit}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={saveDetails} className="mt-5 border-t border-[#EEF2F6] pt-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <label className="grid gap-1">
          <span className="text-[12px] font-black text-[#8A96A8]">{copy.name}</span>
          <input
            value={form.customerName}
            onChange={(event) => setForm((current) => ({ ...current, customerName: event.target.value }))}
            maxLength={160}
            className="h-11 rounded-2xl border border-[#D9E0EA] bg-white px-3 text-[14px] font-semibold text-[#172033] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[12px] font-black text-[#8A96A8]">{copy.email}</span>
          <input
            type="email"
            value={form.customerEmail}
            onChange={(event) => setForm((current) => ({ ...current, customerEmail: event.target.value }))}
            maxLength={254}
            className="h-11 rounded-2xl border border-[#D9E0EA] bg-white px-3 text-[14px] font-semibold text-[#172033] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[12px] font-black text-[#8A96A8]">{copy.phone}</span>
          <input
            value={form.customerPhone}
            onChange={(event) => setForm((current) => ({ ...current, customerPhone: event.target.value }))}
            maxLength={80}
            className="h-11 rounded-2xl border border-[#D9E0EA] bg-white px-3 text-[14px] font-semibold text-[#172033] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10"
          />
        </label>
        <label className="grid gap-1">
          <span className="text-[12px] font-black text-[#8A96A8]">{copy.address}</span>
          <input
            value={form.serviceLocation}
            onChange={(event) => setForm((current) => ({ ...current, serviceLocation: event.target.value }))}
            maxLength={500}
            className="h-11 rounded-2xl border border-[#D9E0EA] bg-white px-3 text-[14px] font-semibold text-[#172033] outline-none transition focus:border-[#B8643E] focus:ring-4 focus:ring-[#B8643E]/10"
          />
        </label>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <div className="min-h-5 flex-1">
          {error && <p className="text-[12px] font-bold text-[#A94732]">{error}</p>}
        </div>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setIsEditing(false);
          }}
          className="h-10 rounded-2xl border border-[#D9E0EA] bg-white px-4 text-[13px] font-black text-[#27364A] transition hover:border-[#B8643E] hover:text-[#B8643E]"
          disabled={isSubmitting}
        >
          {copy.cancel}
        </button>
        <button
          type="submit"
          className="h-10 rounded-2xl bg-[#B8643E] px-4 text-[13px] font-black text-white transition hover:bg-[#A65835] disabled:opacity-60"
          disabled={isSubmitting}
        >
          {isSubmitting ? copy.saving : copy.save}
        </button>
      </div>
    </form>
  );
}
