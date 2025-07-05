import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

interface LoginForm {
  username: string;
  password: string;
}

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loginMutation = useMutation({
    mutationFn: async (data: LoginForm) => {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        let errorMessage = "Erro ao fazer login";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // Erro ao fazer parsing do JSON (possivelmente resposta vazia)
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch {
        return {}; // Caso o backend não envie JSON
      }
    },
    onSuccess: () => {
      window.location.href = "/dashboard";
    },
    onError: (err: any) => {
      setError(err.message || "Erro desconhecido");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    loginMutation.mutate({ username, password });
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
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded"
          />
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          >
            Entrar
          </button>
        </form>
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
