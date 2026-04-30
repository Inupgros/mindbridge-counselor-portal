import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthScreen from "@/pages/AuthScreen";
import ReviewScreen from "@/pages/ReviewScreen";
import ApprovalPendingScreen from "@/pages/ApprovalPendingScreen";
import ApprovedScreen from "@/pages/ApprovedScreen";
import DashboardScreen from "@/pages/DashboardScreen";
import SchoolVisitScreen from "@/pages/SchoolVisitScreen";
import RequestsScreen from "@/pages/RequestsScreen";
import StudentProfileScreen from "@/pages/StudentProfileScreen";
import CareerAnalysisScreen from "@/pages/CareerAnalysisScreen";
import AppointmentDetailScreen from "@/pages/AppointmentDetailScreen";
import AppointmentsScreen from "@/pages/AppointmentsScreen";
import RevenueScreen from "@/pages/RevenueScreen";
import StudentAnalyticsScreen from "@/pages/StudentAnalyticsScreen";
import DemographicsScreen from "@/pages/DemographicsScreen";
import NotificationsScreen from "@/pages/NotificationsScreen";
import SettingsScreen from "@/pages/SettingsScreen";

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={AuthScreen} />
      <Route path="/review">
        {() => <ReviewScreen mobile="9876543210" />}
      </Route>
      <Route path="/pending">
        {() => <ApprovalPendingScreen mobile="9876543210" />}
      </Route>
      <Route path="/approved">
        {() => <ApprovedScreen mobile="9876543210" />}
      </Route>
      <Route path="/dashboard">
        {() => <DashboardScreen mobile="9876543210" />}
      </Route>
      <Route path="/visits">
        {() => <SchoolVisitScreen mobile="9876543210" />}
      </Route>
      <Route path="/requests">
        {() => <RequestsScreen mobile="9876543210" />}
      </Route>
      <Route path="/student">
        {() => <StudentProfileScreen mobile="9876543210" />}
      </Route>
      <Route path="/career-analysis">
        {() => <CareerAnalysisScreen mobile="9876543210" />}
      </Route>
      <Route path="/appointment">
        {() => <AppointmentsScreen mobile="9876543210" />}
      </Route>
      <Route path="/appointment/detail">
        {() => <AppointmentDetailScreen mobile="9876543210" />}
      </Route>
      <Route path="/revenue">
        {() => <RevenueScreen mobile="9876543210" />}
      </Route>
      <Route path="/analytics">
        {() => <StudentAnalyticsScreen mobile="9876543210" />}
      </Route>
      <Route path="/demographics">
        {() => <DemographicsScreen mobile="9876543210" />}
      </Route>
      <Route path="/notifications">
        {() => <NotificationsScreen mobile="9876543210" />}
      </Route>
      <Route path="/settings">
        {() => <SettingsScreen mobile="9876543210" />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
