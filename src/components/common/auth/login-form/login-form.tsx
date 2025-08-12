"use client";

import axios from "axios";
import { useState } from "react";
import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";
import { useAuthActions } from "@hooks/use-auth";
import { useAlert } from "@components/ui/alert";

interface Props {
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

const LoginForm = ({ onOpenRegister, onOpenForgotPassword }: Props) => {
  const { show } = useAlert();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { doLogin, doSsoLogin } = useAuthActions();

  const handleLogin = async () => {
    show("Sedang memproses login...", "info");
    setLoading(true);
    try {
      await doLogin(email, password);
      show("Login berhasil!", "success");
    } catch (err: any) {
      let msg = "Login gagal.";
      if (axios.isAxiosError(err)) {
        msg =
          (err as any).friendlyMessage ??
          err.response?.data?.message ??
          err.message ??
          msg;
      } else if (err?.message) {
        msg = err.message;
      }
      show(msg, "error");
    } finally {
      setLoading(false);
    }
  };

  const handleSSOLogin = async () => {
    setLoading(true);
    try {
      await doSsoLogin("YOUR_SSO_TOKEN");
      show("Login SSO berhasil!", "success");
    } catch (err: any) {
      show(err?.message ?? "Login SSO gagal.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4 max-w-[336px] w-full">
      <div className="space-y-4">
        <div>
          <TextInput
            label="Email"
            placeholder="Masukkan Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            isRequired
          />
        </div>

        <div className="space-y-1">
          <TextInput
            label="Kata Sandi"
            placeholder="Masukkan Kata Sandi"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            isRequired
          />

          <button
            type="button"
            onClick={onOpenForgotPassword}
            className="text-ExtraSmall text-solid_basic_red_500 font-medium hover:underline cursor-pointer">
            Lupa Kata Sandi
          </button>
        </div>
      </div>

      <div className="w-full max-w-[336px] space-y-2">
        <Button
          variant="solid_blue"
          onClick={handleLogin}
          disabled={loading || !email.trim() || !password.trim()}>
          {loading ? "Memproses..." : "Masuk"}
        </Button>

        <div className="flex items-center h-[26px] gap-4 w-full">
          <div className="flex-grow h-[2px] bg-surface_light_outline" />
          <span className="text-B2 text-solid_basic_neutral_500 whitespace-nowrap">
            ATAU
          </span>
          <div className="flex-grow h-[2px] bg-surface_light_outline" />
        </div>

        <Button
          variant="outlined_yellow"
          onClick={handleSSOLogin}
          disabled={loading}>
          Masuk dengan SSO
        </Button>

        <div className="flex justify-center items-center gap-1">
          <p className="text-ExtraSmall text-solid_basic_neutral_500 text-emphasis-on_surface-medium">
            Belum punya akun?
          </p>
          <button
            type="button"
            onClick={onOpenRegister}
            className="text-ExtraSmall text-solid_basic_blue_500 font-medium hover:underline">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
