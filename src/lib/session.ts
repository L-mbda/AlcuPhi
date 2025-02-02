import { cache } from "react";
import { Authentication } from "@/actions/authentication";

// Grabs session data using a cache
export const getSessionData = cache(async () => {
  return await Authentication.verifySession();
});
