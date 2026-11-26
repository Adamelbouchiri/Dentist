import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AnimatePresence, motion } from "framer-motion";
import { FiCheck, FiSend } from "react-icons/fi";
import { FaInstagram, FaFacebookF } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useTranslation } from "react-i18next";
import { useSendContact } from "../../hooks/useCatalog";
import { getErrorMessage, isMissingEndpoint } from "../../lib/api";
import { applyServerErrors, contactSchema } from "../../lib/schemas";
import { flash } from "../../utils/flash";
import { Button } from "../ui/Button";
import { Input, Textarea } from "../ui/Field";
import { SectionHeading } from "../ui/Misc";

export const Contact = () => {
  const { t } = useTranslation();
  const send = useSendContact();
  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", phone: "", message: "" },
  });

  const onSubmit = handleSubmit((values) =>
    send.mutate(values, {
      onSuccess: () => reset(),
      onError: (error) => {
        applyServerErrors(error, setError);
        flash.show(
          isMissingEndpoint(error) ? t("common.notAvailableYet") : getErrorMessage(error, t("contact.failed")),
          "error",
          4000
        );
      },
    })
  );

  return (
    <section id="contact" className="scroll-mt-24">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr] lg:gap-20">
        <div>
          <SectionHeading align="left" eyebrow={t("contact.eyebrow")} title={t("contact.title")} accent={t("contact.titleAccent")} lead={t("contact.lead")} />

          <ul className="mt-10 space-y-4">
            {["personal", "timely", "comprehensive"].map((k) => (
              <li key={k} className="flex items-center gap-3 text-ink-700">
                <span className="grid size-7 place-items-center rounded-full gradient-primary text-white">
                  <FiCheck className="size-3.5" />
                </span>
                <span className="font-medium">{t(`contact.points.${k}`)}</span>
              </li>
            ))}
          </ul>

          <div className="mt-12 flex items-center gap-3">
            {[FaXTwitter, FaInstagram, FaFacebookF].map((Icon, i) => (
              <a
                key={i}
                href="#"
                aria-label={t("common.social")}
                className="grid size-12 place-items-center rounded-2xl bg-white text-ink-700 shadow-soft ring-1 ring-ink-200/70 transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-500 hover:text-white hover:ring-primary-500"
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        </div>

        <div className="relative rounded-[32px] bg-white p-6 shadow-soft ring-1 ring-ink-200/70 md:p-10">
          <AnimatePresence mode="wait">
            {send.isSuccess ? (
              <motion.div
                key="sent"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="flex min-h-[380px] flex-col items-center justify-center text-center"
              >
                <span className="grid size-16 place-items-center rounded-3xl gradient-primary text-white shadow-glow">
                  <FiCheck className="size-7" />
                </span>
                <h3 className="mt-6 text-2xl font-semibold tracking-tight text-ink-900">{t("contact.sentTitle")}</h3>
                <p className="mt-2 max-w-sm text-ink-500">{send.data?.message || t("contact.sentText")}</p>
                <Button variant="outline" className="mt-8" onClick={() => send.reset()}>
                  {t("contact.sendAnother")}
                </Button>
              </motion.div>
            ) : (
              <motion.form key="form" onSubmit={onSubmit} noValidate initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="grid gap-5 md:grid-cols-2">
                  <Input label={t("fields.name")} placeholder={t("fields.fullNamePlaceholder")} autoComplete="name" error={errors.name} {...register("name")} />
                  <Input
                    label={t("fields.email")}
                    type="email"
                    autoComplete="email"
                    placeholder={t("fields.emailPlaceholder")}
                    error={errors.email}
                    {...register("email")}
                  />
                  <Input
                    label={t("fields.phone")}
                    hint={t("common.optional")}
                    type="tel"
                    autoComplete="tel"
                    placeholder="+212 6 00 00 00 00"
                    error={errors.phone}
                    className="md:col-span-2"
                    {...register("phone")}
                  />
                  <Textarea
                    label={t("fields.message")}
                    placeholder={t("contact.messagePlaceholder")}
                    error={errors.message}
                    className="md:col-span-2"
                    {...register("message")}
                  />
                </div>
                <div className="mt-8 flex flex-col-reverse items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <p className="text-[13px] text-ink-400">{t("contact.replyTime")}</p>
                  <Button type="submit" size="lg" loading={send.isPending} className="w-full sm:w-auto">
                    {!send.isPending && <FiSend className="rtl:-scale-x-100" />} {t("contact.send")}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
