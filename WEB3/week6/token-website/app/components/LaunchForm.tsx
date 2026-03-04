"use client";

import { useState } from "react";
import { AppButton, AppCheckbox, AppInput } from "./ui/primitives";

interface LaunchFormProps {
  onLaunch: (data: {
    decimals: number;
    initialSupply: number;
    enableFreeze: boolean;
  }) => void;
  isSubmitting?: boolean;
  disabled?: boolean;
}

export default function LaunchForm({
  onLaunch,
  isSubmitting = false,
  disabled = false,
}: LaunchFormProps) {
  const [decimals, setDecimals] = useState(9);
  const [initialSupply, setInitialSupply] = useState(1000);
  const [enableFreeze, setEnableFreeze] = useState(false);

  const handleSubmit = () => {
    onLaunch({
      decimals,
      initialSupply,
      enableFreeze,
    });
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <AppInput
          type="number"
          min={0}
          max={9}
          label="Decimals"
          value={decimals}
          onChange={(e) => setDecimals(Number(e.target.value))}
          placeholder="Decimals (0–9)"
          helperText="Common SPL tokens use 6 or 9 decimals."
        />

        <AppInput
          type="number"
          min={1}
          label="Initial supply"
          value={initialSupply}
          onChange={(e) => setInitialSupply(Number(e.target.value))}
          placeholder="Initial supply"
          helperText="Actual minted amount will be supply × 10^decimals."
        />
      </div>

      <AppCheckbox
        checked={enableFreeze}
        onChange={() => setEnableFreeze(!enableFreeze)}
        label="Enable freeze authority for this mint"
      />

      <AppButton
        type="button"
        onClick={handleSubmit}
        disabled={isSubmitting || disabled}
        fullWidth
      >
        {disabled
          ? "Connect your wallet to launch"
          : isSubmitting
          ? "Launching token…"
          : "Launch token"}
      </AppButton>
    </div>
  );
}