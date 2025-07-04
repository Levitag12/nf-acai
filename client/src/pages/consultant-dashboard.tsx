import { useEffect, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import Navbar from "@/components/navbar";
import StatsCard from "@/components/stats-card";
import SubmitReturnModal from "@/components/submit-return-modal";
import StatusBadge from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock, Download, Upload, Check, FileText, FileX, FileCheck } from "lucide-react";

export default function ConsultantDashboard() {
  const { toast } = useToast();
  const { isAuthenticated, isLoading } = useAuth();
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

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

  const confirmReceiptMutation = useMutation({
    mutationFn: async (documentId: string) => {
      await apiRequest("PATCH", `/api/documents/${documentId}/status`, {
        status: "RECEIPT_CONFIRMED"
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Receipt confirmed successfully",
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
        description: "Failed to confirm receipt",
        variant: "destructive",
      });
    },
  });

  const handleDownload = (document: any) => {
    const initialAttachment = document.attachments?.find((a: any) => a.attachmentType === "INITIAL");
    if (initialAttachment) {
      window.open(initialAttachment.fileUrl, '_blank');
    }
  };

  const handleSubmitReturn = (document: any) => {
    setSelectedDocument(document);
    setShowReturnModal(true);
  };

  const getDocumentIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
        return <FileText className="text-red-600" />;
      case 'doc':
      case 'docx':
        return <FileCheck className="text-blue-600" />;
      case 'xls':
      case 'xlsx':
        return <FileX className="text-green-600" />;
      default:
        return <FileText className="text-gray-600" />;
    }
  };

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
              <h1 className="text-2xl font-semibold text-gray-900">Meus Documentos</h1>
              <p className="mt-1 text-sm text-gray-500">Visualize e gerencie seus documentos atribuídos</p>
            </div>
          </div>

          {/* Consultant Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatsCard
              title="Aguardando Confirmação"
              value={stats?.delivered || 0}
              icon={Clock}
              color="blue"
              loading={statsLoading}
            />
            <StatsCard
              title="Disponível para Download"
              value={stats?.receiptConfirmed || 0}
              icon={Download}
              color="green"
              loading={statsLoading}
            />
            <StatsCard
              title="Aguardando Retorno"
              value={stats?.returnSent || 0}
              icon={Upload}
              color="orange"
              loading={statsLoading}
            />
          </div>

          {/* Consultant Documents */}
          <Card>
            <CardHeader>
              <CardTitle>Documentos Atribuídos</CardTitle>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : documents?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nenhum documento atribuído
                </div>
              ) : (
                <div className="space-y-0">
                  {documents?.map((document: any) => {
                    const initialAttachment = document.attachments?.find((a: any) => a.attachmentType === "INITIAL");
                    
                    return (
                      <div
                        key={document.id}
                        className={`border-l-4 p-6 ${
                          document.status === "DELIVERED" ? "border-blue-400 bg-blue-50" :
                          document.status === "RECEIPT_CONFIRMED" ? "border-green-400 bg-green-50" :
                          document.status === "RETURN_SENT" ? "border-orange-400 bg-orange-50" :
                          "border-purple-400 bg-purple-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0">
                              <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${
                                document.status === "DELIVERED" ? "bg-blue-100" :
                                document.status === "RECEIPT_CONFIRMED" ? "bg-green-100" :
                                document.status === "RETURN_SENT" ? "bg-orange-100" :
                                "bg-purple-100"
                              }`}>
                                {initialAttachment && getDocumentIcon(initialAttachment.fileName)}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-lg font-medium text-gray-900">{document.title}</h4>
                              <p className="text-sm text-gray-500">
                                {document.status === "DELIVERED" && `Entregue em ${new Date(document.createdAt).toLocaleDateString('pt-BR')}`}
                                {document.status === "RECEIPT_CONFIRMED" && `Recibo confirmado em ${new Date(document.updatedAt).toLocaleDateString('pt-BR')}`}
                                {document.status === "RETURN_SENT" && `Retorno enviado em ${new Date(document.updatedAt).toLocaleDateString('pt-BR')}`}
                                {document.status === "COMPLETED" && `Concluído em ${new Date(document.updatedAt).toLocaleDateString('pt-BR')}`}
                              </p>
                              <div className="mt-2">
                                <StatusBadge status={document.status} />
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center space-x-3">
                            {document.status === "DELIVERED" && (
                              <>
                                <Button 
                                  onClick={() => confirmReceiptMutation.mutate(document.id)}
                                  disabled={confirmReceiptMutation.isPending}
                                  className="bg-blue-600 hover:bg-blue-700"
                                >
                                  <Check className="w-4 h-4 mr-2" />
                                  Confirmar Recebimento
                                </Button>
                                <Button 
                                  variant="outline" 
                                  disabled
                                  className="text-gray-400 cursor-not-allowed"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                              </>
                            )}
                            {document.status === "RECEIPT_CONFIRMED" && (
                              <>
                                <Button 
                                  onClick={() => handleDownload(document)}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <Download className="w-4 h-4 mr-2" />
                                  Download
                                </Button>
                                <Button 
                                  onClick={() => handleSubmitReturn(document)}
                                  className="bg-orange-600 hover:bg-orange-700"
                                >
                                  <Upload className="w-4 h-4 mr-2" />
                                  Enviar Retorno
                                </Button>
                              </>
                            )}
                            {document.status === "RETURN_SENT" && (
                              <div className="text-sm text-gray-500 flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                Aguardando confirmação de recebimento
                              </div>
                            )}
                            {document.status === "COMPLETED" && (
                              <div className="text-sm text-green-600 flex items-center">
                                <Check className="w-4 h-4 mr-1" />
                                Processo concluído
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <SubmitReturnModal
        open={showReturnModal}
        onOpenChange={setShowReturnModal}
        document={selectedDocument}
      />
    </div>
  );
}
