import Button from "@components/ui/button";
import type { SxProps, Theme } from "@mui/material/styles";

type ActionButtonProps = {
  label?: string;
  variant?: "solid_blue" | "outlined_yellow" | "text_red" | "text_blue";
  onClick?: () => void;
  disabled?: boolean;
  sx?: SxProps<Theme>;
  fullWidth?: boolean;
};

type Props = {
  actionButton?: ActionButtonProps;
};

export default function SomeComponent({ actionButton }: Props) {
  return (
    <div className="flex justify-end">
      {actionButton && (
        <Button
          variant={actionButton.variant ?? "solid_blue"}
          label={actionButton.label}
          onClick={actionButton.onClick}
          disabled={actionButton.disabled}
          sx={actionButton.sx}
          fullWidth={actionButton.fullWidth}
        />
      )}
    </div>
  );
}
