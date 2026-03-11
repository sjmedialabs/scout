"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

const ClientChatRedirectPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    const target = query
      ? `/client/dashboard/message?${query}`
      : "/client/dashboard/message";

    router.replace(target);
  }, [router, searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
    </div>
  );
};

export default ClientChatRedirectPage;

