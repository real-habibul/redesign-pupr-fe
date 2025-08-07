"use client";

import Image from "next/image";

import { useState } from "react";
import Button from "@components/button";
// import { FaArrowRight, FaArrowLeft } from "react-icons/fa";
// import useAuth from "@hooks/use-auth";
import LoginForm from "@components/login-form";
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
      <div className="flex flex-col justify-between w-full h-full p-8 mx-auto">
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

        <div className="flex flex-col items-center justify-center h-screen space-y-14">
          <div className="text-center px-4">
            <h5 className="text-H5 text-emphasis_light_on_surface_high ">
              Selamat Datang di Katalog HSPW!
            </h5>
            <p className="text-B1 text-emphasis_light_on_surface_medium max-w-[384px] mx-auto">
              Katalog Informasi Harga Satuan Pokok Material Peralatan Tenaga
              Kerja Konstruksi per Wilayah
            </p>
          </div>

          <LoginForm
            onAlert={handleAlert}
            onOpenRegister={() => setIsRegisterModalOpen(true)}
            onOpenForgotPassword={() => setIsForgotPasswordModalOpen(true)}
          />
        </div>

        <div className="flex flex-row justify-between items-center">
          <p className="text-B2 text-neutral-500">
            2025© SIPASTI V.3.0 All Reserved by PUPR
          </p>
          <div className="gap-x-2 flex items-center">
            <button className="text-B2 text-solid_basic_blue_500 font-medium hover:underline">
              Kebijakan Privasi
            </button>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="4"
              height="4"
              viewBox="0 0 4 4"
              fill="none">
              <circle cx="2" cy="2" r="2" fill="#B3B3B3" />
            </svg>

            <button className="text-B2 text-solid_basic_blue_500 font-medium hover:underline">
              Syarat dan Ketentuan
            </button>
          </div>
          {/* <CustomAlert
            message={alertMessage}
            severity={alertSeverity}
            openInitially={alertOpen}
            onClose={() => setAlertOpen(false)}
          /> */}
        </div>
      </div>

      <div className="hidden md:block w-full h-screen relative">
        <Image
          src="/images/login/login-asset.svg"
          alt="Login Image"
          fill
          className="object-contain"
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
