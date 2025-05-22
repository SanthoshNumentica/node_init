import { addMinutes } from 'date-fns';

export const getExpiry = (expiryTime: number) => {
  const createdAt = new Date();
  const expiresAt = addMinutes(createdAt, expiryTime);
  return expiresAt;
};

export function isTokenExpired(expiry: Date): boolean {
  const expirationDate = new Date(expiry);
  const currentDate = new Date();
  return expirationDate.getTime() <= currentDate.getTime();
}
