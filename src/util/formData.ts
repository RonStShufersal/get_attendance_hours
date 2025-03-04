export function jsonToFormData(jsonObject: Record<string, string>): string {
  return Object.entries(jsonObject)
    .map(entry => entry.join('='))
    .join('&');
}

export function formDataToJSON(formData: string): Record<string, string> {
  return Object.fromEntries(
    formData.split('&').map(pair => {
      // handle undefined values
      const [key, value = ''] = pair.split('=');
      return [key, value];
    }),
  );
}