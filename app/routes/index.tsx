import type { MetaFunction } from "remix";
import { useAuth } from "~/store/authProvider";

// https://remix.run/api/conventions#meta
export let meta: MetaFunction = () => {
  return {
    title: "Remix Test",
    description: "Welcome to remix!"
  };
};

export default function Index() {
  const { user } = useAuth();
  return (
    <div>
      <h1>Remix Test {user ? user.name : 'no user'}</h1>
    </div>
  );
}
