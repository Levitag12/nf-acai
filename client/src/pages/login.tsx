import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

interface LoginForm {
  username: string;
  password: string;
}

interface LoginResponse {
  message: string;
  role?: 'ADMIN' | 'CONSULTANT';
}

export default function LoginPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm): Promise<LoginResponse> => {
      const apiUrl = "https://nf-acai.onrender.com/api/login";
      console.log("PASSO 1: A tentar fazer fetch para:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      console.log("PASSO 2: Resposta do fetch recebida. Status:", response.status);

      const responseData = await response.json();
      if (!response.ok) {
        console.error("ERRO: A API respondeu com um erro:", responseData);
        throw new Error(responseData.message || "Erro ao fazer login");
      }

      console.log("PASSO 3: Resposta da API com sucesso:", responseData);
      return responseData;
    },
    onSuccess: (data) => {
      console.log("PASSO 4: Sucesso! Função do utilizador:", data.role);

      if (data.role === 'ADMIN') {
        console.log("PASSO 5: A navegar para /admin-dashboard");
        navigate("/admin-dashboard");
      } else if (data.role === 'CONSULTANT') {
        console.log("PASSO 5: A navegar para /consultant-dashboard");
        navigate("/consultant-dashboard");
      } else {
        console.error("ERRO: Função de utilizador não reconhecida:", data.role);
        setError("Função de utilizador não reconhecida.");
      }
    },
    onError: (err: any) => {
      console.error("ERRO GERAL: A mutação falhou:", err);
      setError(err.message || "Erro desconhecido");
    },
  });

  const handleLoginClick = () => {
    console.log("PASSO 0: Botão de login clicado.");
    setError(null);
    loginMutation.mutate({ username, password });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleLoginClick();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">
          Gestão de Documentos Fiscais e Pedidos
        </h1>
        <p className="text-center text-sm mb-6 text-gray-600">
          Entre com seu login para acessar o sistema
        </p>
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={handleKeyPress}
            required
            className="w-full px-4 py-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="button"
            onClick={handleLoginClick}
            disabled={loginMutation.isPending}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          >
            {loginMutation.isPending ? 'Entrando...' : 'Entrar'}
          </button>
        </div>
        <p className="text-center text-xs mt-6 text-gray-500">
          Feito por Welington Lima
        </p>
        <div className="mt-4 text-center text-sm font-semibold bg-gray-200 p-2 rounded">
          Sistema inteligente para gestão de notas fiscais e pedidos da unidade
          de Açailândia – Safra 2025/2026
        </div>
      </div>
    </div>
  );
}
