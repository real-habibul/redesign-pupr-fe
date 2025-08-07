import { useState } from "react";
// import { useRouter } from "next/router";
import TextInput from "@components/text-input";
import Button from "@components/button";
// import { login, fetchRole, ssoLogin } from "../services/authService";

interface Props {
  onAlert: (msg: string, severity: string) => void;
  onOpenRegister: () => void;
  onOpenForgotPassword: () => void;
}

const LoginForm = ({
  onAlert,
  onOpenRegister,
  onOpenForgotPassword,
}: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  //   const router = useRouter();

  // const handleLogin = async () => {
  //   setErrors({});
  //   try {
  //     const data = await login(username, password);
  //     if (data.status !== "success")
  //       throw new Error(data.message || "Login failed.");
  //     localStorage.setItem("token", data.token);
  //     localStorage.setItem("username", data.data.username);

  //     const roleData = await fetchRole(data.token);
  //     if (roleData.status !== "success")
  //       throw new Error("Gagal memeriksa role pengguna.");

  //     localStorage.setItem("role", roleData.data);
  //     router.push("/dashboard");
  //     onAlert("Login berhasil!", "success");
  //   } catch (err: any) {
  //     onAlert(err.message, "error");
  //   }
  // };

  // const handleSSOLogin = async () => {
  //   try {
  //     const data = await ssoLogin("YOUR_SSO_TOKEN");
  //     if (data.success) {
  //       localStorage.setItem("token", data.token);
  //       onAlert("Login SSO berhasil!", "success");
  //       router.push("/dashboard");
  //     } else {
  //       setErrors({ username: "Login SSO gagal." });
  //     }
  //   } catch (err: any) {
  //     setErrors({ username: err.message });
  //   }
  // };

  return (
    <div className="space-y-4 max-w-[336px] w-full">
      <div className="max-w-md mx-auto space-y-4">
        <TextInput
          label="Email"
          placeholder="Masukkan email kamu"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          type="email"
          isRequired
        />
        <div className="space-y-1">
          <TextInput
            label="Kata Sandi"
            placeholder="Masukkan password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            isRequired
          />
          <button className="text-B2 text-solid_basic_red_500 font-medium hover:underline">
            Lupa Kata Sandi
          </button>
        </div>
      </div>

      <div className="w-full max-w-[336px] space-y-2">
        <Button variant="solid_blue" className="w-full">
          Masuk
        </Button>
        <div className="flex items-center h-[26px] gap-4 w-full">
          <div className="flex-grow h-[2px] bg-surface_light_outline" />
          <span className="text-B2 text-solid_basic_neutral_500 whitespace-nowrap">
            ATAU
          </span>
          <div className="flex-grow h-[2px] bg-surface_light_outline" />
        </div>

        <Button variant="outlined_yellow" className="w-full">
          Masuk dengan SSO
        </Button>

        <div className="flex justify-center items-center gap-1">
          <p className="text-ExtraSmall text-solid_basic_neutral_500 text-emphasis-on_surface-medium">
            Belum punya akun?
          </p>
          <button className="text-ExtraSmall text-solid_basic_blue_500 font-medium hover:underline">
            Daftar
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
