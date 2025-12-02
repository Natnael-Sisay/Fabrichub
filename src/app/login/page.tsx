import { LoginForm } from "@/components/pages/authentication/login";

const LoginPage = () => {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <div className="w-full max-w-md">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
