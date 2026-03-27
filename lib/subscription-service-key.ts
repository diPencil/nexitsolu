/** Stable API key from English label, e.g. "Managed IT" → MANAGED_IT */

export function subscriptionServiceKeyFromName(nameEn: string): string {
    const base = nameEn
        .trim()
        .replace(/[^a-zA-Z0-9]+/g, "_")
        .replace(/^_+|_+$/g, "")
        .toUpperCase()
    return base || `SERVICE_${Date.now()}`
}
