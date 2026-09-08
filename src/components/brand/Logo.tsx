import { Link } from "react-router";

export function Logo(): React.JSX.Element {
  return (
    <Link to="/" className="brand" aria-label="Crossa home">
      <img src="/brand/logo.png" alt="" width="28" height="28" />
      <span>crossa</span>
    </Link>
  );
}
