import { sha256, base64encode, base64decode } from "./crypto";

/**
 * Generate a random id
 */
export async function generateId() {
  const currentTime: string = new Date().getTime().toString();
  const random: Uint8Array = crypto.getRandomValues(new Uint8Array(10));
  return await sha256(random + currentTime);
}

/**
 * Generate a new authorization token
 */
export const generateAuthorization = async (
  access_token: string | null,
  email: string | null,
): Promise<string> => base64encode(JSON.stringify({ access_token, email }));

/**
 * Decode an authorization token
 */
export const decodeAuthorization = async (
  authorization: string,
): Promise<{ accessToken: string; email: string }> => {
  const decoded: string = base64decode(authorization);
  const parsed: any = JSON.parse(decoded);
  return {
    accessToken: parsed.access_token,
    email: parsed.email,
  };
};
