"use client";

import { useState, useEffect } from "react";

export function useClassifiedAccess() {
  const [hasAccess, setHasAccess] = useState(false);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Check if user has access from session storage
    const accessGranted =
      sessionStorage.getItem("classifiedAccess") === "granted";
    setHasAccess(accessGranted);
    setIsChecking(false);
  }, []);

  const grantAccess = () => {
    sessionStorage.setItem("classifiedAccess", "granted");
    setHasAccess(true);
  };

  const revokeAccess = () => {
    sessionStorage.removeItem("classifiedAccess");
    setHasAccess(false);
  };

  return { hasAccess, isChecking, grantAccess, revokeAccess };
}
