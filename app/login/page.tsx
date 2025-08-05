"use client";

import Image from "next/image";

import { useState } from "react";
import Button from "@components/button";
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
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

        <div className="flex flex-col items-center justify-center h-screen">
          <div className="text-center px-4">
            <h5 className="text-H5 text-emphasis-on-surface-high">
              Selamat Datang di Katalog HSPW!
            </h5>
            <p className="text-B1 text-emphasis-on-surface-medium max-w-[384px] mx-auto">
              Katalog Informasi Harga Satuan Pokok Material Peralatan Tenaga
              Kerja Konstruksi per Wilayah
            </p>
          </div>
          <Button variant="solid_blue" className="w-full">
            Masuk
          </Button>
          <Button variant="outlined_yellow" className="w-full">
            Masuk dengan SSO
          </Button>

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

      <div className="hidden md:block w-1/2 h-screen relative">
        <Image
          src="/images/login/login-asset.svg"
          alt="Login Image"
          fill
          className="object-cover"
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
