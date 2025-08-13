"use client";

import * as React from "react";
import MUISelect from "@components/ui/select";

export type Option = { label: string; value: string };

interface SelectCompatProps
  extends Omit<
    React.ComponentProps<typeof MUISelect>,
    "options" | "value" | "onChange" | "required"
  > {
  options: Option[];
  value: string;
  onSelect: (opt: Option) => void;
  isRequired?: boolean;
  errorMessage?: string;
}

export default function SelectCompat({
  options,
  value,
  onSelect,
  isRequired,
  errorMessage,
  ...rest
}: SelectCompatProps) {
  return (
    <MUISelect
      options={options}
      value={value}
      onChange={(v) => {
        const opt = options.find((o) => o.value === v);
        if (opt) onSelect(opt);
      }}
      required={isRequired}
      {...rest}
    />
  );
}
