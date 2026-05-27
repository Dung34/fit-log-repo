"use client";

import { Button } from "konsta/react";

interface DuplicateSetButtonProps {
  onClick: () => void;
}

export function DuplicateSetButton({ onClick }: DuplicateSetButtonProps) {
  return (
    <Button
      clear
      className="!min-h-11 !min-w-11"
      aria-label="Nhân bản set"
      onClick={onClick}
    >
      ⧉
    </Button>
  );
}
