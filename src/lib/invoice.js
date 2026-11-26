import { clinic } from "../data/clinic";

const BRAND = [56, 2, 255];
const INK = [11, 10, 26];
const MUTED = [98, 98, 124];

const loadImage = (src) =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

/**
 * Generates and downloads a PDF receipt for an appointment, entirely in the browser.
 * `t` is an i18next fixed-language translator (PDF fonts only cover Latin scripts,
 * so Arabic users get the French/English version — see callers).
 */
export const downloadInvoice = async (appt, user, t, locale = "en") => {
  const [{ jsPDF }, { default: autoTable }] = await Promise.all([import("jspdf"), import("jspdf-autotable")]);
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const W = doc.internal.pageSize.getWidth();
  const M = 48;

  // Brand bar
  doc.setFillColor(...BRAND);
  doc.rect(0, 0, W, 6, "F");

  const logo = await loadImage("/images/logo.png");
  if (logo) doc.addImage(logo, "PNG", M, 40, 110, 110 * (logo.height / logo.width));

  const number = appt.invoice_number || `INV-${String(appt.id).padStart(6, "0")}`;
  doc.setFont("helvetica", "bold").setFontSize(22).setTextColor(...INK);
  doc.text(t("invoice.title"), W - M, 60, { align: "right" });
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  doc.text(`${t("invoice.number")}: ${number}`, W - M, 78, { align: "right" });
  doc.text(`${t("invoice.issued")}: ${new Date().toLocaleDateString(locale)}`, W - M, 92, { align: "right" });

  // Parties
  let y = 150;
  doc.setFontSize(9).setTextColor(...MUTED).text(t("invoice.from").toUpperCase(), M, y);
  doc.text(t("invoice.billedTo").toUpperCase(), W / 2, y);
  doc.setFontSize(11).setTextColor(...INK).setFont("helvetica", "bold");
  doc.text(clinic.name, M, y + 18);
  doc.text(user?.name || "—", W / 2, y + 18);
  doc.setFont("helvetica", "normal").setFontSize(10).setTextColor(...MUTED);
  doc.text([clinic.address, clinic.phone, clinic.email], M, y + 34);
  doc.text([user?.email || ""], W / 2, y + 34);

  // Line items
  autoTable(doc, {
    startY: y + 90,
    margin: { left: M, right: M },
    head: [[t("invoice.description"), t("invoice.specialist"), t("invoice.dateTime"), t("invoice.amount")]],
    body: [[appt.service, appt.doctor, `${appt.date} · ${appt.time?.slice(0, 5)}`, `$${Number(appt.price).toLocaleString()}`]],
    styles: { font: "helvetica", fontSize: 10, cellPadding: 10, textColor: INK },
    headStyles: { fillColor: [246, 246, 250], textColor: MUTED, fontStyle: "bold", fontSize: 9 },
    columnStyles: { 3: { halign: "right" } },
    theme: "plain",
  });

  y = doc.lastAutoTable.finalY + 24;
  doc.setDrawColor(236, 236, 243).line(W / 2, y, W - M, y);
  doc.setFontSize(10).setTextColor(...MUTED).text(t("invoice.total"), W / 2, y + 22);
  doc.setFont("helvetica", "bold").setFontSize(16).setTextColor(...INK);
  doc.text(`$${Number(appt.price).toLocaleString()}`, W - M, y + 24, { align: "right" });

  const paid = appt.payment_status === "paid";
  doc.setFontSize(9).setFont("helvetica", "bold").setTextColor(...(paid ? [16, 150, 100] : MUTED));
  doc.text((paid ? t("invoice.paid") : t("invoice.payAtClinic")).toUpperCase(), W - M, y + 44, { align: "right" });

  // Footer
  doc.setFont("helvetica", "normal").setFontSize(9).setTextColor(...MUTED);
  doc.text(t("invoice.thanks"), W / 2, doc.internal.pageSize.getHeight() - 48, { align: "center" });

  doc.save(`${number}.pdf`);
};
