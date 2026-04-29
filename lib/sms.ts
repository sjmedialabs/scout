/**
 * SMS gateway integration for smslogin.co (v3 API).
 *
 * All credentials are read from environment variables. Never hardcode them.
 *   SMS_USERNAME           - smslogin account username (e.g. "Sparkza")
 *   SMS_API_KEY            - smslogin API key
 *   SMS_SENDER_ID          - DLT-approved sender ID (e.g. "SPRKZA")
 *   SMS_TEMPLATE_ID_OTP    - DLT template ID used for OTP messages (optional, can be passed per-call)
 *   SMS_DEFAULT_COUNTRY_CODE - default country code prefix when caller passes a 10-digit number (default "91")
 */

export interface SendSmsOptions {
  /** Recipient mobile number. May contain "+", spaces or dashes; will be normalized. */
  mobile: string
  /** Message body. Must match the registered DLT template content. */
  message: string
  /** DLT template ID. If omitted for OTP, falls back to SMS_TEMPLATE_ID_OTP. */
  templateId?: string
}

export interface SmsResult {
  ok: boolean
  status: number
  raw: string
}

const ENDPOINT = "https://smslogin.co/v3/api.php"

function normalizeMobile(input: string): string {
  const digits = String(input || "").replace(/\D+/g, "")
  if (!digits) {
    throw new Error("SMS recipient mobile is empty")
  }
  // If a 10-digit local number is supplied, prepend the configured country code.
  if (digits.length === 10) {
    const cc = (process.env.SMS_DEFAULT_COUNTRY_CODE || "91").replace(/\D+/g, "")
    return `${cc}${digits}`
  }
  return digits
}

function getCreds() {
  const username = process.env.SMS_USERNAME
  const apikey = process.env.SMS_API_KEY
  const senderid = process.env.SMS_SENDER_ID
  if (!username || !apikey || !senderid) {
    throw new Error(
      "SMS env vars not set (SMS_USERNAME, SMS_API_KEY, SMS_SENDER_ID)"
    )
  }
  return { username, apikey, senderid }
}

/**
 * Send a transactional SMS via smslogin.co.
 * Throws on configuration errors. Network/HTTP errors are returned as ok=false.
 */
export async function sendSms(opts: SendSmsOptions): Promise<SmsResult> {
  const { username, apikey, senderid } = getCreds()
  const mobile = normalizeMobile(opts.mobile)
  const message = String(opts.message ?? "")
  if (!message) throw new Error("SMS message is empty")

  const params = new URLSearchParams({
    username,
    apikey,
    senderid,
    mobile,
    message,
  })
  if (opts.templateId) params.set("templateid", opts.templateId)

  const url = `${ENDPOINT}?${params.toString()}`

  try {
    const res = await fetch(url, { method: "GET" })
    const raw = await res.text()
    const ok = res.ok && !/error|fail/i.test(raw)
    if (!ok) {
      console.error("[sms] send failed", { status: res.status, body: raw, mobile })
    }
    return { ok, status: res.status, raw }
  } catch (err: any) {
    console.error("[sms] network error", err?.message || err)
    return { ok: false, status: 0, raw: String(err?.message || err) }
  }
}

/**
 * Convenience wrapper for OTP messages. Uses SMS_TEMPLATE_ID_OTP unless
 * an explicit templateId is supplied. The message body must mirror the
 * DLT-registered template content (e.g. "Your OTP is {OTP}").
 */
export async function sendOtpSms(opts: {
  mobile: string
  otp: string
  templateId?: string
  /**
   * Optional override of the message body. Defaults to a generic line that
   * should be replaced with your DLT template content before going live.
   */
  message?: string
}): Promise<SmsResult> {
  const templateId = opts.templateId || process.env.SMS_TEMPLATE_ID_OTP
  const message =
    opts.message ||
    `Your verification OTP is ${opts.otp}. It is valid for 5 minutes. Do not share with anyone.`
  return sendSms({ mobile: opts.mobile, message, templateId })
}
