/**
 * Convierte un objeto plano en FormData.
 * Soporta arrays y File/Blob.
 */
export function jsonToFormData(data: Record<string, unknown>): FormData {
  const formData = new FormData();

  const append = (key: string, value: unknown) => {
    if (value === undefined || value === null) return;
    if (value instanceof File || value instanceof Blob) {
      formData.append(key, value);
    } else if (Array.isArray(value)) {
      value.forEach((item) => append(key, item));
    } else {
      formData.append(key, String(value));
    }
  };

  Object.entries(data).forEach(([key, value]) => append(key, value));

  return formData;
}
