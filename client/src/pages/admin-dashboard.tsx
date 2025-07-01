import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import StatsCard from "@/components/stats-card";
import DocumentTable from "@/components/document-table";
import CreateDocumentModal from "@/components/create-document-modal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Plus, Search, Truck, CheckCircle, Reply, CheckCheck } from "lucide-react";

export default function AdminDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Redirect to home if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
      return;
    }
  }, [isAuthenticated, isLoading, toast]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/stats"],
    retry: false,
  });

  const { data: documents, isLoading: documentsLoading } = useQuery({
    queryKey: ["/api/documents"],
    retry: false,
  });

  const confirmReturnMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest("PATCH", `/api/documents/${documentId}/status`, {
        status: "COMPLETED"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Return confirmed successfully",
      });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Error",
        description: "Failed to confirm return",
        variant: "destructive",
      });
    },
  });

  const filteredDocuments = documents?.filter((doc: any) => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.consultant.name?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = !statusFilter || doc.status === statusFilter;
    return matchesSearch && matchesStatus;
  }) || [];

  const filterButtons = [
    { label: "Todos os Documentos", value: null, color: "gray" },
    { label: "Aguardando Recibo", value: "DELIVERED", color: "blue" },
    { label: "Aguardando Retorno", value: "RECEIPT_CONFIRMED", color: "green" },
    { label: "Retornos para Verificar", value: "RETURN_SENT", color: "orange" },
    { label: "Concluídos", value: "COMPLETED", color: "purple" },
  ];

  if (isLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          {/* Header Section */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Painel Administrativo</h1>
              <p className="mt-1 text-sm text-gray-500">Gerencie documentos e acompanhe o fluxo de trabalho</p>
            </div>
            <div className="mt-4 sm:mt-0">
              <Button 
                onClick={() => setShowCreateModal(true)}
                className="bg-primary hover:bg-primary/90"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Documento
              </Button>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatsCard
              title="Entregue"
              value={stats?.delivered || 0}
              icon={Truck}
              color="blue"
              loading={statsLoading}
            />
            <StatsCard
              title="Recibo Confirmado"
              value={stats?.receiptConfirmed || 0}
              icon={CheckCircle}
              color="green"
              loading={statsLoading}
            />
            <StatsCard
              title="Retorno Enviado"
              value={stats?.returnSent || 0}
              icon={Reply}
              color="orange"
              loading={statsLoading}
            />
            <StatsCard
              title="Concluído"
              value={stats?.completed || 0}
              icon={CheckCheck}
              color="purple"
              loading={statsLoading}
            />
          </div>

          {/* Filter Buttons */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap gap-2">
                {filterButtons.map((filter) => (
                  <Button
                    key={filter.value || "all"}
                    variant={statusFilter === filter.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setStatusFilter(filter.value)}
                    className={statusFilter === filter.value ? 
                      `bg-${filter.color}-500 hover:bg-${filter.color}-600` : ""
                    }
                  >
                    {filter.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Documents Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Lista de Documentos</CardTitle>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar documentos..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <DocumentTable
                documents={filteredDocuments}
                loading={documentsLoading}
                isAdmin={true}
                onConfirmReturn={(id) => confirmReturnMutation.mutate(id)}
                confirmingReturn={confirmReturnMutation.isPending}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <CreateDocumentModal
        open={showCreateModal}
        onOpenChange={setShowCreateModal}
      />
    </div>
  );
}
