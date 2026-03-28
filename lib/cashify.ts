const CASHIFY_BASE_URL = "https://cashify.my.id/api";

export type CashifyStatus = "pending" | "paid" | "expired" | "cancel" | "failed";

function licenseHeaders() {
  return {
    "Content-Type": "application/json",
    "x-license-key": process.env.CASHIFY_LICENSE || "",
  };
}

export function normalizeCashifyStatus(input?: string | null): CashifyStatus {
  const value = String(input || "pending").toLowerCase();

  if (["paid", "success", "settlement", "completed"].includes(value)) {
    return "paid";
  }

  if (["cancel", "cancelled", "canceled"].includes(value)) {
    return "cancel";
  }

  if (["expire", "expired"].includes(value)) {
    return "expired";
  }

  if (["failed", "error"].includes(value)) {
    return "failed";
  }

  return "pending";
}

export function isCashifyPaid(input?: string | null) {
  return normalizeCashifyStatus(input) === "paid";
}

export function isCashifyFinal(input?: string | null) {
  return ["paid", "expired", "cancel", "failed"].includes(normalizeCashifyStatus(input));
}

function buildPackageIds() {
  return (process.env.CASHIFY_PACKAGE_IDS || "id.dana")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export async function createCashifyPayment(amount: number) {
  const response = await fetch(`${CASHIFY_BASE_URL}/generate/v2/qris`, {
    method: "POST",
    headers: licenseHeaders(),
    body: JSON.stringify({
      qr_id: process.env.CASHIFY_QR_ID,
      amount,
      useUniqueCode: true,
      packageIds: buildPackageIds(),
      expiredInMinutes: 15,
      qrType: "dynamic",
      paymentMethod: "qris",
      useQris: true,
    }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || payload?.status !== 200) {
    throw new Error(payload?.message || "Gagal membuat transaksi Cashify");
  }

  return {
    ...payload.data,
    status: normalizeCashifyStatus(payload?.data?.status),
  };
}

export async function checkCashifyStatus(transactionId: string) {
  const response = await fetch(`${CASHIFY_BASE_URL}/generate/check-status`, {
    method: "POST",
    headers: licenseHeaders(),
    body: JSON.stringify({ transactionId }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || payload?.status !== 200) {
    throw new Error(payload?.message || "Gagal cek status Cashify");
  }

  return {
    ...payload.data,
    status: normalizeCashifyStatus(payload?.data?.status),
  };
}
