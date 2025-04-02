
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAuth } from '@/contexts/AuthContext';

const loginSchema = z.object({
  email: z.string().email({ message: 'Please enter a valid email address' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters' }),
});

type LoginData = z.infer<typeof loginSchema>;

const Login = () => {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [authError, setAuthError] = useState('');
  
  const form = useForm<LoginData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginData) => {
    setAuthError('');
    const success = await login(data.email, data.password);
    if (success) {
      navigate('/');
    }
  };

  // Fill with demo credentials
  const fillDemoCredentials = () => {
    form.setValue('email', 'demo@example.com');
    form.setValue('password', 'password123');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary p-3 rounded-full">
            <DollarSign className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        
        <h1 className="text-center text-3xl font-bold mb-2">Finance App</h1>
        <p className="text-center text-muted-foreground mb-8">Manage your finances with ease</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Login</CardTitle>
            <CardDescription>Enter your credentials to access your account</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="you@example.com" 
                          type="email" 
                          disabled={isLoading} 
                          {...field} 
                        />
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
                          placeholder="••••••••" 
                          type="current-password" 
                          disabled={isLoading} 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {authError && (
                  <p className="text-sm text-destructive">{authError}</p>
                )}
                
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </Button>
              </form>
            </Form>
            
            <div className="mt-4">
              <Button 
                variant="outline" 
                onClick={fillDemoCredentials} 
                className="w-full" 
                disabled={isLoading}
              >
                Use Demo Account
              </Button>
            </div>
          </CardContent>
          
          <CardFooter>
            <p className="text-center text-sm w-full">
              Don't have an account?{' '}
              <Link to="/register" className="text-primary hover:underline">
                Register
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
