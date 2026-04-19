"use client";

import { deleteService } from "@/lib/actions";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteServiceButton({ serviceId }: { serviceId: number }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm("Weet je zeker dat je deze dienst wilt verwijderen?")) return;
    await deleteService(serviceId);
    router.refresh();
  }

  return (
    <button
      onClick={handleDelete}
      className="text-red-400 hover:text-red-600 transition-colors"
      title="Verwijderen"
    >
      <Trash2 className="w-4 h-4" />
    </button>
  );
}
