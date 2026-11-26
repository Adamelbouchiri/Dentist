import { useState } from "react";
import { FiMail, FiPhone, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminMessages, useDeleteMessage, useUpdateMessage } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, Segmented } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Card, EmptyState, NotImplemented } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

export const AdminMessages = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.messages"));
  const [status, setStatus] = useState("unread");
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminMessages({ status, page });
  const update = useUpdateMessage();
  const remove = useDeleteMessage();
  const messages = data?.data ?? [];

  const openMessage = (m) => {
    setOpen(m);
    if (!m.read_at) update.mutate({ id: m.id, read: true });
  };

  const handleDelete = () =>
    remove.mutate(deleting.id, {
      onSuccess: () => {
        flash.show(t("messages.deleted"), "success", 3000);
        setDeleting(null);
        setOpen(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, t("messages.deleteFailed")), "error", 3500),
    });

  const fmt = (d) =>
    new Date(d).toLocaleString(i18n.language, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

  return (
    <div>
      <PageHeader title={t("messages.title")} accent={t("messages.titleAccent")} description={t("messages.lead")} />

      <div className="mb-5">
        <Segmented
          options={[
            { value: "unread", label: t("messages.unread") },
            { value: "all", label: t("messages.all") },
          ]}
          value={status}
          onChange={(v) => {
            setStatus(v);
            setPage(1);
          }}
        />
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : data?.notImplemented ? (
        <NotImplemented endpoint="GET /api/admin/contact-messages" />
      ) : messages.length === 0 ? (
        <EmptyState title={t("messages.empty")} />
      ) : (
        <>
          <Card className={`divide-y divide-ink-100 overflow-hidden transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {messages.map((m) => (
              <button
                key={m.id}
                onClick={() => openMessage(m)}
                className="flex w-full items-start gap-4 px-5 py-4 text-start transition hover:bg-primary-50/40"
              >
                <span className={`mt-2 size-2 shrink-0 rounded-full ${m.read_at ? "bg-transparent" : "bg-primary-500"}`} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-3">
                    <p className={`truncate text-sm ${m.read_at ? "font-medium text-ink-700" : "font-semibold text-ink-900"}`}>{m.name}</p>
                    <span className="shrink-0 text-xs text-ink-400">{fmt(m.created_at)}</span>
                  </div>
                  <p className="truncate text-[13px] text-ink-400">{m.email}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-ink-600">{m.message}</p>
                </div>
              </button>
            ))}
          </Card>
          <Pagination page={page} lastPage={data?.last_page ?? 1} total={data?.total} onChange={setPage} disabled={isFetching} />
        </>
      )}

      <Modal
        open={!!open}
        onClose={() => setOpen(null)}
        icon={FiMail}
        size="lg"
        title={open?.name}
        description={open && fmt(open.created_at)}
        footer={
          open && (
            <>
              <Button variant="danger-soft" onClick={() => setDeleting(open)}>
                <FiTrash2 /> {t("common.delete")}
              </Button>
              <Button variant="outline" onClick={() => update.mutate({ id: open.id, read: false }, { onSuccess: () => setOpen(null) })}>
                {t("messages.markUnread")}
              </Button>
              <Button href={`mailto:${open.email}`}>{t("messages.reply")}</Button>
            </>
          )
        }
      >
        {open && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-2 text-[13px]">
              <a href={`mailto:${open.email}`} className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-ink-700 ring-1 ring-ink-100" dir="ltr">
                <FiMail className="size-3.5" /> {open.email}
              </a>
              {open.phone && (
                <a href={`tel:${open.phone}`} className="inline-flex items-center gap-1.5 rounded-full bg-ink-50 px-3 py-1.5 text-ink-700 ring-1 ring-ink-100" dir="ltr">
                  <FiPhone className="size-3.5" /> {open.phone}
                </a>
              )}
            </div>
            <p className="whitespace-pre-wrap rounded-2xl bg-ink-50/60 p-5 text-[15px] leading-relaxed text-ink-800 ring-1 ring-ink-100">
              {open.message}
            </p>
          </div>
        )}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiTrash2}
        tone="danger"
        title={t("messages.deleteTitle")}
        description={t("common.cannotUndo")}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={remove.isPending}>
              {t("common.delete")}
            </Button>
          </>
        }
      />
    </div>
  );
};
