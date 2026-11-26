import { useState } from "react";
import { FiTrash2, FiUserX } from "react-icons/fi";
import { IoMdFemale, IoMdMale } from "react-icons/io";

import { useAdminUsers, useDeleteUser } from "../hooks/useAdmin";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, SearchBar, Table } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Avatar, Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

const columns = [
  { label: "Patient" },
  { label: "Phone" },
  { label: "Gender", align: "center" },
  { label: "Age range" },
  { label: "Role" },
  { label: "Joined" },
  { label: "", align: "right" },
];

export const AdminUsers = () => {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminUsers({ search, page });
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const handleDelete = () =>
    deleteUser.mutate(deleting.id, {
      onSuccess: () => {
        flash.show("User deleted successfully", "success", 3000);
        setDeleting(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, "Error deleting user"), "error", 3000),
    });

  return (
    <div>
      <PageHeader title="Patient" accent="directory" description="Everyone registered with the clinic." />

      <div className="mb-5 flex">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => {
            setSearch(searchInput.trim());
            setPage(1);
          }}
          loading={isFetching && !isPending}
          placeholder="Search by name or email"
        />
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : users.length === 0 ? (
        <EmptyState title="No users found" description="Try a different name or email." />
      ) : (
        <>
          <Table columns={columns} fetching={isFetching}>
            {users.map((u) => {
              const gender = u.second_registration?.gender;
              return (
                <tr key={u.id} className="transition-colors hover:bg-primary-50/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} className="size-10 text-[13px]" rounded="rounded-xl" />
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-ink-900">{u.name}</p>
                        <p className="truncate text-[13px] text-ink-400">{u.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-700">{u.second_registration?.phone || "—"}</td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {gender === "Male" ? (
                        <span className="grid size-8 place-items-center rounded-full bg-primary-50 text-primary-500" title="Male">
                          <IoMdMale />
                        </span>
                      ) : gender === "Female" ? (
                        <span className="grid size-8 place-items-center rounded-full bg-pink-50 text-pink-500" title="Female">
                          <IoMdFemale />
                        </span>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-700">{u.second_registration?.ageRange || "—"}</td>
                  <td className="px-5 py-4">
                    <Badge value={u.role} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-500">
                    {new Date(u.created_at).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-right">
                    {u.role !== "admin" && (
                      <button
                        onClick={() => setDeleting(u)}
                        title="Delete user"
                        className="inline-grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                      >
                        <FiTrash2 className="size-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </Table>
          <Pagination page={page} lastPage={lastPage} total={data?.total} onChange={setPage} disabled={isFetching} />
        </>
      )}

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiUserX}
        tone="danger"
        title="Delete this user?"
        description={deleting && `${deleting.name} and their data will be permanently removed. This cannot be undone.`}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteUser.isPending}>
              Delete user
            </Button>
          </>
        }
      />
    </div>
  );
};
