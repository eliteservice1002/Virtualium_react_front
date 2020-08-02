import React from "react";
import PropTypes from "prop-types";
import { Route, Redirect } from "react-router-dom";

const PrivateRoute = ({
  component: Component,
  propsComponent,
  isLogin,
  rol,
  isAuthorized,
  ...rest
}) => {
  /* El usuario no tiene autorización sobre este componente */
  // if (!isLogin || (isAuthorized && !rol)) return <Redirect to="/" />;
  return (
    // Show the component only when the user is logged in
    // Otherwise, redirect the user to / page
    <Route
      {...rest}
      render={(props) => <Component {...props} {...propsComponent} />}
    />
  );
};

PrivateRoute.propTypes = {
  /**
   * componente para ser envuelto y renderizado por <Route/>
   */
  component: PropTypes.oneOfType([PropTypes.node, PropTypes.object]).isRequired,
  /**
   * Propiedades adicionales que quiera ser pasadas al componente
   */
  propsComponent: PropTypes.object,
  /**
   * Verifica si el usuario está o no logueado
   */
  isLogin: PropTypes.bool,
  /**
   * Verifica si el componente a renderizar requiere de un rol específico para por ser renderizado
   */
  isAuthorized: PropTypes.bool,
  /**
   * Indica que tipo de usuario está ingresando al sistema y que permisos tiene en el mismo
   */
  rol: PropTypes.string,
};

export default PrivateRoute;
