import * as React from "react";
import * as ReactDOM from "react-dom/client";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import './index.css'
import Root from "./routes/root";
import Home from "./routes/home";
import ErrorPage from "./erro-page";
import About from "./routes/about";
import Game from "./routes/game";
import GameLocal from "./routes/game-routes/local";
import GameOnline from "./routes/game-routes/online";

const router = createBrowserRouter([
  {
    path: '/',
    element: < Root />,
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
      // {
      //   path : '/game',
      //   element: <Game />,
      // },
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
