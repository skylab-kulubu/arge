// The CMS image bridge (src/app/api/cms-media/route.js): the inscribed editor
// uploads images to this site, and the site forwards them to core's /v1/media.
// Same shape as skylab-site's bridge, with the editor check done here.

// What core's cms_image purpose accepts (core-backend config/media-purposes.json).
// Uploads still go without a purpose (legacy, kept indefinitely): core refuses
// cms_image until the CMS attaches its media, and an unattached cms_image is
// deleted after 24 hours. The bridge holds uploads to cms_image's limits anyway.
export const CMS_IMAGE_TYPES = Object.freeze([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
]);
export const CMS_IMAGE_MAX_BYTES = 10 * 1024 * 1024;

// Room for the multipart framing around the file.
const MULTIPART_OVERHEAD_BYTES = 64 * 1024;

// Core's /v1/media. Core's origin comes from API_BASE_URL, which the image
// build sets per environment (production api., sandbox sandbox-api.). An image
// built without it falls back to CMS_URL's origin: inscribed is served from
// core's host (/api/cms) on both sides.
export function coreMediaUrl(apiBaseUrl, cmsUrl) {
  return `${new URL(apiBaseUrl || cmsUrl).origin}/v1/media`;
}

function problem(status, detail) {
  return Response.json({ detail }, { status });
}

// uploadCmsImage answers one upload. `session` is the visitor's NextAuth
// session (null when signed out) and `isEditor(session)` decides whether it
// may edit this site's CMS content (the `cms:access` role). The file goes to
// core with the session's own access token; the editor's answer is wrapped in
// `{ data }`, the envelope inscribed reads the image address from (`data.url`).
export async function uploadCmsImage(request, { session, isEditor, target, fetchImpl = fetch }) {
  // The editor always sends its token in Authorization. Requiring the header
  // keeps a cross-site form, which cannot set it, from uploading with the
  // session cookie.
  const authorization = request.headers.get("authorization") ?? "";
  if (!/^Bearer\s+\S/i.test(authorization)) {
    return problem(401, "Görsel yüklemek için oturum açın.");
  }
  if (!session || session.error || !session.accessToken) {
    return problem(401, "Görsel yüklemek için oturum açın.");
  }
  if (!isEditor(session)) {
    return problem(403, "Bu sitede görsel yükleme yetkiniz yok.");
  }

  const declared = Number(request.headers.get("content-length"));
  if (Number.isFinite(declared) && declared > CMS_IMAGE_MAX_BYTES + MULTIPART_OVERHEAD_BYTES) {
    return problem(413, "Görsel en fazla 10 MiB olabilir.");
  }

  let form;
  try {
    form = await request.formData();
  } catch {
    return problem(400, "Yükleme okunamadı.");
  }
  const file = form.get("file");
  if (!file || typeof file === "string") {
    return problem(400, "Yüklemede dosya yok.");
  }
  if (file.size > CMS_IMAGE_MAX_BYTES) {
    return problem(413, "Görsel en fazla 10 MiB olabilir.");
  }
  if (!CMS_IMAGE_TYPES.includes(file.type)) {
    return problem(415, "Yalnız JPEG, PNG, WebP, GIF ya da SVG yüklenebilir.");
  }

  // Only the file goes on: nothing else the browser put in the form (a
  // purpose, say) reaches core.
  const body = new FormData();
  body.append("file", file, file.name || "image");

  let upstream;
  try {
    upstream = await fetchImpl(target, {
      method: "POST",
      headers: { authorization: `Bearer ${session.accessToken}` },
      body,
      cache: "no-store",
    });
  } catch {
    return problem(502, "Görsel yükleme servisine ulaşılamadı.");
  }

  const answer = await upstream.json().catch(() => null);
  if (!upstream.ok) {
    return Response.json(answer ?? { detail: upstream.statusText }, { status: upstream.status });
  }
  return Response.json({ data: answer }, { status: upstream.status });
}
