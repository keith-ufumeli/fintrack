import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { CardSpotlight } from "@/components/ui/card-spotlight";
import { Button as StatefulButton } from "@/components/ui/stateful-button";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Mail, Github, DollarSign, ArrowRight, Loader2 } from "lucide-react";
import { z } from "zod";
import { DarkModeToggle } from "@/components/ui/dark-mode-toggle";

const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    },
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (status === "authenticated") {
      router.push("/transactions");
    }
  }, [status, router]);

  const handleEmailLogin = async (data: LoginFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      // For now, we'll just show a message since email auth isn't implemented yet
      setError("Email authentication is not yet implemented. Please use GitHub to sign in.");
      return false;
    } catch (error) {
      console.error("Email login error:", error);
      setError("An error occurred during email login.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGitHubLogin = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await signIn("github", {
        redirect: false,
        callbackUrl: "/transactions",
      });
      
      if (result?.error) {
        setError("Failed to sign in with GitHub. Please try again.");
        return false;
      }
      
      if (result?.ok) {
        router.push("/transactions");
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("GitHub login error:", error);
      setError("An error occurred during GitHub sign-in.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSubmit = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const isValid = await form.trigger();
    if (!isValid) return false;
    
    const formData = form.getValues();
    return await handleEmailLogin(formData);
  };

  // Show loading while checking session
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="flex items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
          <span className="text-foreground">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      {/* Dark Mode Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <DarkModeToggle />
      </div>
      
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        {/* Left side - Login Form */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md mx-auto lg:mx-0"
        >
          <div className="text-center lg:text-left mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex items-center justify-center lg:justify-start gap-3 mb-4"
            >
              <div className="p-2 rounded-full bg-primary/10">
                <DollarSign className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">FinTrack</h1>
            </motion.div>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-foreground/70 text-lg"
            >
              Welcome back! Sign in to manage your finances.
            </motion.p>
          </div>

          <CardSpotlight className="w-full">
            <div className="p-8">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="text-2xl font-bold text-center mb-6 text-foreground"
              >
                Sign In
              </motion.h2>

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                >
                  {error}
                </motion.div>
              )}

              <Form {...form}>
                <form className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                  >
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-foreground/50" />
                              <Input
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    <StatefulButton
                      type="button"
                      className="w-full"
                      onFormSubmit={handleFormSubmit}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          Continue with Email
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      )}
                    </StatefulButton>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.7 }}
                    className="relative"
                  >
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-foreground/50">Or continue with</span>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.8 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={handleGitHubLogin}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Signing in...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Github className="w-5 h-5" />
                          Continue with GitHub
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>
              </Form>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
                className="text-center text-sm text-foreground/60 mt-6"
              >
                By signing in, you agree to our{" "}
                <a href="#" className="text-primary hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-primary hover:underline">
                  Privacy Policy
                </a>
              </motion.p>
            </div>
          </CardSpotlight>
        </motion.div>

        {/* Right side - Illustration (Desktop only) */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="hidden lg:flex items-center justify-center"
        >
          <div className="relative">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="relative z-10"
            >
              <img
                src="/financial-illustration.svg"
                alt="Financial illustration"
                className="w-full max-w-lg h-auto"
              />
            </motion.div>
            
            {/* Floating background elements */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="absolute inset-0 bg-primary/20 rounded-full blur-3xl"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 0.1, scale: 1 }}
              transition={{ duration: 1, delay: 0.8 }}
              className="absolute inset-0 bg-secondary/20 rounded-full blur-3xl -translate-x-8 -translate-y-8"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
