import { Routes, Route } from "react-router";

const Home = () => <h2>Home Page</h2>;
const Login = () => <h2>Login Page</h2>;

function App() {
  return (
    <main className="container p-4">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </main>
  );
}

export default App;
