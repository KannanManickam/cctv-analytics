import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();
	const { toast } = useToast();

	const handleLogin = (e: React.FormEvent) => {
		e.preventDefault();
		// Check against allowed credentials
		if (email === 'admin@gmail.com' && password === 'Admin@123') {
			localStorage.setItem('accessToken', 'ehjuvjdkhjs5554hvhjhfy_jvjhdd-quxpknndgf47nvfas');
			navigate('/dashboard');
		} else {
			toast({
				title: 'Invalid credentials',
				description: 'Please check your email and password.',
				variant: 'destructive',
			});
		}
	};

	const handleForgotPassword = () => {
		toast({
			title: 'Password reset',
			description: 'Password reset functionality coming soon!',
		});
	};

	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#f7ccd8] via-[#fff] to-[#efeff8] dark:from-[#1a1f2c] dark:to-[#222] transition-colors animate-fade-in">
			<Card className="w-[380px] shadow-2xl glass-morphism border-0 animate-[scale-in_0.7s_ease]">
				<CardHeader>
					<CardTitle className="text-3xl text-center text-[#DD3E62] font-bold tracking-tight">
						CCTV Analytics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleLogin} className="space-y-6">
						<div>
							<label className="block mb-1 text-md font-medium text-foreground">
								Email
							</label>
							<div className="relative">
								<Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DD3E62] h-5 w-5 opacity-80" />
								<Input
									type="email"
									placeholder="Email"
									className="pl-10"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
									autoFocus
									autoComplete="email"
								/>
							</div>
						</div>
						<div>
							<label className="block mb-1 text-md font-medium text-foreground">
								Password
							</label>
							<div className="relative">
								<Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-[#DD3E62] h-5 w-5 opacity-80" />
								<Input
									type="password"
									placeholder="Password"
									className="pl-10"
									value={password}
									onChange={(e) => setPassword(e.target.value)}
									required
									autoComplete="current-password"
								/>
							</div>
							<div className="text-right mt-2">
								<button
									type="button"
									onClick={handleForgotPassword}
									className="text-xs text-[#DD3E62] hover:underline focus-visible:underline transition-colors"
								>
									Forgot password?
								</button>
							</div>
						</div>
						<Button
							type="submit"
							className="w-full bg-[#DD3E62] hover:bg-[#c92453] transition-colors font-bold text-base py-2"
						>
							Login
						</Button>
					</form>
				</CardContent>
			</Card>
		</div>
	);
};

export default Login;