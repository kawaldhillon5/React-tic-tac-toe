import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root, {loader as rootLoader, action as rootAction} from "./routes/root";
import ErrorPage from "./erro-page";
import About from "./routes/about";
import Game from "./routes/game";
import GameLocal from "./routes/game-routes/local";
import GameOnline from "./routes/game-routes/online";
import LogIn, {action as logInAction} from "./routes/auth-routes/logIn";
import SignUp, {action as signUpAction} from "./routes/auth-routes/signUp";

const router = createBrowserRouter([
  {
    path: '/',
    element: < Root />,
    loader: rootLoader,
    action: rootAction,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Game />
      },
      {
        path: '/about',
        element: <About />
      },
      {
        path: '/authenticate/logIn',
        element: <LogIn />,
        action: logInAction,
      },
      {
        path: '/authenticate/signUp',
        element: <SignUp />,
        action: signUpAction,
      },

      {
        path: '/game/local',
        element: <GameLocal />,
      },
      {
        path: 'game/online',
        element: <GameOnline />,
      }
    ]
  }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <RouterProvider router={router} />
)
