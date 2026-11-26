import { useState } from "react";
import { FiEdit2, FiTrash2, FiCalendar } from "react-icons/fi";

import {
  useAdminAppointments,
  useDeleteAdminAppointment,
  useUpdateAppointmentStatus,
} from "../hooks/useAdmin";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, SearchBar, Segmented, Table } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Select } from "../components/ui/Field";
import { Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

const periods = [
  { value: "today", label: "Today" },
  { value: "week", label: "This week" },
  { value: "month", label: "This month" },
];

const columns = [
  { label: "Patient" },
  { label: "Doctor" },
  { label: "Service" },
  { label: "Date & time" },
  { label: "Status" },
  { label: "Payment" },
  { label: "Price", align: "right" },
  { label: "", align: "right" },
];

export const AdminAppointments = () => {
  const [filter, setFilter] = useState("today");
  const [status, setStatus] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const [editing, setEditing] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminAppointments({ filter, status, search, page });
  const updateStatus = useUpdateAppointmentStatus();
  const deleteAppointment = useDeleteAdminAppointment();

  const appointments = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const changeFilter = (setter) => (value) => {
    setter(value);
    setPage(1);
  };

  const handleSaveStatus = () => {
    if (!newStatus) return flash.show("Please select a status", "error", 3000);
    updateStatus.mutate(
      { id: editing.id, status: newStatus },
      {
        onSuccess: () => {
          flash.show("Appointment updated", "success", 3000);
          setEditing(null);
        },
        onError: (e) => flash.show(getErrorMessage(e, "Error updating status"), "error", 3000),
      }
    );
  };

  const handleDelete = () =>
    deleteAppointment.mutate(deleting.id, {
      onSuccess: () => {
        flash.show("Appointment deleted", "success", 3000);
        setDeleting(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, "Error deleting appointment"), "error", 3000),
    });

  return (
    <div>
      <PageHeader title="Patient" accent="appointments" description="Review, update and manage every booking." />

      <div className="mb-5 flex flex-col gap-3 xl:flex-row xl:items-center">
        <Segmented options={periods} value={filter} onChange={changeFilter(setFilter)} />
        <Select value={status} onChange={(e) => changeFilter(setStatus)(e.target.value)} className="xl:w-48">
          <option value="all">All statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
          <option value="scheduled">Scheduled</option>
        </Select>
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => {
            setSearch(searchInput.trim());
            setPage(1);
          }}
          loading={isFetching && !isPending}
          placeholder="Search by patient name or phone"
        />
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : appointments.length === 0 ? (
        <EmptyState title="No appointments found" description="Try another period, status or search term." />
      ) : (
        <>
          <Table columns={columns} fetching={isFetching}>
            {appointments.map((a) => (
              <tr key={a.id} className="transition-colors hover:bg-primary-50/40">
                <td className="px-5 py-4">
                  <p className="font-semibold text-ink-900">{a.user?.name}</p>
                  <p className="text-[13px] text-ink-400">{a.user?.email}</p>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-ink-700">{a.doctor}</td>
                <td className="whitespace-nowrap px-5 py-4 text-ink-700">{a.service}</td>
                <td className="whitespace-nowrap px-5 py-4">
                  <p className="font-medium text-ink-900">{a.date}</p>
                  <p className="text-[13px] text-ink-400">{a.time?.slice(0, 5)}</p>
                </td>
                <td className="px-5 py-4">
                  <Badge value={a.status} />
                </td>
                <td className="px-5 py-4">
                  <Badge value={a.payment_status} />
                </td>
                <td className="px-5 py-4 text-right font-semibold text-ink-900">${a.price}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-1">
                    <button
                      onClick={() => {
                        setEditing(a);
                        setNewStatus(a.status);
                      }}
                      title="Edit status"
                      className="grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-primary-50 hover:text-primary-500"
                    >
                      <FiEdit2 className="size-4" />
                    </button>
                    <button
                      onClick={() => setDeleting(a)}
                      title="Delete"
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
        title="Update status"
        description={editing && `${editing.user?.name} · ${editing.service} on ${editing.date}`}
        footer={
          <>
            <Button variant="outline" onClick={() => setEditing(null)}>
              Cancel
            </Button>
            <Button onClick={handleSaveStatus} loading={updateStatus.isPending}>
              Save status
            </Button>
          </>
        }
      >
        <Select label="Status" value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
          <option value="">Select status</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
          <option value="scheduled">Scheduled</option>
        </Select>
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiTrash2}
        tone="danger"
        title="Delete appointment?"
        description={deleting && `${deleting.user?.name}'s ${deleting.service} on ${deleting.date} will be permanently removed.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteAppointment.isPending}>
              Delete
            </Button>
          </>
        }
      />
    </div>
  );
};
