import { AuthSplitLayout } from 'src/layouts/auth-split';

// ----------------------------------------------------------------------

type AuthLayoutProps = {
  children: React.ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return <AuthSplitLayout>{children}</AuthSplitLayout>;
}
