import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { HomePage } from "../pages/client/home";
import { NotFoundPage } from "../pages/not-found";
import { Header } from "../components/header";
import { useMe } from "../hooks/useMe";
import { ConfirmEmailPage } from "../user/confirm-email";
import { MyProfilePage } from "../user/my-profile";
import { SearchPage } from "../pages/client/search";
import { CategoryPage } from "../pages/client/category";
import { RestaurantPage } from "../pages/client/restaurant";
import { MyRestaurantsPage } from "../pages/owner/my-restaurants";
import { AddRestaurantPage } from "../pages/owner/add-restaurant";
import { MyRestaurantPage } from "../pages/owner/my-restaurant";
import { AddDishPage } from "../pages/owner/add-dish";
import { OrderPage } from "../user/order";
import { OrdersPage } from "../user/orders";
import { UserRole } from "../__generated__/graphql";
import { DashboardPage } from "../pages/driver/dashboard";

const ClientRoutes = [
  <Route key={1} path="/confirm" element={<ConfirmEmailPage />} />,
  <Route key={2} path="/" element={<HomePage />} />,
  <Route key={3} path="/my-profile" element={<MyProfilePage />} />,
  <Route key={4} path="/search" element={<SearchPage />} />,
  <Route key={5} path="/category/:slug" element={<CategoryPage />} />,
  <Route key={6} path="/restaurant/:id" element={<RestaurantPage />} />,
];

const commonRoutes = [
  {
    path: "/confirm",
    component: <ConfirmEmailPage />,
  },
  {
    path: "/my-profile",
    component: <MyProfilePage />,
  },
  {
    path: "/orders",
    component: <OrdersPage />,
  },
  {
    path: "/orders/:id",
    component: <OrderPage />,
  },
];

const clientRoutes = [
  {
    path: "/",
    component: <HomePage />,
  },
  {
    path: "/search",
    component: <SearchPage />,
  },
  {
    path: "/category/:slug",
    component: <CategoryPage />,
  },
  {
    path: "/restaurants/:id",
    component: <RestaurantPage />,
  },
];

const ownerRoutes = [
  { path: "/", component: <MyRestaurantsPage /> },
  {
    path: "/add-restaurant",
    component: <AddRestaurantPage />,
  },
  { path: "/restaurants/:id", component: <MyRestaurantPage /> },
  { path: "/restaurants/:id/add-dish", component: <AddDishPage /> },
];

const driverRoutes = [{ path: "/", component: <DashboardPage /> }];

export const LoggedInRouter = () => {
  const { data, loading, error } = useMe();

  if (!data || loading || error) {
    return (
      <div className="h-screen flex justify-center items-center font-medium tracking-wider">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Header />
      <Routes>
        {data.me.role === UserRole.Client &&
          clientRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        {data.me.role === UserRole.Owner &&
          ownerRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        {data.me.role === UserRole.Delivery &&
          driverRoutes.map((route) => (
            <Route key={route.path} path={route.path} element={route.component} />
          ))}
        {commonRoutes.map((route) => (
          <Route key={route.path} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Router>
  );
};
