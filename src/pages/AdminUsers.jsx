import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiChevronRight, FiTrash2, FiUserX } from "react-icons/fi";
import { IoMdFemale, IoMdMale } from "react-icons/io";
import { useTranslation } from "react-i18next";

import { useAdminUsers, useDeleteUser } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Pagination, SearchBar, Table } from "../components/dashboard/DataTable";
import { Button } from "../components/ui/Button";
import { Avatar, Badge, EmptyState } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { PageLoader } from "../components/ui/Spinner";

export const AdminUsers = () => {
  const { t, i18n } = useTranslation();
  usePageMeta(t("nav.patients"));
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [deleting, setDeleting] = useState(null);

  const { data, isPending, isFetching } = useAdminUsers({ search, page });
  const deleteUser = useDeleteUser();

  const users = data?.data ?? [];
  const lastPage = data?.last_page ?? 1;

  const columns = [
    { label: t("table.patient") },
    { label: t("fields.phone") },
    { label: t("profile.gender"), align: "center" },
    { label: t("profile.ageRange") },
    { label: t("table.role") },
    { label: t("table.joined") },
    { label: "", align: "right" },
  ];

  const handleDelete = () =>
    deleteUser.mutate(deleting.id, {
      onSuccess: () => {
        flash.show(t("users.deleted"), "success", 3000);
        setDeleting(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, t("users.deleteFailed")), "error", 3000),
    });

  return (
    <div>
      <PageHeader title={t("users.title")} accent={t("users.titleAccent")} description={t("users.lead")} />

      <div className="mb-5 flex">
        <SearchBar
          value={searchInput}
          onChange={setSearchInput}
          onSubmit={() => {
            setSearch(searchInput.trim());
            setPage(1);
          }}
          loading={isFetching && !isPending}
          placeholder={t("users.searchPlaceholder")}
        />
      </div>

      {isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : users.length === 0 ? (
        <EmptyState title={t("users.empty")} description={t("users.emptyHint")} />
      ) : (
        <>
          <Table columns={columns} fetching={isFetching}>
            {users.map((u) => {
              const gender = u.second_registration?.gender;
              const open = () => navigate(`/admin/dashboard/users/${u.id}`);
              return (
                <tr key={u.id} onClick={open} className="cursor-pointer transition-colors hover:bg-primary-50/40">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar user={u} className="size-10 text-xs" rounded="rounded-xl" />
                      <div className="min-w-0">
                        <Link
                          to={`/admin/dashboard/users/${u.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="block truncate font-semibold text-ink-900 hover:underline"
                        >
                          {u.name}
                        </Link>
                        <p className="truncate text-[13px] text-ink-400">{u.email || "—"}</p>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-700" dir="ltr">
                    {u.second_registration?.phone || "—"}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex justify-center">
                      {gender === "Male" ? (
                        <span className="grid size-8 place-items-center rounded-full bg-primary-50 text-primary-500" title={t("answers.Male")}>
                          <IoMdMale />
                        </span>
                      ) : gender === "Female" ? (
                        <span className="grid size-8 place-items-center rounded-full bg-pink-50 text-pink-500" title={t("answers.Female")}>
                          <IoMdFemale />
                        </span>
                      ) : (
                        <span className="text-ink-300">—</span>
                      )}
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-700">
                    {u.second_registration?.ageRange ? t(`answers.${u.second_registration.ageRange}`, u.second_registration.ageRange) : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <Badge value={u.role} />
                  </td>
                  <td className="whitespace-nowrap px-5 py-4 text-ink-500">
                    {new Date(u.created_at).toLocaleDateString(i18n.language, { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                  <td className="px-5 py-4 text-end">
                    <div className="flex items-center justify-end gap-1">
                      {u.role !== "admin" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleting(u);
                          }}
                          title={t("users.deleteUser")}
                          className="inline-grid size-9 place-items-center rounded-xl text-ink-400 transition hover:bg-red-50 hover:text-red-500"
                        >
                          <FiTrash2 className="size-4" />
                        </button>
                      )}
                      <FiChevronRight className="size-4 text-ink-300 rtl:rotate-180" />
                    </div>
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
        title={t("users.deleteTitle")}
        description={deleting && t("users.deleteBody", { name: deleting.name })}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={handleDelete} loading={deleteUser.isPending}>
              {t("users.deleteUser")}
            </Button>
          </>
        }
      />
    </div>
  );
};
