// import { useState } from "react";
// import { useRouter } from "next/router";
// // import TextInput from "../components/input";
// import Button from "./button";
// // import { login, fetchRole, ssoLogin } from "../services/authService";

// interface Props {
//   onAlert: (msg: string, severity: string) => void;
//   onOpenRegister: () => void;
//   onOpenForgotPassword: () => void;
// }

// const LoginForm = ({
//   onAlert,
//   onOpenRegister,
//   onOpenForgotPassword,
// }: Props) => {
//   const [username, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [errors, setErrors] = useState<{ [key: string]: string }>({});
//   const router = useRouter();

//   // const handleLogin = async () => {
//   //   setErrors({});
//   //   try {
//   //     const data = await login(username, password);
//   //     if (data.status !== "success")
//   //       throw new Error(data.message || "Login failed.");
//   //     localStorage.setItem("token", data.token);
//   //     localStorage.setItem("username", data.data.username);

//   //     const roleData = await fetchRole(data.token);
//   //     if (roleData.status !== "success")
//   //       throw new Error("Gagal memeriksa role pengguna.");

//   //     localStorage.setItem("role", roleData.data);
//   //     router.push("/dashboard");
//   //     onAlert("Login berhasil!", "success");
//   //   } catch (err: any) {
//   //     onAlert(err.message, "error");
//   //   }
//   // };

//   // const handleSSOLogin = async () => {
//   //   try {
//   //     const data = await ssoLogin("YOUR_SSO_TOKEN");
//   //     if (data.success) {
//   //       localStorage.setItem("token", data.token);
//   //       onAlert("Login SSO berhasil!", "success");
//   //       router.push("/dashboard");
//   //     } else {
//   //       setErrors({ username: "Login SSO gagal." });
//   //     }
//   //   } catch (err: any) {
//   //     setErrors({ username: err.message });
//   //   }
//   // };

//   return (
//     <div className="space-y-4 max-w-[336px] w-full">
//       <TextInput
//         label="Email"
//         placeholder="Masukkan Email"
//         state="border"
//         value={username}
//         onChange={(e) => setEmail(e.target.value)}
//         isRequired
//         errorMessage="Email tidak boleh kosong"
//       />
//       {errors.username && (
//         <p className="text-custom-red-500">{errors.username}</p>
//       )}

//       <TextInput
//         label="Kata Sandi"
//         placeholder="Masukkan kata sandi"
//         value={password}
//         onChange={(e) => setPassword(e.target.value)}
//         type="password"
//         state="border"
//         isRequired
//         errorMessage="Kata sandi tidak boleh kosong"
//       />
//       {errors.password && <p className="text-red-500">{errors.password}</p>}

//       <Button
//         onClick={onOpenForgotPassword}
//         variant="red_text"
//         size="ExtraSmall"
//         className="custom-padding">
//         Lupa Kata Sandi
//       </Button>
//       <Button
//         onClick={handleLogin}
//         variant="solid_blue"
//         size="Medium"
//         className="w-full">
//         Masuk
//       </Button>

//       <div className="relative flex py-4 items-center">
//         <div className="flex-grow border-t-2 border-emphasis-on_surface-small rounded-full" />
//         <span className="mx-4 text-custom-neutral-500 text-Overline">ATAU</span>
//         <div className="flex-grow border-t-2 border-emphasis-on_surface-small rounded-full" />
//       </div>

//       <Button
//         onClick={handleSSOLogin}
//         variant="disabled"
//         size="Medium"
//         className="w-full">
//         Masuk menggunakan SSO
//       </Button>

//       <div className="flex justify-center gap-1">
//         <p className="text-Small text-neutral-500">Belum punya akun?</p>
//         <Button onClick={onOpenRegister} variant="blue_text" size="Extra_Small">
//           Daftar
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default LoginForm;
