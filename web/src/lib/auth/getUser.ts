"use server";

import { cookies } from "next/headers";

export async function getUser() {
  const cookieStore = await cookies();
  const userCookie = cookieStore.get("user")?.value;

  if (!userCookie) {
    return {
      userId: null,
      companyId: null,
      email: null,
      firstName: null,
      lastName: null,
      isAuthenticated: false,
      token: null,
    };
  }

  try {
    const user = JSON.parse(decodeURIComponent(userCookie));

    const { userId, email, firstName, lastName, token } = user;

    return {
      userId,
      email,
      firstName,
      lastName,
      isAuthenticated: true,
      token,
      companyId: "1",
    };
  } catch (error) {
    console.error("Failed to parse user cookie:", error);
    return {
      userId: null,
      email: null,
      firstName: null,
      lastName: null,
      isAuthenticated: false,
      token: null,
      companyId: null,
    };
  }
}
