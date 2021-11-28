import { Link } from "remix";

export default function Header() {
  return (
    <header className="remix-app__header">
      <div className="container">
        <Link to="/" title="home">
          HOME
        </Link>
        <nav aria-label="Main navigation">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/login">Login</Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}