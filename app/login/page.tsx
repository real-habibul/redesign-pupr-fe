"use client";

import Image from "next/image";

import { useState } from "react";
// import useAuth from "@hooks/use-auth";
// import LoginForm from "@components/login-form";
// import Modal from "@components/modal";
// import CustomAlert from "@components/alert";

// import Register from "./register";
// import ForgotPassword from "./forgotpassword";

const LoginPage = () => {
  //   useAuth();
  const [alertMessage, setAlertMessage] = useState("");
  const [alertSeverity, setAlertSeverity] = useState("error");
  const [alertOpen, setAlertOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isForgotPasswordModalOpen, setIsForgotPasswordModalOpen] =
    useState(false);

  const handleAlert = (msg: string, severity: string) => {
    setAlertMessage(msg);
    setAlertSeverity(severity);
    setAlertOpen(true);
  };

  return (
    <div className="relative flex justify-center items-center h-screen gap-8 mx-4 md:gap-12 lg:gap-16">
      <div className="flex flex-col justify-between w-full max-w-[900px] h-full p-8 mx-auto">
        <div className="flex justify-between">
          <Image
            src="/images/login/pupr-logo.png"
            alt="PUPR Logo"
            width={156}
            height={55}
          />
          <Image
            src="/images/login/sipasti-logo.png"
            alt="SIPASTI Logo"
            width={200}
            height={54}
          />
        </div>

        <div className="flex flex-col items-center justify-center flex-grow mt-[56px]">
          <div className="self-center text-center">
            <h5 className="text-H5 text-emphasis-on_surface-high">
              Selamat Datang di Katalog HSPW!
            </h5>
            <p className="text-B1 text-emphasis-on_surface-medium w-full max-w-[384px]">
              Katalog Informasi Harga Satuan Pokok Material Peralatan Tenaga
              Kerja Konstruksi per Wilayah
            </p>
            <p className="font-poppins text-H1">
              Ini seharusnya pakai Poppins dan font-size custom
            </p>
            <p className="font-poppins text-H1 text-[40px]">
              Tes font-size manual
            </p>
            <p className="text-red-500 text-4xl font-bold">
              TES INI HARUS MERAH BESAR
            </p>
            <div className="bg-customtest text-white p-4">
              Kalau ini ungu berarti tailwind.config.js aktif.
            </div>
            <div className="bg-red-500 text-white text-4xl p-4">
              Test Tailwind
            </div>
            <p className="text-test text-testcolor">Hello Custom</p>
          </div>
          {/* <LoginForm
            onAlert={handleAlert}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onOpenForgotPassword={() => setIsForgotPasswordModalOpen(true)}
          /> */}
        </div>

        {/* <div className="flex flex-row justify-between items-center">
          <p className="text-B2 text-neutral-500">
            2024© SIPASTI V.3.0 All Reserved by PUPR
          </p>
          <div className="gap-x-2 flex items-center">
            <Button onClick={() => {}} variant="blue_text" size="B2">
              Kebijakan Privasi
            </Button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="4"
              viewBox="0 0 4 4"
              fill="none">
              <circle cx="2" cy="2" r="2" fill="#B3B3B3" />
            </svg>
            <Button onClick={() => {}} variant="blue_text" size="B2">
              Syarat dan Ketentuan
            </Button>
          </div>
          <CustomAlert
            message={alertMessage}
            severity={alertSeverity}
            openInitially={alertOpen}
            onClose={() => setAlertOpen(false)}
          />
        </div> */}
      </div>

      <div className="hidden md:block max-h-[960px] max-w-[688px]">
        <Image
          src="/images/login/login-asset.png"
          alt="Login Image"
          width={400}
          height={400}
        />
      </div>

      {/* <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}>
        <Register onClose={() => setIsRegisterModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isForgotPasswordModalOpen}
        onClose={() => setIsForgotPasswordModalOpen(false)}>
        <ForgotPassword onClose={() => setIsForgotPasswordModalOpen(false)} />
      </Modal> */}
    </div>
  );
};

export default LoginPage;
