import { useState } from "react";
import { FiCheck, FiEyeOff, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminReviews, useDeleteReview, useModerateReview } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, Segmented } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Avatar, Badge, EmptyState, NotImplemented } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";
import { StarRating } from "../components/ui/StarRating";

export const AdminReviews = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.reviewsAdmin"));
  const [status, setStatus] = useState("pending");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminReviews({ status, page });
  const moderate = useModerateReview();
  const remove = useDeleteReview();
  const reviews = data?.data ?? [];

  const onError = (e) => flash.show(getErrorMessage(e, t("common.somethingWrong")), "error", 3500);

  const setApproved = (r, approved) =>
    moderate.mutate(
      { id: r.id, approved },
      { onSuccess: () => flash.show(approved ? t("reviewsAdmin.approved") : t("reviewsAdmin.hidden"), "success", 2500), onError }
    );

  return (
    <div>
      <PageHeader title={t("reviewsAdmin.title")} accent={t("reviewsAdmin.titleAccent")} description={t("reviewsAdmin.lead")} />

      <div className="mb-5">
        <Segmented
          options={[
            { value: "pending", label: t("status.pending") },
            { value: "approved", label: t("status.approved") },
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
        <NotImplemented endpoint="GET /api/admin/reviews" />
      ) : reviews.length === 0 ? (
        <EmptyState title={status === "pending" ? t("reviewsAdmin.emptyPending") : t("reviewsAdmin.emptyApproved")} />
      ) : (
        <>
          <div className={`grid gap-4 xl:grid-cols-2 transition-opacity ${isFetching ? "opacity-60" : ""}`}>
            {reviews.map((r) => (
              <article key={r.id} className="flex flex-col rounded-3xl bg-white p-6 shadow-soft ring-1 ring-ink-200/70">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Avatar user={r.user} className="size-11" rounded="rounded-xl" />
                    <div>
                      <p className="font-semibold text-ink-900">{r.user?.name}</p>
                      <p className="text-[13px] text-ink-400">
                        {r.appointment?.service ?? r.service} ·{" "}
                        {new Date(r.created_at).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <Badge value={r.approved ? "approved" : "pending"} />
                </div>
                <div className="mt-4">
                  <StarRating value={r.rating} readOnly size="size-4" />
                </div>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-ink-700">“{r.comment}”</p>
                <div className="mt-5 flex flex-wrap gap-2 border-t border-ink-100 pt-4">
                  {r.approved ? (
                    <Button size="xs" variant="outline" onClick={() => setApproved(r, false)}>
                      <FiEyeOff /> {t("reviewsAdmin.hide")}
                    </Button>
                  ) : (
                    <Button size="xs" onClick={() => setApproved(r, true)}>
                      <FiCheck /> {t("reviewsAdmin.approve")}
                    </Button>
                  )}
                  <Button size="xs" variant="danger-soft" onClick={() => setDeleting(r)}>
                    <FiTrash2 /> {t("common.delete")}
                  </Button>
                </div>
              </article>
            ))}
          </div>
          <Pagination page={page} lastPage={data?.last_page ?? 1} total={data?.total} onChange={setPage} disabled={isFetching} />
        </>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiTrash2}
        tone="danger"
        title={t("reviewsAdmin.deleteTitle")}
        description={t("common.cannotUndo")}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button
              variant="danger"
              loading={remove.isPending}
              onClick={() => remove.mutate(deleting.id, { onSuccess: () => setDeleting(null), onError })}
            >
              {t("common.delete")}
            </Button>
          </>
        }
      />
    </div>
  );
};
