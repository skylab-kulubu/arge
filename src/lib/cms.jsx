import { revalidateCmsSlug } from "inscribed/actions";
import { createCmsPage } from "inscribed/page";
import { NextAuthCmsProvider } from "@skylab-kulubu/inscribed-auth";
import { withCmsAuth, getClientCredentialsToken } from "@skylab-kulubu/inscribed-auth/server";
import { authOptions } from "./auth.js";

export const CmsPage = createCmsPage({
  Provider: NextAuthCmsProvider,
  config: {
    baseUrl: process.env.CMS_URL ?? "http://localhost:5000",
    cdnUrl: process.env.CMS_CDN_URL,
  },
  getServiceToken: getClientCredentialsToken,
  ...withCmsAuth(authOptions),
  onAfterSave: revalidateCmsSlug,
});

export function withCms(_slug, Component) {
  return Component;
}