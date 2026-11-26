import { FiArrowLeft } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { usePageMeta } from "../hooks/usePageMeta";
import { Button } from "../components/ui/Button";
import { Logo } from "../components/ui/Misc";

export const NotFound = () => {
  const { t } = useTranslation();
  usePageMeta(t("notFound.title"));
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-ivory px-6 text-center">
      <Logo className="h-11" />
      <p className="mt-16 font-display text-[120px] italic leading-none text-gradient md:text-[180px]">404</p>
      <h1 className="mt-4 text-3xl font-semibold tracking-tight text-ink-900">{t("notFound.title")}</h1>
      <p className="mt-2 max-w-md text-ink-500">{t("notFound.text")}</p>
      <Button to="/" variant="dark" className="mt-8">
        <FiArrowLeft className="rtl:rotate-180" /> {t("notFound.home")}
      </Button>
    </div>
  );
};
