import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

interface LoginForm {
  username: string;
  password: string;
}

export function LoginFormComponent() {
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
          // resposta vazia ou malformada
        }
        throw new Error(errorMessage);
      }

      try {
        return await response.json();
      } catch {
        return {}; // backend não retornou nada
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
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Usuário"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Senha"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <button type="submit">Entrar</button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
}
