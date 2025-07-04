import { Badge } from "@/components/ui/badge";

// 1. Adicionado "ARCHIVED" aos tipos de status permitidos
interface StatusBadgeProps {
  status: "DELIVERED" | "RECEIPT_CONFIRMED" | "RETURN_SENT" | "COMPLETED" | "ARCHIVED";
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
    // 2. Adicionada a configuração para o novo status "ARCHIVED"
    ARCHIVED: {
      label: "Arquivado",
      variant: "default" as const,
      className: "bg-slate-100 text-slate-800 hover:bg-slate-100",
    },
  };

  // 3. Adicionado um fallback para evitar erros futuros
  const config = statusConfig[status];

  if (!config) {
    return (
      <Badge variant="secondary">
        Desconhecido
      </Badge>
    );
  }

  return (
    <Badge variant={config.variant} className={config.className}>
      {config.label}
    </Badge>
  );
}
