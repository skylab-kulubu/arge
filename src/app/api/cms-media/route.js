import { getServerSession } from "next-auth";
import { isCmsAdmin, readCmsAuthMeta } from "@skylab-kulubu/inscribed-auth/server";
import { authOptions } from "@/lib/auth";
import { coreMediaUrl, uploadCmsImage } from "@/lib/cms-media";

// CORE_API_ORIGIN is API_BASE_URL, written into the build by next.config.mjs:
// the running site has no API_BASE_URL of its own.
const target = coreMediaUrl(process.env.CORE_API_ORIGIN, process.env.CMS_URL ?? "http://localhost:5000");
const cmsAuth = readCmsAuthMeta(authOptions);

// The inscribed image editor posts here (cdnUrl in src/lib/cms.jsx). Only a
// signed-in editor of this site (the same check that opens the editor) may
// upload; the file goes to core's /v1/media with the editor's own token.
export async function POST(request) {
  const session = await getServerSession(authOptions);
  return uploadCmsImage(request, {
    session,
    isEditor: (s) => isCmsAdmin(s, cmsAuth),
    target,
  });
}
