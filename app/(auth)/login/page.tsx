import LoginForm from "./LoginForm";

type LoginPageProps = {
  searchParams: {
    from?: string;
  };
};

export default function LoginPage({ searchParams }: LoginPageProps) {
  const from =
    typeof searchParams.from === "string" && searchParams.from.length > 0
      ? searchParams.from
      : "/";

  return <LoginForm from={from} />;
}
