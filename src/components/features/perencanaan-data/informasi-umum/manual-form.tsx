"use client";

import * as React from "react";
import {
  Field,
  Form,
  Formik,
  type FieldProps,
  type FormikHelpers,
} from "formik";
import { useRouter } from "next/navigation";
import TextInput from "@components/ui/text-input";
import MUISelect from "@components/ui/select";
import Button from "@components/ui/button";
import { useInformasiUmum } from "@hooks/perencanaan-data/use-informasi-umum";
import type {
  Option,
  ManualFormValues,
} from "../../../../types/perencanaan-data/informasi-umum";

interface ManualFormProps {
  initialValues?: ManualFormValues;
  hide?: boolean;
  balaiOptions?: Option[];
}

const DEFAULT_INITIAL_VALUES: ManualFormValues = {
  kodeRup: "",
  namaBalai: null,
  namaPaket: "",
  namaPpk: "",
  jabatanPpk: "",
};

const ManualForm: React.FC<ManualFormProps> = ({
  initialValues = DEFAULT_INITIAL_VALUES,
  hide = true,
  balaiOptions = [],
}) => {
  const router = useRouter();
  const { submitManual } = useInformasiUmum();

  const selectOptions = React.useMemo(
    () => balaiOptions.map((o) => ({ label: o.label, value: String(o.value) })),
    [balaiOptions]
  );

  const handleSubmit = async (
    values: ManualFormValues,
    _helpers: FormikHelpers<ManualFormValues>
  ) => {
    const ok = await submitManual(values, { redirect: false });
    if (ok) {
      router.push("/perencanaan-data/identifikasi-kebutuhan");
    }
  };

  return (
    <div className={hide ? "hidden" : ""}>
      <Formik<ManualFormValues>
        initialValues={initialValues}
        onSubmit={handleSubmit}
        enableReinitialize>
        <Form>
          <div className="mt-3 bg-neutral-100 px-6 py-8 rounded-[16px] space-y-8">
            <Field name="kodeRup">
              {({ field, form }: FieldProps<string>) => (
                <div className="flex flex-row items-center space-x-4">
                  <TextInput
                    label="Kode RUP"
                    value={field.value ?? ""}
                    onChange={(e) =>
                      form.setFieldValue(field.name, e.target.value)
                    }
                    placeholder="Masukkan Kode RUP"
                  />
                </div>
              )}
            </Field>

            <Field name="namaBalai">
              {({ field, form }: FieldProps<Option | null>) => {
                const currentStringValue =
                  field.value?.value !== undefined &&
                  field.value?.value !== null
                    ? String(field.value.value)
                    : "";
                return (
                  <div className="flex flex-row items-center space-x-4">
                    <MUISelect
                      label="Nama Balai"
                      value={currentStringValue}
                      onChange={(val) => {
                        const found = selectOptions.find(
                          (o) => o.value === val
                        );
                        form.setFieldValue(
                          field.name,
                          found ? { label: found.label, value: val } : null
                        );
                      }}
                      options={selectOptions}
                      required
                      placeholder="Pilih Nama Balai"
                    />
                  </div>
                );
              }}
            </Field>

            <Field name="namaPaket">
              {({ field, form }: FieldProps<string>) => (
                <div className="flex flex-row items-center space-x-4">
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

            <Field name="namaPpk">
              {({ field, form }: FieldProps<string>) => (
                <div className="flex flex-row items-center space-x-4">
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
              {({ field, form }: FieldProps<string>) => (
                <div className="flex flex-row items-center space-x-4">
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
            <Button
              type="submit"
              variant="solid_blue"
              fullWidth={false}
              label="Lanjut"
            />
          </div>
        </Form>
      </Formik>
    </div>
  );
};

export default ManualForm;
