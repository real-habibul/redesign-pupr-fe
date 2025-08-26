"use client";
import * as React from "react";
import axios, { AxiosError } from "axios";
import { useAuthActions } from "@hooks/auth/use-auth";
import { useAlert } from "@components/ui/alert";

export type FriendlyError = { friendlyMessage?: string; response?: { data?: { message?: string } } };

function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    const e = err as AxiosError<{ message?: string }> & FriendlyError;
    return e.friendlyMessage ?? e.response?.data?.message ?? e.message ?? "Terjadi kesalahan.";
  }
  if (err instanceof Error && err.message) return err.message;
  return "Terjadi kesalahan.";
}

export function useLogin() {
  const { show } = useAlert();
  const { doLogin, doSsoLogin } = useAuthActions();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value);
  const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value);

  const onLogin = async () => {
    show("Sedang memproses login...", "info");
    setLoading(true);
    try {
      await doLogin(email, password);
      show("Login berhasil!", "success");
    } catch (err: unknown) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  const onSsoLogin = async () => {
    setLoading(true);
    try {
      await doSsoLogin("YOUR_SSO_TOKEN");
      show("Login SSO berhasil!", "success");
    } catch (err: unknown) {
      show(getErrorMessage(err), "error");
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    password,
    loading,
    onEmailChange,
    onPasswordChange,
    onLogin,
    onSsoLogin,
  };
}
