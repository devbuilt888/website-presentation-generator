/** Healthy target: at most 3 parts Omega 6 per 1 part Omega 3 (ratio ≤ 3:1). */
export const MAX_OMEGA6_PER_OMEGA3 = 3;

export function isOmega63RatioHealthy(omega3: number, omega6: number): boolean {
  if (
    !Number.isFinite(omega3) ||
    !Number.isFinite(omega6) ||
    omega3 <= 0 ||
    omega6 < 0
  ) {
    return false;
  }
  return omega6 / omega3 <= MAX_OMEGA6_PER_OMEGA3;
}
