import { AuthCenteredLayout } from 'src/layouts/auth-centered';

// ----------------------------------------------------------------------

type AuthCenteredLayoutProps = {
  children: React.ReactNode;
};

export default function AuthCenteredPageLayout({ children }: AuthCenteredLayoutProps) {
  return <AuthCenteredLayout>{children}</AuthCenteredLayout>;
}
