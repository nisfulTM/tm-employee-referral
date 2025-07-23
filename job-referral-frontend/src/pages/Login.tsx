import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { login } from "@/services/auth";
import { saveAuthData } from "@/utils/token";
import { LoginSchema, type TLogin } from "@/types/auth.d";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";

export default function Login() {
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<TLogin>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      saveAuthData(data);
      const { user } = data;
      if (user.type === "employee") {
        navigate("/referral-form");
      } else if (user.type === "hr") {
        navigate("/dashboard");
      } else {
        // Fallback or error for unknown user types
        navigate("/");
      }
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: TLogin) => {
    mutate(data);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 h-screen w-screen font-[Quicksand]">
      <div className="w-[470px] p-6 rounded-xl shadow-2xl bg-white">
        <div className="flex justify-center mb-4">
          <img
            src="/images/logo.png"
            alt="Logo"
            className="h-24 w-auto object-contain"
          />
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <h1 className="text-center text-2xl font-bold text-gray-800">
              Login
            </h1>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email *" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Password *"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full bg-primary hover:bg-primary-dark"
              disabled={isPending}
            >
              {isPending ? "Logging in..." : "Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
