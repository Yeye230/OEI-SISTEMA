import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from '@heroui/react';

import { LOGIN_API_URL } from '@/core/server/urls';
import { AuthResponse, BackendResponse } from '@/core/server/types';
import { REGISTER_FALLBACK_ERROR } from '@/core/server/messages';
import { submitFeedbackError } from '@/core/utils/function';
import { LoginFormValues, loginSchema } from '@/core/lib/schemas/login-schema';
import { useBootstrap } from '@/core/hooks/use-bootstrap';

type UsePasswordLoginResult = {
	control: ReturnType<typeof useForm<LoginFormValues>>['control'];
	handleSubmit: ReturnType<typeof useForm<LoginFormValues>>['handleSubmit'];
	onSubmit: (values: LoginFormValues) => Promise<void>;
	isSubmitting: boolean;
	errors: ReturnType<typeof useForm<LoginFormValues>>['formState']['errors'];
};

const useLogin = (): UsePasswordLoginResult => {
	const router = useRouter();
	const { fetchBootstrap } = useBootstrap();

	const {
		control,
		handleSubmit,
		reset,
		clearErrors,
		setError,
		formState: { isSubmitting, errors },
	} = useForm<LoginFormValues>({
		resolver: zodResolver(loginSchema),
		mode: 'onChange',
		defaultValues: {
			email: '',
			password: '',
		},
	});

	const onSubmit = async (values: LoginFormValues): Promise<void> => {
		clearErrors('root');

		try {
			const response = await fetch(LOGIN_API_URL, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(values),
			});

			const payload = (await response
				.json()
				.catch(() => null)) as BackendResponse<AuthResponse> | null;

			if (!response.ok) {
				submitFeedbackError(setError, payload?.message, payload?.errors, {
					showToast: true,
				});
				return;
			}

			reset();

			await fetchBootstrap();

			toast.success(payload?.message ?? 'Inicio de sesión realizado con éxito.');

			router.replace('/altar');
		} catch (error) {
			throw error instanceof Error ? error : new Error(REGISTER_FALLBACK_ERROR);
		}
	};

	return { control, handleSubmit, onSubmit, isSubmitting, errors };
};

export { useLogin };
