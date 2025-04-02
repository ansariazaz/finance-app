import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Home, DollarSign, PieChart, LogOut, Menu } from "lucide-react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
const Layout = () => {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getActiveStyles = (path: string) => {
    return location.pathname === path
      ? "bg-primary text-primary-foreground"
      : "hover:bg-muted";
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-primary mr-2" />
              <h2 className="text-xl font-bold">Finance App</h2>
            </div>
          </SidebarHeader>

          <SidebarContent className="px-2">
            <nav className="space-y-2">
              <Link to="/">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${getActiveStyles("/")}`}
                >
                  <Home className="mr-2 h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link to="/transactions">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${getActiveStyles(
                    "/transactions"
                  )}`}
                >
                  <DollarSign className="mr-2 h-4 w-4" />
                  Transactions
                </Button>
              </Link>
              <Link to="/budgets">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${getActiveStyles(
                    "/budgets"
                  )}`}
                >
                  <PieChart className="mr-2 h-4 w-4" />
                  Budgets
                </Button>
              </Link>
            </nav>
          </SidebarContent>

          <SidebarFooter className="p-4">
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className="flex-1 flex flex-col h-screen overflow-auto">
          <header className="flex items-center justify-between p-4 border-b bg-card">
            <Menubar className="md:hidden">
              <MenubarMenu>
                <MenubarTrigger> <Menu className="h-4 w-4" /></MenubarTrigger>
                <MenubarContent>
                  <MenubarItem> <Link to="/">Dashboard</Link></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem><Link to="/transactions">Transactions</Link></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem><Link to="/budgets">Budgets</Link></MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem onClick={handleLogout}><LogOut className="mr-2 h-4 w-4" />Logout</MenubarItem>
                </MenubarContent>
              </MenubarMenu>
            </Menubar>
            <div className="ml-auto flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                Welcome back!
              </span>
            </div>
          </header>

          <main className="flex-1">
            <Outlet />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;
