import { Link, useRouteError } from "react-router-dom";
import './css/error.css';

export default function ErrorPage() {
  const error = useRouteError();
  console.error(error);

  return (
    <div className="error-container" id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p className="error-message">
        <i>{error.statusText || error.message}</i>
      </p>
      <Link className="error-button" to={'/'}>Go Home</Link>
    </div>
  );
}