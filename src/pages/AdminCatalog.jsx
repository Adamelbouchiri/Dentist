import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { FiEdit2, FiImage, FiPlus, FiStar, FiTrash2, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

import { useAdminDoctors, useAdminServices } from "../hooks/useAdmin";
import { usePageMeta } from "../hooks/usePageMeta";
import { getErrorMessage } from "../lib/api";
import { applyServerErrors } from "../lib/schemas";
import { flash } from "../utils/flash";
import { PageHeader } from "../components/dashboard/DashboardShell";
import { Segmented } from "../components/dashboard/DataTable";
import { DEFAULT_HOURS, WorkingHoursEditor } from "../components/dashboard/WorkingHoursEditor";
import { Button } from "../components/ui/Button";
import { Input, Label, Switch, Textarea } from "../components/ui/Field";
import { Badge, EmptyState, NotImplemented } from "../components/ui/Misc";
import { Modal } from "../components/ui/Modal";
import { DoctorPhoto } from "../components/ui/DoctorPhoto";
import { PageLoader } from "../components/ui/Spinner";

const serviceSchema = z.object({
  name: z.string().trim().min(2, "validation.nameMin"),
  slug: z
    .string()
    .trim()
    .min(2, "validation.required")
    .regex(/^[a-z0-9-]+$/, "validation.slug"),
  description: z.string().trim().max(500, "validation.messageMax").optional().or(z.literal("")),
  price: z.coerce.number({ invalid_type_error: "validation.number" }).int("validation.number").min(0, "validation.number"),
  duration: z.string().trim().max(40).optional().or(z.literal("")),
  sort: z.coerce.number().int().min(0).default(0),
});

const doctorSchema = z.object({
  name: z.string().trim().min(2, "validation.nameMin"),
  speciality: z.string().trim().min(2, "validation.required"),
  rating: z.coerce.number({ invalid_type_error: "validation.number" }).min(0, "validation.rating").max(5, "validation.rating"),
});

/** Preview + file picker for an image field. */
const ImagePicker = ({ label, current, file, onFile }) => {
  const { t } = useTranslation();
  const preview = file ? URL.createObjectURL(file) : current;
  return (
    <div>
      <Label>{label}</Label>
      <label className="flex cursor-pointer items-center gap-4 rounded-2xl p-3 ring-1 ring-inset ring-ink-200 transition hover:ring-ink-300">
        <span className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl bg-ink-50">
          {preview ? <img src={preview} alt="" className="size-full object-cover" /> : <FiImage className="size-5 text-ink-300" />}
        </span>
        <span className="text-sm">
          <span className="font-semibold text-primary-500">{t("catalog.chooseImage")}</span>
          <span className="block text-[13px] text-ink-400">{file ? file.name : t("catalog.imageHint")}</span>
        </span>
        <input type="file" accept="image/*" className="sr-only" onChange={(e) => onFile(e.target.files[0])} />
      </label>
    </div>
  );
};

const ServiceForm = ({ initial, onSubmit, saving, onCancel }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(initial?.active ?? true);
  const [icon, setIcon] = useState(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      name: initial?.name ?? "",
      slug: initial?.slug ?? "",
      description: initial?.desc ?? "",
      price: initial?.price ?? "",
      duration: initial?.duration ?? "",
      sort: initial?.sort ?? 0,
    },
  });

  return (
    <form onSubmit={handleSubmit((v) => onSubmit({ ...v, active, icon: icon ?? undefined }, setError))} noValidate className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={t("catalog.serviceName")} error={errors.name} {...register("name")} />
        <Input label={t("catalog.slug")} hint="whitening" dir="ltr" error={errors.slug} {...register("slug")} />
        <Input label={t("catalog.price")} type="number" min="0" error={errors.price} {...register("price")} />
        <Input label={t("catalog.duration")} placeholder="45 min" error={errors.duration} {...register("duration")} />
      </div>
      <Textarea label={t("catalog.description")} error={errors.description} className="[&_textarea]:min-h-24" {...register("description")} />
      <div className="grid items-end gap-5 sm:grid-cols-2">
        <ImagePicker label={t("catalog.icon")} current={initial?.icon} file={icon} onFile={setIcon} />
        <Input label={t("catalog.sort")} type="number" min="0" error={errors.sort} {...register("sort")} />
      </div>
      <Switch label={t("catalog.activeLabel")} description={t("catalog.activeHint")} checked={active} onChange={setActive} />
      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" loading={saving}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
};

