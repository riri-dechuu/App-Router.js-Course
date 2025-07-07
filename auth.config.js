    export const authConfig = {
      pages: {
        signIn: '/login', 
      },
    
      callbacks: {
    authorized({ auth, request }) {
      const isLoggedIn = !!auth?.user;
      const isOnDashboard = request.nextUrl.pathname.startsWith('/dashboard');

      if (isOnDashboard) {
        return isLoggedIn; 
      }

      return true; 
    },
  },
  providers: [],
};
    