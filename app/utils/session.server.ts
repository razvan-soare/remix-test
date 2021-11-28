import {
  createCookieSessionStorage,
  redirect
} from "remix";
import { User } from "~/types";

type LoginForm = {
  email: string;
  password: string;
};

const mockUser: User = {
  email: 'bob@yahoo.com',
  name: 'Bob',
  id: '1',
}

let sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

let { getSession, commitSession, destroySession } = createCookieSessionStorage({
  cookie: {
    name: "Test_session",
    secure: true,
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // seconds * minutes * hours * days
    httpOnly: true
  },
});

export async function login({
  email,
  password
}: LoginForm): Promise<[User | null, string]> {
  let userJWT = 'asdf'
  return [mockUser, userJWT];
  // TODO test when we have a real api
  // const userResponse = await fetch("https://localhost:8080/api/login", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({ email, password }),
  // })

  // if (!user) return null;
  // return user;
}

export async function logout(request: Request) {
  let session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: { "Set-Cookie": await destroySession(session) },
  });
}

export async function createUserSession(
  user: User,
  userJWT: string,
  redirectTo: string
) {
  let session = await getSession();
  session.set("userId", user.id);
  session.set("userJWT", userJWT);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session)
    }
  });
}

export function getUserSession(request: Request) {
  return getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") return null;
  return userId;
}

export async function requireUserId(request: Request) {
  let session = await getUserSession(request);
  let userId = session.get("userId");
  if (!userId || typeof userId !== "string") throw redirect("/login");
  return userId;
}

export async function getUserJWT(request: Request) {
  let session = await getUserSession(request);
  let userJWT = session.get("userJWT");
  console.log('userJWTaaa', userJWT)
  if (!userJWT || typeof userJWT !== "string") throw new Response("Unauthorized", { status: 401 });

  return userJWT;
}

export async function getUser(request: Request) {
  let userJWT = await getUserJWT(request);
  if (typeof userJWT !== "string") return null;

  try {
    // TODO implement fetch user api
    console.log('userJWT', userJWT)
    return mockUser;
  } catch {
    throw logout(request);
  }
}