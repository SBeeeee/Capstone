export const prettifyEnum = (value?: string): string =>
  value
    ? value
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
    : "";

export const prettifyReason = (reason?: string): string =>
  reason
    ? reason
        .replace(/_/g, " ")
        .replace(/>=/g, "≥")
        .replace(/<=/g, "≤")
        .replace(/->/g, "→")
        .replace(/\b(\d+)\s?C\b/g, "$1 °C")
        .replace(/\s+/g, " ")
        .trim()
        .replace(/^./, (c) => c.toUpperCase())
    : "";
