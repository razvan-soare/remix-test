import { Button } from "antd";
import { useEffect } from "react";
import type { ActionFunction, LinksFunction, LoaderFunction } from "remix";
import {
  redirect,
  useActionData,
  useSearchParams
} from "remix";
import { useAuth } from "~/store/authProvider";
import { User } from "~/types";
import { createUserSession, getUserId, login } from "~/utils/session.server";
import stylesUrl from "../styles/login.css";

export let links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};


function validateEmail(email: unknown) {
  const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (typeof email !== "string" || !emailRegex.test(String(email).toLowerCase())) {
    return `Email must be valid`;
  }
}

function validatePassword(password: unknown) {
  if (typeof password !== "string" || password.length < 6) {
    return `Passwords must be at least 6 characters long`;
  }
}

type ActionData = {
  formError?: string;
  fieldErrors?: {
    email: string | undefined;
    password: string | undefined;
  };
  fields?: {
    email: string;
    password: string;
  };
  user?: User;
};

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await getUserId(request)
  if (userId) {
    throw redirect("/");
  }
  return {};
}

export const action: ActionFunction = async ({
  request
}): Promise<Response | ActionData> => {
  let form = await request.formData();

  let email = form.get("email");
  let password = form.get("password");
  let redirectTo = form.get("redirectTo");

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    typeof redirectTo !== "string"
  ) {
    return { formError: `Form not submitted correctly.` };
  }

  let fields = { email, password };
  let fieldErrors = {
    email: validateEmail(email),
    password: validatePassword(password)
  };
  if (Object.values(fieldErrors).some(Boolean))
    return { fieldErrors, fields };

  let [user, userJWT] = await login({ email, password });
  if (!user) {
    return {
      fields,
      formError: `Email/Password combination is incorrect`
    };
  }

  return createUserSession(user, userJWT, redirectTo || "/");
};

function LoginForm() {
  const actionData = useActionData<ActionData | undefined>();
  const [searchParams] = useSearchParams();

  return (
    <div className="login-content" data-light="">
      <h1>Login</h1>
      <form
        method="post"
        aria-describedby={
          actionData?.formError
            ? "form-error-message"
            : undefined
        }
      >
        <input
          type="hidden"
          name="redirectTo"
          value={
            searchParams.get("redirectTo") ?? undefined
          }
        />
        <div>
          <label htmlFor="email-input">Email</label>
          <input
            type="text"
            id="email-input"
            placeholder="super@hotmail.com"
            name="email"
            defaultValue={actionData?.fields?.email}
            aria-invalid={Boolean(
              actionData?.fieldErrors?.email
            )}
            aria-describedby={
              actionData?.fieldErrors?.email
                ? "email-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.email ? (
            <p
              className="form-validation-error"
              role="alert"
              id="email-error"
            >
              {actionData?.fieldErrors.email}
            </p>
          ) : null}
        </div>
        <div>
          <label htmlFor="password-input">Password</label>
          <input
            id="password-input"
            name="password"
            placeholder="••••••••"
            defaultValue={actionData?.fields?.password}
            type="password"
            aria-invalid={
              Boolean(
                actionData?.fieldErrors?.password
              ) || undefined
            }
            aria-describedby={
              actionData?.fieldErrors?.password
                ? "password-error"
                : undefined
            }
          />
          {actionData?.fieldErrors?.password ? (
            <p
              className="form-validation-error"
              role="alert"
              id="password-error"
            >
              {actionData?.fieldErrors.password}
            </p>
          ) : null}
        </div>
        <div id="form-error-message">
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData?.formError}
            </p>
          ) : null}
        </div>
        <Button htmlType="submit" type="primary" className="submit-button">
          Submit
        </Button>
      </form>
    </div>
  );
}

export default function Login() {
  return (
    <div className="container login-page">
      <div className="login-left-side">
        <h1>Logo</h1>
      </div>
      <div className="login-right-side">
        <LoginForm />
      </div>
    </div>
  )
}