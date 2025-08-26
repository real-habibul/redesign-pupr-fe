"use client";

import * as React from "react";
import { Field, Form, Formik, FieldProps, FormikHelpers } from "formik";
import TextInput from "@components/ui/text-input";
import Button from "@components/ui/button";
// import Store from "@store/perencanaan-data/informasi-umum/store";

type FormValues = {
  kodeRup: string;
  namaPaket: string;
  namaPpk: string;
  jabatanPpk: string;
};

type Props = {
  initialValues?: FormValues;
  hide?: boolean;
  onSubmit?: (values: FormValues, helpers: FormikHelpers<FormValues>) => void;
};

const DEFAULT_VALUES: FormValues = {
  kodeRup: "",
  namaPaket: "",
  namaPpk: "",
  jabatanPpk: "",
};

const SipastiForm: React.FC<Props> = ({
  initialValues = DEFAULT_VALUES,
  hide = true,
  onSubmit,
}) => {
  // const { setSelectedTab: _setSelectedTab } = Store();

  const handleSubmit = React.useCallback(
    (values: FormValues, helpers: FormikHelpers<FormValues>) => {
      if (onSubmit) {
        onSubmit(values, helpers);
      } else {
        console.log(values);
        helpers.setSubmitting(false);
      }
    },
    [onSubmit]
  );

  return (
    <div className={hide ? "hidden" : ""}>
      <div className="space-y-4"></div>

      <div>
        <Formik<FormValues>
          initialValues={initialValues}
          onSubmit={handleSubmit}
          enableReinitialize>
          <Form>
            <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
              <Field name="kodeRup">
                {({ field, form }: FieldProps<string, FormValues>) => (
                  <div className="flex flex-row items-center space-x-4 w-full">
                    <TextInput
                      label="Kode RUP"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                      placeholder="Masukkan Kode RUP"
                      isRequired
                    />
                  </div>
                )}
              </Field>

              <Field name="namaPaket">
                {({ field, form }: FieldProps<string, FormValues>) => (
                  <div className="flex flex-row items-center space-x-4 w-full">
                    <TextInput
                      label="Nama Paket"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                      placeholder="Masukkan Nama Paket"
                      isRequired
                    />
                  </div>
                )}
              </Field>

              <div className="mt-4">
                <Button
                  type="button"
                  variant="solid_blue"
                  fullWidth={false}
                  disabled
                  onClick={() => {}}>
                  Cari Data di SIPASTI
                </Button>
              </div>

              <Field name="namaPpk">
                {({ field, form }: FieldProps<string, FormValues>) => (
                  <div className="flex flex-row items-center space-x-4 w-full">
                    <TextInput
                      label="Nama PPK"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                      placeholder="Masukkan Nama PPK"
                      isRequired
                    />
                  </div>
                )}
              </Field>

              <Field name="jabatanPpk">
                {({ field, form }: FieldProps<string, FormValues>) => (
                  <div className="flex flex-row items-center space-x-4 w-full">
                    <TextInput
                      label="Jabatan PPK"
                      value={field.value ?? ""}
                      onChange={(e) =>
                        form.setFieldValue(field.name, e.target.value)
                      }
                      placeholder="Masukkan Jabatan PPK"
                      isRequired
                    />
                  </div>
                )}
              </Field>
            </div>

            <div className="flex justify-end items-center gap-4 mt-3 bg-neutral-100 px-6 py-8 rounded-[16px]">
              <Button variant="outlined_yellow" fullWidth={false}>
                Kembali
              </Button>
              <Button type="submit" variant="solid_blue" fullWidth={false}>
                Lanjut
              </Button>
            </div>
          </Form>
        </Formik>
      </div>
    </div>
  );
};

export default SipastiForm;
