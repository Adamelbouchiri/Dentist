import { useState } from "react";
import { Link } from "react-router-dom";
import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminAppointments, useDeleteAdminAppointment, useUpdateAdminAppointment } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, SearchBar, Segmented, Table } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

const STATUSES = ["pending", "scheduled", "upcoming", "confirmed", "completed", "cancelled"];

export const AdminAppointments = () => {
  const { t } = useTranslation();
  usePageMeta(t("nav.appointments"));

  const [filter, setFilter] = useState("today");
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminAppointments({ filter, status, search, page });
  const updateStatus = useUpdateAdminAppointment();
  const deleteAppointment = useDeleteAdminAppointment();

  const appointments = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const columns = [
    { label: t("table.patient") },
    { label: t("table.doctor") },
    { label: t("table.service") },
    { label: t("table.dateTime") },
    { label: t("table.status") },
    { label: t("table.payment") },
    { label: t("table.price"), align: "right" },
    { label: "", align: "right" },
  ];

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSaveStatus = () => {
    if (!newStatus) return flash.show(t("adminAppointments.pickStatus"), "error", 3000);
    updateStatus.mutate(
      { id: editing.id, status: newStatus },
      {
        onSuccess: () => {
          flash.show(t("adminAppointments.updated"), "success", 3000);
          setEditing(null);
        },
        onError: (e) => flash.show(getErrorMessage(e, t("adminAppointments.updateFailed")), "error", 3000),
      }
    );
  };

  const handleDelete = () =>
    deleteAppointment.mutate(deleting.id, {
      onSuccess: () => {
        flash.show(t("appointments.deleted"), "success", 3000);
        setDeleting(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, t("appointments.deleteFailed")), "error", 3000),
    });

  return (
    <div>
      <PageHeader title={t("adminAppointments.title")} accent={t("adminAppointments.titleAccent")} description={t("adminAppointments.lead")} />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <Segmented
          options={[
            { value: "today", label: t("adminAppointments.today") },
            { value: "week", label: t("adminAppointments.week") },
            { value: "month", label: t("adminAppointments.month") },
          ]}
          value={filter}
          onChange={changeFilter(setFilter)}
        />
        <Select value={status} onChange={(e) => changeFilter(setStatus)(e.target.value)} className="xl:w-48">
          <option value="all">{t("adminAppointments.allStatuses")}</option>
          {["pending", "confirmed", "cancelled", "scheduled"].map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </Select>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => {
            setSearch(searchInput.trim());
            setPage(1);
          }}
          loading={isFetching && !isPending}
          placeholder={t("adminAppointments.searchPlaceholder")}
        />
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : appointments.length === 0 ? (
        <EmptyState title={t("adminAppointments.empty")} description={t("adminAppointments.emptyHint")} />
      ) : (
        <>
          <Table columns={columns} fetching={isFetching}>
            {appointments.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-primary-50/40">
                <td className="px-5 py-4">
                  <Link to={`/admin/dashboard/users/${a.user?.id ?? a.user_id}`} className="font-semibold text-ink-900 hover:underline">
                    {a.user?.name}
                  </Link>
                  <p className="text-[13px] text-ink-400">{a.user?.email}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-ink-700">{a.doctor}</td>
                <td className="whitespace-nowrap px-5 py-4 text-ink-700">{a.service}</td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-medium text-ink-900">{a.date}</p>
                  <p className="text-[13px] text-ink-400" dir="ltr">{a.time?.slice(0, 5)}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge value={a.status} />
                </td>
                <td className="px-5 py-4">
                  <Badge value={a.payment_status} />
                </td>
                <td className="px-5 py-4 text-end font-semibold text-ink-900">${a.price}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(a);
                        setNewStatus(a.status);
                      }}
                      title={t("adminAppointments.editStatus")}
                      className="grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-primary-50 hover:text-primary-500"
                    >
                      <FiEdit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(a)}
                      title={t("common.delete")}
                      className="grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                    >
                      <FiTrash2 className="size-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </Table>
          <Pagination page={page} lastPage={lastPage} total={data?.total} onChange={setPage} disabled={isFetching} />
        </>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        icon={FiCalendar}
        title={t("adminAppointments.updateTitle")}
        description={editing && `${editing.user?.name} · ${editing.service} · ${editing.date}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              {t("common.cancel")}
            </Button>
            <Button onClick={handleSaveStatus} loading={updateStatus.isPending}>
              {t("adminAppointments.saveStatus")}
            </Button>
          </>
        }
      >
        <Select label={t("table.status")} value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">{t("adminAppointments.pickStatus")}</option>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {t(`status.${s}`)}
            </option>
          ))}
        </Select>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiTrash2}
        tone="danger"
        title={t("adminAppointments.deleteTitle")}
        description={deleting && t("adminAppointments.deleteBody", { name: deleting.user?.name, service: deleting.service, date: deleting.date })}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteAppointment.isPending}>
              {t("common.delete")}
            </Button>
          </>
        }
      />
    </div>
  );
};
