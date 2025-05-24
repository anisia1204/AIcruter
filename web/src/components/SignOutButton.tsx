"use client";

import { LogOut } from "lucide-react";
import { Button } from "./ui/button";

export function SignOutButton() {
  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    window.location.href = "/login";
  }

  return (
    <Button
      variant={"destructive"}
      onClick={handleSignOut}
      className="flex items-center gap-4"
    >
      <LogOut />
      <span>Sign Out</span>
    </Button>
  );
}
