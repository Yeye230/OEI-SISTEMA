'use client';

import { FormError } from '@/core/components/form/form-error';
import Field from '@/core/components/form/input-field';
import SubmitButton from '@/core/components/form/submit-button';
import { CardWrapper } from '@/core/components/ui/card-wrapper';
import { Eye, Mail, Lock } from 'lucide-react';
import { Controller } from 'react-hook-form';
import { useLogin } from './use-login';

const AuthPage = (): React.JSX.Element => {
	const { control, handleSubmit, onSubmit, errors, isSubmitting } = useLogin();

	return (
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
				<SubmitButton buttonName='Invocar Acceso' type='submit' isDisabled={isSubmitting} />
			</form>

			<p className='mt-4 text-center text-[10px] uppercase tracking-[0.28em] text-status-error-text font-display'>
				{1 - 5} intento(s) antes del sello inquisitorial
			</p>
		</CardWrapper>
	);
};

export default AuthPage;
