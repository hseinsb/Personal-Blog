"use client";

import dynamic from "next/dynamic";

// Import our password protection component with ssr: false
const PasswordProtection = dynamic(() => import("./PasswordProtection"), {
  ssr: false,
});

interface ClientPasswordProtectionProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function ClientPasswordProtection({
  onSuccess,
  onCancel,
}: ClientPasswordProtectionProps) {
  return <PasswordProtection onSuccess={onSuccess} onCancel={onCancel} />;
}
