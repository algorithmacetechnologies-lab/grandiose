"use client";

import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assets";

export function ToastHost() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    function onToast(event: Event) {
      const custom = event as CustomEvent<string>;
      setMessage(custom.detail || "Saved successfully");
      window.setTimeout(() => setMessage(""), 2500);
    }
    window.addEventListener("admin-toast", onToast as EventListener);
    return () => window.removeEventListener("admin-toast", onToast as EventListener);
  }, []);

  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 border border-[#d8c18d] bg-[#102a43] px-5 py-3 text-sm text-white shadow-xl">
      {message}
    </div>
  );
}

export function notify(message: string) {
  window.dispatchEvent(new CustomEvent("admin-toast", { detail: message }));
}

export function ConfirmButton({
  label,
  message,
  onConfirm,
  className = "",
}: {
  label: string;
  message: string;
  onConfirm: () => void | Promise<void>;
  className?: string;
}) {
  return (
    <button
      className={className}
      onClick={() => {
        if (window.confirm(message)) void onConfirm();
      }}
    >
      {label}
    </button>
  );
}

export async function uploadFile(file: File, folder: string) {
  const body = new FormData();
  body.append("file", file);
  body.append("folder", folder);
  const response = await fetch("/api/admin/upload", { method: "POST", body });
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}