const DoctorForm = ({ initial, onSubmit, saving, onCancel }) => {
  const { t } = useTranslation();
  const [active, setActive] = useState(initial?.active ?? true);
  const [image, setImage] = useState(null);
  const [hours, setHours] = useState(initial?.working_hours ?? DEFAULT_HOURS);
  const [daysOff, setDaysOff] = useState(initial?.days_off ?? []);
  const [newDayOff, setNewDayOff] = useState("");
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(doctorSchema),
    defaultValues: { name: initial?.name ?? "", speciality: initial?.speciality ?? "", rating: initial?.rating ?? 5 },
  });

  return (
    <form
      onSubmit={handleSubmit((v) =>
        onSubmit({ ...v, active, image: image ?? undefined, working_hours: hours, days_off: daysOff }, setError)
      )}
      noValidate
      className="space-y-6"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Input label={t("fields.fullName")} placeholder="Dr. …" error={errors.name} {...register("name")} />
        <Input label={t("catalog.speciality")} placeholder="Orthodontist" error={errors.speciality} {...register("speciality")} />
        <Input label={t("catalog.rating")} type="number" step="0.1" min="0" max="5" error={errors.rating} {...register("rating")} />
        <ImagePicker label={t("catalog.photo")} current={initial?.image} file={image} onFile={setImage} />
      </div>

      <div>
        <Label>{t("catalog.workingHours")}</Label>
        <WorkingHoursEditor value={hours} onChange={setHours} />
      </div>

      <div>
        <Label>{t("catalog.daysOff")}</Label>
        <div className="flex flex-wrap items-center gap-2">
          {daysOff.map((d) => (
            <span key={d} className="inline-flex items-center gap-1 rounded-full bg-ink-50 py-1 pe-1 ps-3 text-[13px] font-medium text-ink-700 ring-1 ring-ink-100" dir="ltr">
              {d}
              <button type="button" onClick={() => setDaysOff(daysOff.filter((x) => x !== d))} className="rounded-full p-1 hover:bg-white" aria-label={t("common.remove")}>
                <FiX className="size-3" />
              </button>
            </span>
          ))}
          <input
            type="date"
            value={newDayOff}
            onChange={(e) => setNewDayOff(e.target.value)}
            className="h-9 rounded-xl bg-white px-2 text-sm ring-1 ring-inset ring-ink-200 outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Button
            type="button"
            size="xs"
            variant="outline"
            disabled={!newDayOff || daysOff.includes(newDayOff)}
            onClick={() => {
              setDaysOff([...daysOff, newDayOff].sort());
              setNewDayOff("");
            }}
          >
            <FiPlus /> {t("catalog.addDayOff")}
          </Button>
        </div>
      </div>

      <Switch label={t("catalog.activeLabel")} description={t("catalog.activeDoctorHint")} checked={active} onChange={setActive} />

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {t("common.cancel")}
        </Button>
        <Button type="submit" loading={saving}>
          {t("common.save")}
        </Button>
      </div>
    </form>
  );
};

