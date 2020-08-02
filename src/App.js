import React, { lazy, Suspense, useState, useEffect } from "react";
import { Switch, Route, useLocation, useParams } from "react-router-dom";

/* Style */
import "./app.css";
import "./materialize/sass/materialize.scss";

/* Routes */
import PublicRoutes from "./routes/publicRoutes";
import PrivateRoutes from "./routes/privateRoutes";

/* Components */
import Loading from "./components/Loading/Loading";
import PublicRoute from "./components/PublicRoute";
import PrivateRoute from "./components/PrivateRoute";
const Footer = lazy(() => {
  return import(/* webpackChunkName: 'Footer' */ "./components/Footer/Footer");
});
const Header = lazy(() => {
  return import(/* webpackChunkName: 'Header' */ "./components/Header/Header");
});
const NotFoundPage = lazy(() => {
  return import(
    /* webpackChunkName: 'NotFoundPage' */ "./components/NotFoundPage/NotFoundPage"
  );
});

/* context */
import connect from "./context/connect";

/* utils */
import httpClient from "./utils/axios";

/* Actions */
import { verifySession } from "./actions/loginAction";

/* CustomHooks */
import { useMobileDetector } from "./components/customHooks/";

function App({ user, isLogin, verifySession }) {
  const params = useParams();
  const location = useLocation();
  const mobileActive = useMobileDetector();
  const [isVerifySession, setIsVerifySession] = useState(true);

  useEffect(() => {
    (async () => {
      await verifySession();
      setIsVerifySession(false);
    })();
  }, []);

  /**
   * [ROL description]
   * Rol del usuario cuando se loguea como administrador (no aplica para clientes)
   * ya que el cliente solo puede realizar acciones basicas de lectura la plataforma
   * @type {[type]}
   */
  var ROL = user ? user.rol : null;

  const _publicRoutes = PublicRoutes.map((route, index) => {
    let {
      path,
      name,
      exact,
      subMenu,
      Component,
      restricted,
      redirectTo,
    } = route;

    return Component ? (
      <PublicRoute
        key={index}
        path={path}
        name={name}
        exact={exact}
        isLogin={isLogin}
        component={Component}
        redirectTo={redirectTo}
        restricted={restricted}
      />
    ) : null;
  });

  const _privateRoutes = PrivateRoutes.map((route, index) => {
    let { path, name, exact, Component, isAuthorized } = route;

    return Component ? (
      <PrivateRoute
        rol={ROL}
        key={index}
        path={path}
        name={name}
        exact={exact}
        isLogin={isLogin}
        component={Component}
        isAuthorized={isAuthorized}
      />
    ) : null;
  });

  const fullscremRequired = () => {
    switch (location.pathname) {
      case "/logs":
      case "/logs/":
      case "/visor":
      case "/visor/":
      case "/stream":
      case "/stream/":
      case "/videos":
      case "/videos/":
      case "/selfies":
      case "/selfies/":
      case "/messages":
      case "/messages/":
      case "/admin-login":
      case "/admin-login/":
        return true;
      default:
        return false;
    }
  };

  const noRenderFooter = () => {
    return location.pathname.includes("dashboard");
  };

  return isVerifySession ? (
    <Loading />
  ) : (
    <Suspense fallback={<Loading />}>
      {fullscremRequired() ? null : <Header mobileActive={mobileActive} />}
      <Switch>
        {_publicRoutes}
        {_privateRoutes}
        <Route path="*" component={NotFoundPage} />
      </Switch>
      {fullscremRequired() || noRenderFooter() ? null : <Footer />}
    </Suspense>
  );
}

const mapStateToProps = (store) => ({
  user: store.login.user,
  isLogin: store.login.isLogin,
});

const mapDispathToProps = (dispath) => ({
  verifySession: () => verifySession(dispath),
});

export default connect(mapStateToProps, mapDispathToProps)(App);
