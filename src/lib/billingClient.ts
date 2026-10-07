import crypto from "node:crypto";

const ORDER_PATH = "/api/billing/internal/order";
const STATUS_PATH = "/api/billing/internal/status";

function config() {
  return {
    baseUrl: String(process.env.V79_HUB_BILLING_URL || "http://v79-hub:3040").replace(/\/$/, ""),
    secret: String(process.env.V79_ACADEMY_BILLING_SECRET || ""),
  };
}

function sign(method: string, pathname: string, timestamp: string, body: string, secret: string) {
  const bodyHash = crypto.createHash("sha256").update(body).digest("hex");
  const canonical = [method.toUpperCase(), pathname, timestamp, bodyHash].join("\n");
  return crypto.createHmac("sha256", secret).update(canonical).digest("hex");
}

async function hubRequest(pathname: string, payload: Record<string, unknown>) {
  const { baseUrl, secret } = config();
  if (!/^https?:\/\//.test(baseUrl) || secret.length < 32) {
    throw new Error("Academy billing is not configured.");
  }
  const body = JSON.stringify(payload);
  const timestamp = String(Date.now());
  const response = await fetch(baseUrl + pathname, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-v79-service-id": "v79-academy-billing",
      "x-v79-timestamp": timestamp,
      "x-v79-signature": sign("POST", pathname, timestamp, body, secret),
    },
    body,
    signal: AbortSignal.timeout(8000),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const error: any = new Error(data.error || "V79 Billing request failed.");
    error.status = response.status;
    error.code = data.code;
    throw error;
  }
  return data;
}

export function academyBillingConfigured() {
  const { baseUrl, secret } = config();
  return /^https?:\/\//.test(baseUrl) && secret.length >= 32;
}

export async function createAcademyCourseOrder(input: {
  learnerId: string;
  courseId: string;
  courseTitle: string;
  amount: number;
  returnPath: string;
}) {
  return hubRequest(ORDER_PATH, {
    kind: "course",
    externalReference: input.courseId,
    subjectReference: input.learnerId,
    description: input.courseTitle,
    amount: input.amount,
    currency: String(process.env.V79_ACADEMY_BILLING_CURRENCY || "XCD").trim().toUpperCase(),
    returnPath: input.returnPath,
  });
}

export async function getAcademyOrderStatus(orderId: string) {
  return hubRequest(STATUS_PATH, { orderId });
}
