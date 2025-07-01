import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CloudUpload } from "lucide-react";

interface CreateDocumentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function CreateDocumentModal({ open, onOpenChange }: CreateDocumentModalProps) {
  const { toast } = useToast();
  const [title, setTitle] = useState("");
  const [consultantId, setConsultantId] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState<File | null>(null);

  // Fetch consultants
  const { data: consultants } = useQuery({
    queryKey: ["/api/consultants"],
    enabled: open,
  });

  const createDocumentMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await fetch("/api/documents", {
        method: "POST",
        body: data,
        credentials: "include",
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`${response.status}: ${errorText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "Success",
        description: "Document created successfully",
      });
      handleClose();
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
        description: "Failed to create document",
        variant: "destructive",
      });
    },
  });

  const handleClose = () => {
    setTitle("");
    setConsultantId("");
    setDescription("");
    setFile(null);
    onOpenChange(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !consultantId || !file) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("consultantId", consultantId);
    formData.append("file", file);
    if (description) {
      formData.append("description", description);
    }

    createDocumentMutation.mutate(formData);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Criar Novo Documento</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="title">Título do Documento *</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Contrato de Revenda..."
                required
              />
            </div>
            
            <div>
              <Label htmlFor="consultant">Consultor Responsável *</Label>
              <Select value={consultantId} onValueChange={setConsultantId} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecionar consultor..." />
                </SelectTrigger>
                <SelectContent>
                  {consultants && Array.isArray(consultants) ? consultants.map((consultant: any) => (
                    <SelectItem key={consultant.id} value={consultant.id}>
                      {consultant.name || `${consultant.firstName} ${consultant.lastName}`}
                    </SelectItem>
                  )) : (
                    <SelectItem value="loading" disabled>Carregando consultores...</SelectItem>
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div>
            <Label htmlFor="file">Arquivo do Documento *</Label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md hover:border-gray-400 transition-colors">
              <div className="space-y-1 text-center">
                <CloudUpload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="flex text-sm text-gray-600">
                  <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-primary hover:text-primary/80 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary">
                    <span>Carregar arquivo</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      accept=".pdf,.doc,.docx,.xls,.xlsx"
                      onChange={handleFileChange}
                      required
                    />
                  </label>
                  <p className="pl-1">ou arraste e solte</p>
                </div>
                <p className="text-xs text-gray-500">PDF, DOC, XLS até 10MB</p>
                {file && (
                  <p className="text-sm text-green-600">
                    Arquivo selecionado: {file.name}
                  </p>
                )}
              </div>
            </div>
          </div>
          
          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Adicione uma descrição para o documento..."
              rows={3}
            />
          </div>
          
          <div className="flex items-center justify-end space-x-3 pt-4">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancelar
            </Button>
            <Button 
              type="submit" 
              disabled={createDocumentMutation.isPending}
              className="bg-primary hover:bg-primary/90"
            >
              {createDocumentMutation.isPending ? "Criando..." : "Criar Documento"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
