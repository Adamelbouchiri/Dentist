import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FiArrowLeft, FiClock, FiFileText, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAddPatientNote, useAdminUser, useDeletePatientNote } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { ProfileHeader } from "../components/dashboard/ProfileHeader";
import { HealthRecord } from "../components/dashboard/HealthRecord";
import { Button } from "../components/ui/Button";
import { Textarea } from "../components/ui/Field";
import { Avatar, Badge, Card, EmptyState, NotImplemented } from "../components/ui/Misc";
import { PageLoader } from "../components/ui/Spinner";

export const AdminPatient = () => {
  const { t, i18n } = useTranslation();
  const { id } = useParams();
  const { data, isPending, isError } = useAdminUser(id);
  const addNote = useAddPatientNote(id);
  const deleteNote = useDeletePatientNote(id);
  const [note, setNote] = useState("");
  usePageMeta(data?.user?.name ?? t("nav.patients"));
  const locale = i18n.language;

  const back = (
    <Link to="/admin/dashboard/users" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-ink-900">
      <FiArrowLeft className="rtl:rotate-180" /> {t("patient.back")}
    </Link>
  );

  if (isPending) return <PageLoader className="h-[60vh]" />;
  if (data?.notImplemented)
    return (
      <div>
        {back}
        <NotImplemented endpoint={`GET /api/admin/users/${id}`} />
      </div>
    );
  if (isError || !data?.user)
    return (
      <div>
        {back}
        <EmptyState title={t("patient.notFound")} />
      </div>
    );

  const { user, second_registration, appointments = [], notes = [] } = data;
  const sorted = [...appointments].sort((a, b) => `${b.date}${b.time}`.localeCompare(`${a.date}${a.time}`));
  const spent = appointments.filter((a) => a.payment_status === "paid").reduce((s, a) => s + Number(a.price || 0), 0);

  const submitNote = (e) => {
    e.preventDefault();
    if (!note.trim()) return;
    addNote.mutate(note.trim(), {
      onSuccess: () => setNote(""),
      onError: (err) => flash.show(getErrorMessage(err, t("patient.noteFailed")), "error", 3500),
    });
  };

  return (
    <div className="space-y-6">
      {back}
      <ProfileHeader
        user={user}
        action={
          <div className="flex gap-6 md:text-end">
            <div>
              <p className="text-2xl font-semibold tracking-tight text-ink-900">{appointments.length}</p>
              <p className="text-[13px] text-ink-400">{t("patient.visits")}</p>
            </div>
            <div>
              <p className="text-2xl font-semibold tracking-tight text-ink-900">${spent.toLocaleString(locale)}</p>
              <p className="text-[13px] text-ink-400">{t("patient.paid")}</p>
            </div>
          </div>
        }
      />

      <div className="grid gap-6 2xl:grid-cols-[1fr_420px]">
        <div className="space-y-6">
          {second_registration ? (
            <HealthRecord user={user} record={second_registration} />
          ) : (
            <EmptyState compact title={t("patient.noRecord")} />
          )}

          <Card className="p-6 md:p-8">
            <h3 className="text-lg font-semibold tracking-tight text-ink-900">{t("patient.history")}</h3>
            {sorted.length ? (
              <ul className="mt-5 divide-y divide-ink-100">
                {sorted.map((a) => (
                  <li key={a.id} className="flex flex-wrap items-center gap-x-4 gap-y-2 py-3.5">
                    <span className="w-28 text-sm font-semibold text-ink-900">
                      {new Date(`${a.date}T00:00:00`).toLocaleDateString(locale, { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="inline-flex items-center gap-1 text-[13px] text-ink-500" dir="ltr">
                      <FiClock className="size-3" /> {a.time?.slice(0, 5)}
                    </span>
                    <span className="min-w-0 flex-1 truncate text-sm text-ink-700">
                      {a.service} · {a.doctor}
                    </span>
                    <Badge value={a.status} />
                    <span className="w-16 text-end text-sm font-semibold text-ink-900">${a.price}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-ink-500">{t("patient.noAppointments")}</p>
            )}
          </Card>
        </div>

        {/* Private notes */}
        <Card className="h-fit p-6 md:p-8 2xl:sticky 2xl:top-28">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-2xl bg-primary-50 text-primary-500">
              <FiFileText className="size-4" />
            </span>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-ink-900">{t("patient.notes")}</h3>
              <p className="text-[13px] text-ink-400">{t("patient.notesHint")}</p>
            </div>
          </div>

          <form onSubmit={submitNote} className="mt-6 space-y-3">
            <Textarea
              placeholder={t("patient.notePlaceholder")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="[&_textarea]:min-h-28"
            />
            <Button type="submit" size="sm" disabled={!note.trim()} loading={addNote.isPending}>
              {t("patient.addNote")}
            </Button>
          </form>

          <ul className="mt-6 space-y-3">
            {notes.map((n) => (
              <li key={n.id} className="group rounded-2xl bg-ink-50/70 p-4 ring-1 ring-ink-100">
                <p className="whitespace-pre-wrap text-sm text-ink-800">{n.body}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className="flex items-center gap-2 text-xs text-ink-400">
                    <Avatar user={n.author} className="size-5 text-[9px]" />
                    {n.author?.name} · {new Date(n.created_at).toLocaleDateString(locale, { day: "numeric", month: "short" })}
                  </span>
                  <button
                    onClick={() => deleteNote.mutate(n.id)}
                    aria-label={t("common.delete")}
                    className="rounded-lg p-1.5 text-ink-300 opacity-0 transition hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 focus:opacity-100"
                  >
                    <FiTrash2 className="size-3.5" />
                  </button>
                </div>
              </li>
            ))}
            {!notes.length && <li className="text-center text-sm text-ink-400">{t("patient.noNotes")}</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
};
