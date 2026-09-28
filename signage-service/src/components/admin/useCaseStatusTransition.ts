'use client';

import { useEffect, useRef, useState } from 'react';
import type { CaseStatus } from '@prisma/client';
import { adminFetch } from '@/lib/admin-fetch';
import type { CaseStatusSnapshot, CaseTransitionInput, CaseTransitionResult } from '@/lib/case-transition-types';

type Run = { id: string; input: CaseTransitionInput };
const errors: Record<string, string> = {
  status_conflict: 'Статус изменён в другом окне. Переход остановлен. Проверьте актуальное состояние заявки.',
  step_conflict: 'Этот шаг уже выполнен с другими данными. Обновите состояние заявки.',
  version_conflict: 'Отчёт изменён в другом окне. Ваши поля сохранены на экране. Обновите данные перед продолжением.',
  work_result_required: 'Чтобы завершить ремонт, добавьте итоговую фотографию и проверьте дату выполнения.',
  owner_required: 'Исключение без итоговой фотографии должен подтвердить владелец.',
  request_number_required: 'Сначала оформите заявку и присвойте ей номер.',
  invalid_status: 'Этот переход сейчас недоступен. Проверьте актуальное состояние заявки.',
  invalid_input: 'Проверьте заполнение обязательных полей.',
  rate_limited: 'Слишком много действий. Повторите через минуту.',
};

export class TransitionRequestError extends Error {
  constructor(public code: string, public fields: string[] = []) {
    super(errors[code] || 'Не удалось выполнить шаг. Повторите запрос; выполненные этапы сохранены.');
  }
}

export default function useCaseStatusTransition(caseId: string, refresh: () => Promise<void>) {
  const active = useRef<Run | null>(null);
  const refreshRef = useRef(refresh);
  useEffect(() => { refreshRef.current = refresh; }, [refresh]);
  useEffect(() => () => { active.current = null; }, [caseId]);
  const [target, setTarget] = useState<CaseStatus | null>(null);
  const [requirement, setRequirement] = useState<CaseTransitionResult['requirement']>();
  const [busy, setBusy] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [retryable, setRetryable] = useState(false);

  function finish(message: string) {
    active.current = null; setTarget(null); setRequirement(undefined); setRetryable(false); setBusy(false); setFeedback(message);
  }
  function stop() {
    finish('Переход остановлен. Заявка остаётся на последнем выполненном этапе.');
    void refreshRef.current();
  }
  async function request(input: CaseTransitionInput): Promise<CaseTransitionResult> {
    const response = await adminFetch('/api/admin/cases/' + caseId + '/status-transition', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
    });
    const body = await response.json().catch(() => null);
    if (!response.ok) throw new TransitionRequestError(body?.code || (response.status === 404 ? 'status_conflict' : 'operation_failed'), body?.missingFields);
    if (!body?.state || !body?.outcome) throw new TransitionRequestError('operation_failed');
    return body;
  }
  async function apply(run: Run, result: CaseTransitionResult) {
    await refreshRef.current();
    if (active.current !== run) return;
    if (result.outcome === 'requires_input') {
      setRequirement(result.requirement); setBusy(false); return;
    }
    if (result.outcome === 'done') { finish('Выбранный статус установлен.'); return; }
    setRequirement(undefined);
    run.input = { targetStatus: run.input.targetStatus, expected: result.state, stepId: crypto.randomUUID() };
    await drive(run);
  }
  async function drive(run: Run) {
    if (active.current !== run) return;
    setBusy(true); setRetryable(false); setFeedback('');
    try {
      const result = await request(run.input);
      await apply(run, result);
    } catch (error) {
      if (active.current !== run) return;
      const failure = error instanceof TransitionRequestError ? error : new TransitionRequestError('operation_failed');
      if (['status_conflict', 'step_conflict', 'invalid_status', 'request_number_required'].includes(failure.code)) {
        finish(failure.message); await refreshRef.current();
      } else {
        setBusy(false); setFeedback(failure.message); setRetryable(true);
      }
    }
  }
  function start(targetStatus: CaseStatus, expected: CaseStatusSnapshot) {
    if (active.current) return;
    const run: Run = { id: crypto.randomUUID(), input: { targetStatus, expected, stepId: crypto.randomUUID() } };
    active.current = run; setTarget(targetStatus); setRequirement(undefined);
    void drive(run);
  }
  async function confirm(confirmation: NonNullable<CaseTransitionInput['confirmation']>) {
    const run = active.current;
    if (!run) throw new TransitionRequestError('status_conflict');
    run.input = { ...run.input, confirmation };
    setBusy(true); setFeedback(''); setRetryable(false);
    try {
      const result = await request(run.input);
      // Do not publish or progress the following step after cancellation.
      await apply(run, result);
    } catch (error) {
      if (active.current !== run) throw error;
      setBusy(false);
      const failure = error instanceof TransitionRequestError ? error : new TransitionRequestError('operation_failed');
      if (['status_conflict', 'step_conflict', 'invalid_status'].includes(failure.code)) {
        finish(failure.message); await refreshRef.current();
      }
      throw failure;
    }
  }
  return { target, requirement, busy, feedback, retryable, start, stop,
    retry: () => { if (active.current) void drive(active.current); },
    publishReport: (version: number) => confirm({ kind: 'work_result', version }),
    submitReason: (reason: string) => confirm({ kind: 'reason', reason }),
  };
}
