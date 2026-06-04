import KeycloakProvider from "next-auth/providers/keycloak";
import { createCmsAuthOptions } from "@skylab-kulubu/inscribed-auth/server";

export const authOptions = createCmsAuthOptions({
  provider: KeycloakProvider({
    clientId: process.env.KEYCLOAK_CLIENT_ID ?? "",
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET ?? "",
    issuer: process.env.KEYCLOAK_ISSUER ?? "",
  }),
  adminRole: "cms:access",
});