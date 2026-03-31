import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

const isConfigured =
  SUPABASE_URL.startsWith("https://") && SUPABASE_ANON_KEY.length > 10;

export async function createClient() {
  const cookieStore = await cookies();

  if (!isConfigured) {
    // Return a stub client that won't throw during build
    return createServerClient(
      "https://placeholder.supabase.co",
      "placeholder-anon-key",
      {
        cookies: {
          getAll: () => cookieStore.getAll(),
          setAll: () => {},
        },
      }
    );
  }

  return createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from Server Component — cookies set in middleware
        }
      },
    },
  });
}

export async function createAdminClient() {
  const cookieStore = await cookies();

  const serviceKey = isConfigured ? SUPABASE_SERVICE_KEY : "placeholder-service-key";
  const url = isConfigured ? SUPABASE_URL : "https://placeholder.supabase.co";

  return createServerClient(url, serviceKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {}
      },
    },
  });
}
