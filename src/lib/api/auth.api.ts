import {
  signUp,
  confirmSignUp,
  signIn,
  signOut,
  resetPassword,
  confirmResetPassword,
  resendSignUpCode,
} from 'aws-amplify/auth';

// ----------------------------------------------------------------------

export async function authSignUp(params: {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}): Promise<void> {
  await signUp({
    username: params.email,
    password: params.password,
    options: {
      userAttributes: {
        email: params.email,
        given_name: params.firstName,
        family_name: params.lastName,
      },
    },
  });
}

export async function authConfirmSignUp(params: {
  email: string;
  code: string;
}): Promise<void> {
  await confirmSignUp({ username: params.email, confirmationCode: params.code });
}

export async function authSignIn(params: { email: string; password: string }): Promise<void> {
  const result = await signIn({ username: params.email, password: params.password });
  if (!result.isSignedIn) {
    // Unhandled next step — surface as error
    throw new Error(`Unexpected sign-in step: ${result.nextStep.signInStep}`);
  }
}

export async function authSignOut(): Promise<void> {
  await signOut();
}

export async function authResetPassword(params: { email: string }): Promise<void> {
  await resetPassword({ username: params.email });
}

export async function authConfirmResetPassword(params: {
  email: string;
  code: string;
  newPassword: string;
}): Promise<void> {
  await confirmResetPassword({
    username: params.email,
    confirmationCode: params.code,
    newPassword: params.newPassword,
  });
}

export async function authResendSignUpCode(params: { email: string }): Promise<void> {
  await resendSignUpCode({ username: params.email });
}

// ----------------------------------------------------------------------

const AUTH_ERROR_MESSAGES: Record<string, string> = {
  UsernameExistsException: 'An account with this email already exists.',
  UserNotFoundException: 'No account found with this email.',
  NotAuthorizedException: 'Incorrect email or password.',
  CodeMismatchException: 'Invalid verification code.',
  ExpiredCodeException: 'Verification code has expired. Please request a new one.',
  LimitExceededException: 'Too many attempts. Please try again later.',
  UserNotConfirmedException: 'Please verify your email before signing in.',
  InvalidPasswordException: 'Password does not meet the requirements.',
};

export function getAuthErrorMessage(error: unknown): string {
  const name = (error as { name?: string })?.name ?? '';
  return AUTH_ERROR_MESSAGES[name] ?? 'Something went wrong. Please try again.';
}
