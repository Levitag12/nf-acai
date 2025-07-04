import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Bell, LogOut } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { queryClient } from "@/lib/queryClient";

export default function Navbar() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Erro ao fazer logout");
      }
      return response.json();
    },
    onSuccess: () => {
      // Clear all cached queries to reset authentication state
      queryClient.clear();
      setLocation("/");
      // Force a page reload to ensure clean state
      setTimeout(() => window.location.reload(), 100);
    },
  });

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <FileText className="text-white text-sm" />
                </div>
                <span className="ml-3 text-xl font-semibold text-gray-900">SmartDoc</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-500">Bem-vindo,</span>
              <span className="text-sm font-medium text-gray-900">
                {user?.name || user?.email}
              </span>
              <Badge variant={user?.role === "ADMIN" ? "default" : "secondary"}>
                {user?.role === "ADMIN" ? "Administrador" : "Consultor"}
              </Badge>
            </div>
            <div className="relative">
              <Button variant="ghost" size="sm">
                <Bell className="h-5 w-5 text-gray-400" />
              </Button>
            </div>
            <div className="relative">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={() => logoutMutation.mutate()}
                disabled={logoutMutation.isPending}
              >
                <LogOut className="h-5 w-5 text-gray-600" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
