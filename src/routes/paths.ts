export const paths = {
  /**
   * Auth
   */
  auth: {
    signIn: '/sign-in',
    signUp: '/sign-up',
    resetPassword: '/reset-password',
    updatePassword: '/update-password',
    verify: '/verify',
  },
  /**
   * App
   */
  dashboard: '/dashboard',
  workspace: (id: string) => `/dashboard/workspaces/${id}`,
  /**
   * Common
   */
  maintenance: '/maintenance',
  page404: '/error/404',
  page500: '/error/500',
  support: '/support',
  docs: '/',
  components: '/',
};
