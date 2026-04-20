/**
 * Shared Mission type used across room features
 * Each room feature can extend this with its own specific properties
 */
export interface Mission {
  id: number
  title: string
  subtitle: string
  textColor: string
  bgColor: string
}
