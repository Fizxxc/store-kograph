const CASHIFY_BASE_URL = "https://cashify.my.id/api";

function licenseHeaders() {
  return {
    "Content-Type": "application/json",
    "x-license-key": process.env.CASHIFY_LICENSE || "",
  };
}

export async function createCashifyPayment(amount: number) {
  const response = await fetch(`${CASHIFY_BASE_URL}/generate/v2/qris`, {
    method: "POST",
    headers: licenseHeaders(),
    body: JSON.stringify({
      qr_id: process.env.CASHIFY_QR_ID,
      amount,
      useUniqueCode: true,
      packageIds: (process.env.CASHIFY_PACKAGE_IDS || "com.gojek.gopay").split(",").map((item) => item.trim()).filter(Boolean),
      expiredInMinutes: 15,
      qrType: "static",
      paymentMethod: "qris",
      useQris: true,
    }),
    cache: "no-store",
  });

  const payload = await response.json();
  if (!response.ok || payload?.status !== 200) {
    throw new Error(payload?.message || "Gagal membuat transaksi Cashify");
  }

  return payload.data;
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

  return payload.data;
}
