import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/contexts/auth-context";
import { NoosferaProvider } from "@/contexts/noosfera-context";
import { CookiesConsent } from "@/components/cookies-consent";
import NotFound from "@/pages/not-found";
import HomePage from "@/pages/home";
import PricingPage from "@/pages/pricing/index";
import CompanyPage from "@/pages/company";
import DocsPage from "@/pages/docs/index";
import DocumentacionPage from "@/pages/docs/documentacion";
import DashboardPage from "@/pages/dashboard/index";
import DashboardHelpPage from "@/pages/dashboard/help";
import AuthPage from "@/pages/auth/index";
import LoginPage from "@/pages/auth/login";
import RegisterPage from "@/pages/auth/register";
import AdminPage from "@/pages/admin/index";
import AdminLoginPage from "@/pages/admin/login";
import PrivacyPage from "@/pages/legal/privacy";
import TermsPage from "@/pages/legal/terms";
import CookiesPage from "@/pages/legal/cookies";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/company" component={CompanyPage} />
      <Route path="/docs" component={DocsPage} />
      <Route path="/documentacion" component={DocumentacionPage} />
      <Route path="/dashboard" component={DashboardPage} />
      <Route path="/dashboard/help" component={DashboardHelpPage} />
      <Route path="/auth" component={AuthPage} />
      <Route path="/auth/login" component={LoginPage} />
      <Route path="/auth/register" component={RegisterPage} />
      <Route path="/admin" component={AdminPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/privacy" component={PrivacyPage} />
      <Route path="/terms" component={TermsPage} />
      <Route path="/cookies" component={CookiesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false} disableTransitionOnChange>
        <AuthProvider>
          <NoosferaProvider>
            <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
              <Router />
            </WouterRouter>
            <CookiesConsent />
            <Toaster position="bottom-right" />
          </NoosferaProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
