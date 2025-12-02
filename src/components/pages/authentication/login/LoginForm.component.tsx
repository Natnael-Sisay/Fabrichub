"use client";

import { signIn } from "next-auth/react";
import { Formik, FormikHelpers } from "formik";
import { toast } from "sonner";
import { toFormikValidationSchema } from "zod-formik-adapter";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldGroup,
  FieldLabel,
  FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { LoginSchema } from "@/schemas";

const LoginForm = () => {
  const router = useRouter();
  const handleSignIn = async (
    values: { email: string; password: string },
    actions: FormikHelpers<{ email: string; password: string }>
  ) => {
    actions.setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        email: values.email,
        password: values.password,
        redirect: false,
      });

      if (!res) {
        toast.error("Sign in failed");
        return;
      }

      if (res.error) {
        toast.error(res.error || "Invalid credentials");
        return;
      }

      router.replace("/");
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(message);
    } finally {
      actions.setSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader className="mb-2">
        <CardTitle>Login to your account</CardTitle>
        <CardDescription>
          Enter your credentials below to login to your account
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={toFormikValidationSchema(LoginSchema)}
          onSubmit={handleSignIn}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            isSubmitting,
          }) => (
            <form onSubmit={handleSubmit}>
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="email">Email</FieldLabel>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="m@example.com"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FieldError
                    errors={
                      touched.email && errors.email
                        ? [{ message: errors.email as string }]
                        : undefined
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <FieldError
                    errors={
                      touched.password && errors.password
                        ? [{ message: errors.password as string }]
                        : undefined
                    }
                  />
                </Field>
                <Field>
                  <Button
                    className="cursor-pointer"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Logging in..." : "Login"}
                  </Button>
                </Field>
              </FieldGroup>
            </form>
          )}
        </Formik>
      </CardContent>
      <CardFooter className="flex flex-col gap-2 pt-6 mt-6 border-t border-border bg-muted/30 rounded-b-xl">
        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
          Test Credentials
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Email:</span>
            <span className="font-mono text-foreground">admin@nati.com</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Password:</span>
            <span className="font-mono text-foreground">password123</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;
