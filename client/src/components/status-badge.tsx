import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
  status: "DELIVERED" | "RECEIPT_CONFIRMED" | "RETURN_SENT" | "COMPLETED";
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  const statusConfig = {
    DELIVERED: {
      label: "Entregue",
      variant: "default" as const,
      className: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    },
    RECEIPT_CONFIRMED: {
      label: "Recibo Confirmado",
      variant: "default" as const,
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },
    RETURN_SENT: {
      label: "Retorno Enviado",
      variant: "default" as const,
      className: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    },
    COMPLETED: {
      label: "Concluído",
      variant: "default" as const,
      className: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    },
  };

  const config = statusConfig[status];

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
