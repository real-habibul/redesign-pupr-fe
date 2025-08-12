"use client";
import * as React from "react";
import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";

interface LoginFormProps {
  email: string;
  password: string;
  loading: boolean;
  onEmailChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPasswordChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onLogin: () => void;
  onSsoLogin: () => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  loading,
  onEmailChange,
  onPasswordChange,
  onLogin,
  onSsoLogin,
  onOpenRegister,
  onOpenForgotPassword,
}) => {
  return (
    <div className="space-y-4 max-w-[336px] w-full">
      <div className="space-y-4">
        <div>
          <TextInput
            label="Email"
            placeholder="Masukkan Email"
            value={email}
            onChange={onEmailChange}
            type="email"
            isRequired
          />
        </div>

        <div className="space-y-1">
          <TextInput
            label="Kata Sandi"
            placeholder="Masukkan Kata Sandi"
            value={password}
            onChange={onPasswordChange}
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
          onClick={onLogin}
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
          onClick={onSsoLogin}
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
