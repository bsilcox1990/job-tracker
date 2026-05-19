import JobTracker from "./components/JobTracker";
import AuthPage from "./components/AuthPage";

function App() {
  const token = localStorage.getItem("token");

  if(!token) {
    return <AuthPage />;
  }

  return <JobTracker />;
}

export default App;