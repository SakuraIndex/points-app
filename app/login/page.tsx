"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    setMessage("");

    // あなたのVercelのURL（必ず https://〜/auth/callback で終わるように！）
    const APP_URL = "https://points-app-96m3.vercel.app";

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${APP_URL}/auth/callback`, // ✅ 修正：/auth/callback に
      },
    });

    if (error) {
      console.error(error);
      setMessage("送信に失敗しました：" + error.message);
    } else {
      setMessage(
        "ログインリンクをメールに送信しました。メールを確認して Magic Link をクリックしてください。"
      );
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-16 space-y-6 text-center">
      <h1 className="text-2xl font-bold mb-4">ログイン</h1>

      <input
        type="email"
        placeholder="メールアドレスを入力"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full text-gray-900 bg-white"
      />

      <button
        onClick={handleLogin}
        disabled={loading || !email}
        className={`px-4 py-2 rounded text-white w-full ${
          loading
            ? "bg-gray-400 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {loading ? "送信中..." : "Magic Linkを送信"}
      </button>

      {message && (
        <p className="text-sm text-gray-300 mt-4 whitespace-pre-line">{message}</p>
      )}
    </div>
  );
}
