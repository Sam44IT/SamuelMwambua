export const normalizeExternalUrl = (url) => {
  const value = String(url || "").trim();
  if (!value || value === "#") return "#";
  if (/^(https?:)?\/\//i.test(value)) return value;
  return `https://${value}`;
};

export const normalizeEmailHref = (email, subject = "", body = "") => {
  const value = String(email || "").trim();
  if (!value) return "#";

  const params = new URLSearchParams();
  if (subject) params.set("subject", subject);
  if (body) params.set("body", body);

  const query = params.toString();
  return `mailto:${value}${query ? `?${query}` : ""}`;
};

export const normalizePhoneHref = (phone) => {
  const value = String(phone || "").trim();
  if (!value) return "#";
  return `tel:${value.replace(/[^\d+]/g, "")}`;
};
