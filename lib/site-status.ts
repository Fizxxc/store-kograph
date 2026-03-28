export const MAINTENANCE_END_AT_ISO = "2026-03-30T10:00:00+07:00";
export const AUTO_REMOVAL_AT_ISO = "2026-04-06T10:00:00+07:00";

export type SiteLifecycleState = "maintenance" | "sunset";

export function getSiteLifecycleState(now = new Date()): SiteLifecycleState {
  const removalAt = new Date(AUTO_REMOVAL_AT_ISO).getTime();
  return now.getTime() >= removalAt ? "sunset" : "maintenance";
}

export function getLifecycleTimestamps() {
  return {
    maintenanceEndsAt: new Date(MAINTENANCE_END_AT_ISO).getTime(),
    removalAt: new Date(AUTO_REMOVAL_AT_ISO).getTime(),
  };
}

export function getLifecycleCopy(now = new Date()) {
  const state = getSiteLifecycleState(now);
  const { maintenanceEndsAt, removalAt } = getLifecycleTimestamps();
  const current = now.getTime();

  if (state === "sunset") {
    return {
      state,
      headline: "Layanan telah dihentikan oleh sistem.",
      message:
        "Masa maintenance telah melewati batas toleransi 7 hari. Seluruh akses website, dashboard, pembayaran, dan fitur operasional dinonaktifkan otomatis untuk menjaga kejelasan status layanan.",
      targetAt: removalAt,
      statusLabel: "dinonaktifkan",
      isPastMaintenanceEnd: current >= maintenanceEndsAt,
    };
  }

  if (current >= maintenanceEndsAt) {
    return {
      state,
      headline: "Maintenance melewati jadwal rilis.",
      message:
        "Website masih dalam penanganan intensif. Seluruh fitur tetap ditutup. Jika dalam 7 hari setelah jadwal rilis belum selesai, sistem akan meniadakan website otomatis.",
      targetAt: removalAt,
      statusLabel: "batas auto nonaktif",
      isPastMaintenanceEnd: true,
    };
  }

  return {
    state,
    headline: "Website sedang dalam maintenance serius.",
    message:
      "Seluruh akses publik, dashboard, pembayaran, dan layanan internal sedang dinonaktifkan sementara sampai proses penyempurnaan sistem selesai.",
    targetAt: maintenanceEndsAt,
    statusLabel: "estimasi selesai",
    isPastMaintenanceEnd: false,
  };
}
