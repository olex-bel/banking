import { forwardRef } from "react";
import { NavLink } from "@remix-run/react";
import type { NavLinkProps } from "@remix-run/react";

type AppLinkProps = {
    activeClassName?: string ;
} & NavLinkProps;

const AppLink = forwardRef<HTMLAnchorElement, AppLinkProps>((props, ref) => (
    <NavLink
      ref={ref}
      to={props.to}
      className={({ isActive }) =>
        `${props.className} ${isActive ? props.activeClassName : ''}`
      }
    >
      {props.children}
    </NavLink>
));
AppLink.displayName = "AppLink";
  
export default AppLink