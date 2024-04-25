import { SyntheticEvent, useState } from 'react';
import { useNavigate } from '@remix-run/react';

export default function SearchOrder() {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();
    if (!query) return;

    navigate(`/order/${query}`);
    setQuery('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        placeholder="Search order #"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        className="w-28 rounded-full bg-yellow-100 px-4 py-2 text-sm transition-all duration-300 placeholder:text-stone-400 sm:w-64 sm:focus:w-72 sm:focus:outline-none sm:focus:ring sm:focus:ring-yellow-500  sm:focus:ring-opacity-50"
      />
    </form>
  );
}
