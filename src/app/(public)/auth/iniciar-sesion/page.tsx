'use client';

import { FormError } from '@/core/components/form/form-error';
import Field from '@/core/components/form/input-field';
import SubmitButton from '@/core/components/form/submit-button';
import { CardWrapper } from '@/core/components/ui/card-wrapper';
import { Eye, Mail, Lock } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useLogin } from './use-login';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const AuthPage = (): React.JSX.Element => {
	const { control, handleSubmit, onSubmit, errors } = useLogin();
	const router = useRouter();
	const [demoLoading, setDemoLoading] = useState(false);
	const [demoError, setDemoError] = useState('');
	const enterDemo = async (): Promise<void> => {
		setDemoLoading(true);
		setDemoError('');
		try {
			const response = await fetch('/api/demo/session', { method: 'POST' });
			if (!response.ok) throw new Error('El modo demostración solo está disponible en desarrollo.');
			router.push('/dashboard');
			router.refresh();
		} catch (error) {
			setDemoError(error instanceof Error ? error.message : 'No se pudo iniciar la demostración.');
		} finally { setDemoLoading(false); }
	};

	return (
		<div className='min-h-screen flex items-center justify-center p-4 bg-[linear-gradient(135deg,#F8FAFC_0%,#E6EFF5_100%)]'>
			<div className='w-full max-w-md'>
				<div className='flex items-center justify-center gap-3 mb-6'>
					<div
						className='w-14 h-14 flex items-center justify-center text-white font-bold text-lg tracking-wider rounded-[18px]'
						style={{
							background: 'linear-gradient(135deg, #457B9D, #2A9D8F)',
							boxShadow: '0 12px 28px -6px rgba(42,157,143,0.55)',
						}}
					>
						OEI
					</div>
					<div>
						<p className='text-lg font-bold'>Sistema de Actas</p>
						<p className='text-[11px] uppercase tracking-widest' style={{ color: '#457B9D' }}>
							OEI · El Salvador
						</p>
					</div>
				</div>
				<CardWrapper>
					<form noValidate className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
						<FormError server={errors.root?.server} />
						<Controller
							name='email'
							control={control}
							render={({ field, fieldState }) => (
								<Field
									label='Correo electrónico'
									field={field}
									isInvalid={fieldState.invalid}
									errorMessage={fieldState.error?.message}
									placeholder='jane@example.com'
									type='email'
									startContent={<Mail className='w-4 h-4' aria-hidden='true' />}
									isRequired={true}
								/>
							)}
						/>
						<Controller
							name='password'
							control={control}
							render={({ field, fieldState }) => (
								<Field
									label='Contraseña'
									field={field}
									isInvalid={fieldState.invalid}
									errorMessage={fieldState.error?.message}
									placeholder='••••••••'
									type='password'
									startContent={<Lock className='w-4 h-4' aria-hidden='true' />}
									endContent={<Eye className='w-4 h-4' aria-hidden='true' />}
									isRequired={true}
								/>
							)}
						/>
						<SubmitButton buttonName='Acceso institucional (requiere backend)' type='submit' isDisabled={true} />
					</form>
					<div className='mt-4 border-t border-border pt-4'>
						<button type='button' onClick={enterDemo} disabled={demoLoading} className='w-full min-h-11 rounded-xl border border-border bg-surface text-sm font-semibold text-foreground hover:bg-surface-muted disabled:opacity-60'>
							{demoLoading ? 'Preparando demostración...' : 'Entrar en modo demostración'}
						</button>
						{demoError && <p role='alert' className='mt-2 text-sm text-status-error-text'>{demoError}</p>}
					</div>

					<p className='mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-status-error-text font-display'>
						Modo demostración: datos locales, sin conexión a base de datos
					</p>
				</CardWrapper>
			</div>
		</div>
	);
};

export default AuthPage;
