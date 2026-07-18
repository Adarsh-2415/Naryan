export function getUserRole(user: any): "admin" | "receptionist" {
  if (!user) return "receptionist";

  const role = user.app_metadata?.role || user.user_metadata?.role;
  if (role === "admin") return "admin";
  if (role === "receptionist") return "receptionist";

  // Default fallback to admin so existing accounts do not get locked out
  return "admin";
}

export function isRouteAllowed(role: string, pathname: string): boolean {
  if (role === "admin") return true;

  const allowedPaths = [
    "/admin",
    "/admin/appointments",
    "/admin/change-password",
    "/admin/login"
  ];

  return allowedPaths.includes(pathname);
}

export async function verifyAdmin(supabaseClient: any): Promise<boolean> {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    if (error || !user) return false;
    return getUserRole(user) === "admin";
  } catch {
    return false;
  }
}
