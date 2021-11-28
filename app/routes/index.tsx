import { MetaFunction, LoaderFunction, useCatch } from "remix";
import { useLoaderData } from 'remix';
import { getUser } from "~/utils/session.server";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Test",
    description: "Welcome to remix!"
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  const user = getUser(request);
  return {
    user
  }
}

export default function Index() {
  const { user } = useLoaderData();

  return (
    <div>
      <h1>Remix Test {user ? user.name : 'no user'}</h1>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();

  if (caught.status === 401) {
    return (
      <div className="error-container">
        <p>You must be logged in to create a joke.</p>
      </div>
    );
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
export function ErrorBoundary() {
  return (
    <div className="error-container">
      Something unexpected went wrong. Sorry about that.
    </div>
  );
}