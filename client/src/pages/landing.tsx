import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, TrendingUp, Shield } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <FileText className="text-white text-sm" />
                  </div>
                  <span className="ml-3 text-xl font-semibold text-gray-900"><h1>SmartDoc – Controle de Notas e Pedidos | Açailândia 2025</h1></span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button 
                onClick={() => window.location.href = '/api/login'}
                className="bg-primary hover:bg-primary/90"
              >
                Entrar
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Sistema de Gestão de Documentos
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            Gerencie documentos comerciais com facilidade. Acompanhe entregas, confirmações de recebimento e retornos entre administradores e consultores.
          </p>
          <div className="mt-10">
            <Button 
              size="lg"
              onClick={() => window.location.href = '/api/login'}
              className="bg-primary hover:bg-primary/90 text-lg px-8 py-3"
            >
              Começar Agora
            </Button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900">Funcionalidades</h2>
          <p className="mt-4 text-xl text-gray-600">
            Tudo que você precisa para gerenciar seus documentos
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="text-blue-600" />
              </div>
              <CardTitle>Gestão de Documentos</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Crie, organize e acompanhe todos os seus documentos comerciais em um só lugar.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Users className="text-green-600" />
              </div>
              <CardTitle>Controle de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Sistema de permissões baseado em papéis para administradores e consultores.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="text-orange-600" />
              </div>
              <CardTitle>Fluxo de Trabalho</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Acompanhe o status dos documentos desde a entrega até a conclusão.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Shield className="text-purple-600" />
              </div>
              <CardTitle>Segurança</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Seus documentos estão seguros com autenticação robusta e controle de acesso.
              </CardDescription>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
