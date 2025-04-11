import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav className="bg-white shadow p-4 flex justify-between">
      <h1 className="text-xl font-bold text-indigo-600">AI Interview</h1>
      <div className="space-x-4">
        <Link to="/" className="text-gray-700 hover:text-indigo-600">Home</Link>
        <Link to="/interview" className="text-gray-700 hover:text-indigo-600">Interview</Link>
        <Link to="/feedback" className="text-gray-700 hover:text-indigo-600">Feedback</Link>
      </div>
    </nav>
  );
}

export default Navbar;
