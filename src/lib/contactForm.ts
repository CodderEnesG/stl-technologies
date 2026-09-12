/**
 * İletişim formunun gönderimi — EmailJS.
 *
 * Form eskiden `mailto:` açıyordu: posta istemcisi tanımlı olmayan her cihazda
 * (çoğu masaüstü tarayıcı, kurumsal bilgisayarlar) talep sessizce kayboluyordu.
 * Artık istek doğrudan EmailJS'in REST ucuna gidiyor.
 *
 * SDK kurulmadı: tek bir POST yeterli, paket eklemek ilk paketi büyütürdü.
 *
 * Anahtarlar gizli değil, tarayıcıya gömülüyor — EmailJS'in tarayıcı akışı
 * böyle çalışır. Kötüye kullanımı EmailJS panelinden alan adı kısıtı ve oran
 * sınırı ile engelleyin (Account > Security > Allowed origins).
 *
 * Yapılandırılmamışsa (env değişkenleri yoksa) `configured` false döner ve
 * çağıran taraf eski mailto davranışına düşer; yani anahtarlar gelene kadar
 * form çalışmaya devam eder.
 */

const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string | undefined;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID as string | undefined;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string | undefined;

const ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export const contactFormConfigured = Boolean(SERVICE_ID && TEMPLATE_ID && PUBLIC_KEY);

export type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  message: string;
};

export type ContactResult = { ok: true } | { ok: false; reason: "unconfigured" | "network" | "rejected" };

/**
 * Formu gönderir. Asla hata fırlatmaz; çağıran taraf sonucu ekranda gösterir.
 *
 * `template_params` anahtarları EmailJS şablonundaki değişken adlarıyla birebir
 * aynı olmalı. Şablonu kurarken şu adları kullanın:
 * {{from_name}} {{reply_to}} {{company}} {{message}}
 */
export async function sendContactForm(
  payload: ContactPayload,
  signal?: AbortSignal,
): Promise<ContactResult> {
  if (!contactFormConfigured) return { ok: false, reason: "unconfigured" };

  try {
    const res = await fetch(ENDPOINT, {
      method: "POST",
      signal,
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        service_id: SERVICE_ID,
        template_id: TEMPLATE_ID,
        user_id: PUBLIC_KEY,
        template_params: {
          from_name: payload.name,
          reply_to: payload.email,
          company: payload.company ?? "",
          message: payload.message,
        },
      }),
    });

    return res.ok ? { ok: true } : { ok: false, reason: "rejected" };
  } catch {
    return { ok: false, reason: "network" };
  }
}
