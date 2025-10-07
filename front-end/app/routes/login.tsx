import type { Route } from "./+types/login";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "login page" },
    { name: "description", content: "Codebase Login" },
  ];
}

export default function Login() {
  return <div className="">
    <h1>Login Page</h1>

    <form action="">
      <input type="email" />
      <input type="password" />
    </form>
  </div>;
}