export const AdminCatalog = () => {
  const { t } = useTranslation();
  usePageMeta(t("nav.catalog"));
  const [tab, setTab] = useState("doctors");
  const [editing, setEditing] = useState(null); // { item?: obj } — item undefined = create
  const [deleting, setDeleting] = useState(null);

  const doctors = useAdminDoctors();
  const services = useAdminServices();
  const resource = tab === "doctors" ? doctors : services;
  const list = resource.list.data;

  const save = (values, setError) =>
    resource.save.mutate(
      { id: editing.item?.id, ...values },
      {
        onSuccess: () => {
          flash.show(t("catalog.saved"), "success", 3000);
          setEditing(null);
        },
        onError: (e) => {
          applyServerErrors(e, setError, { description: "description" });
          flash.show(getErrorMessage(e, t("common.somethingWrong")), "error", 4000);
        },
      }
    );

  const confirmDelete = () =>
    resource.remove.mutate(deleting.id, {
      onSuccess: () => {
        flash.show(t("catalog.deleted"), "success", 3000);
        setDeleting(null);
      },
      onError: (e) => flash.show(getErrorMessage(e, t("common.somethingWrong")), "error", 4000),
    });

  return (
    <div>
      <PageHeader
        title={t("catalog.title")}
        accent={t("catalog.titleAccent")}
        description={t("catalog.lead")}
        action={
          !list?.notImplemented && (
            <Button onClick={() => setEditing({})}>
              <FiPlus /> {tab === "doctors" ? t("catalog.addDoctor") : t("catalog.addService")}
            </Button>
          )
        }
      />

      <div className="mb-6">
        <Segmented
          options={[
            { value: "doctors", label: t("catalog.doctors") },
            { value: "services", label: t("catalog.services") },
          ]}
          value={tab}
          onChange={setTab}
        />
      </div>

      {resource.list.isPending ? (
        <PageLoader className="h-[50vh]" />
      ) : list?.notImplemented ? (
        <NotImplemented endpoint={`GET /api/admin/${tab}`} />
      ) : !list?.length ? (
        <EmptyState title={t("common.nothingYet")} />
      ) : tab === "doctors" ? (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((d) => (
            <article key={d.id} className="flex gap-4 rounded-3xl bg-white p-4 shadow-soft ring-1 ring-ink-200/70">
              <div className="size-24 shrink-0 overflow-hidden rounded-2xl bg-ink-100">
                <DoctorPhoto doctor={d} iconClassName="size-1/2" className="size-full object-cover object-top" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-semibold text-ink-900">{d.name}</p>
                    <p className="text-[13px] text-ink-400">{d.speciality}</p>
                  </div>
                  <Badge value={d.active ? "active" : "inactive"} />
                </div>
                <p className="mt-1 flex items-center gap-1 text-[13px] font-semibold text-ink-700">
                  <FiStar className="size-3 fill-amber-400 text-amber-400" /> {d.rating}
                </p>
                <div className="mt-auto flex gap-1 pt-2">
                  <Button size="xs" variant="outline" onClick={() => setEditing({ item: d })}>
                    <FiEdit2 /> {t("common.edit")}
                  </Button>
                  <Button size="xs" variant="danger-soft" onClick={() => setDeleting(d)}>
                    <FiTrash2 />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 2xl:grid-cols-3">
          {list.map((s) => (
            <article key={s.id} className="flex flex-col rounded-3xl bg-white p-5 shadow-soft ring-1 ring-ink-200/70">
              <div className="flex items-start justify-between gap-3">
                <span className="grid size-12 place-items-center rounded-xl bg-ink-50 ring-1 ring-ink-100">
                  {s.icon && <img src={s.icon} alt="" className="max-h-7 max-w-8 object-contain" />}
                </span>
                <Badge value={s.active ? "active" : "inactive"} />
              </div>
              <p className="mt-4 font-semibold text-ink-900">{s.name}</p>
              <p className="mt-1 line-clamp-2 text-[13px] text-ink-500">{s.desc}</p>
              <div className="mt-auto flex items-center justify-between pt-4">
                <span className="text-lg font-semibold text-ink-900">
                  ${s.price.toLocaleString()} <span className="text-[13px] font-normal text-ink-400">· {s.duration}</span>
                </span>
                <div className="flex gap-1">
                  <Button size="xs" variant="outline" onClick={() => setEditing({ item: s })}>
                    <FiEdit2 /> {t("common.edit")}
                  </Button>
                  <Button size="xs" variant="danger-soft" onClick={() => setDeleting(s)}>
                    <FiTrash2 />
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      <Modal
        open={!!editing}
        onClose={() => setEditing(null)}
        size="xl"
        title={
          tab === "doctors"
            ? editing?.item
              ? t("catalog.editDoctor")
              : t("catalog.addDoctor")
            : editing?.item
            ? t("catalog.editService")
            : t("catalog.addService")
        }
      >
        {editing &&
          (tab === "doctors" ? (
            <DoctorForm initial={editing.item} onSubmit={save} saving={resource.save.isPending} onCancel={() => setEditing(null)} />
          ) : (
            <ServiceForm initial={editing.item} onSubmit={save} saving={resource.save.isPending} onCancel={() => setEditing(null)} />
          ))}
      </Modal>

      <Modal
        open={!!deleting}
        onClose={() => setDeleting(null)}
        icon={FiTrash2}
        tone="danger"
        title={t("catalog.deleteTitle", { name: deleting?.name })}
        description={t("catalog.deleteBody")}
        footer={
          <>
            <Button variant="outline" onClick={() => setDeleting(null)}>
              {t("common.cancel")}
            </Button>
            <Button variant="danger" onClick={confirmDelete} loading={resource.remove.isPending}>
              {t("common.delete")}
            </Button>
          </>
        }
      />
    </div>
  );
};
