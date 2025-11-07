"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: "https://points-app-96m3.vercel.app/", // ←あなたのVercel URL
      },
    });
    if (error) setMessage("送信に失敗しました：" + error.message);
    else setMessage("ログインリンクをメールに送信しました。メールを確認してください。");
  };

  return (
    <div className="max-w-md mx-auto mt-16 space-y-4 text-center">
      <h1 className="text-2xl font-bold mb-2">ログイン</h1>
      <input
        type="email"
        placeholder="メールアドレスを入力"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border p-2 rounded w-full text-gray-900 bg-white"
      />
      <button
        onClick={handleLogin}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Magic Linkを送信
      </button>
      {message && <p className="text-sm text-gray-400 mt-2">{message}</p>}
    </div>
  );
}
