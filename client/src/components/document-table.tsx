import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import StatusBadge from "./status-badge";
import { FileText, FileCheck, FileX, MoreVertical } from "lucide-react";

interface DocumentTableProps {
  documents: any[];
  loading: boolean;
  isAdmin: boolean;
  onConfirmReturn?: (id: string) => void;
  confirmingReturn?: boolean;
}

export default function DocumentTable({ 
  documents, 
  loading, 
  isAdmin, 
  onConfirmReturn,
  confirmingReturn 
}: DocumentTableProps) {
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

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (documents.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Nenhum documento encontrado
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Documento
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Consultor
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Criado em
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Atualizado em
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {documents.map((document) => {
            const initialAttachment = document.attachments?.find((a: any) => a.attachmentType === "INITIAL");
            
            return (
              <tr key={document.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                        {initialAttachment && getDocumentIcon(initialAttachment.fileName)}
                      </div>
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{document.title}</div>
                      <div className="text-sm text-gray-500">ID: {document.id.slice(0, 8)}...</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {document.consultant.name || document.consultant.firstName}
                  </div>
                  <div className="text-sm text-gray-500">{document.consultant.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <StatusBadge status={document.status} />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(document.createdAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(document.updatedAt).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {isAdmin && document.status === "RETURN_SENT" && (
                    <Button
                      variant="link"
                      onClick={() => onConfirmReturn?.(document.id)}
                      disabled={confirmingReturn}
                      className="text-primary hover:text-primary/90 mr-3"
                    >
                      Confirmar Recebimento
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4 text-gray-400" />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
