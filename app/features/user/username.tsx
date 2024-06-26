import { useAppSelector } from '~/hooks/redux';

export default function Username() {
  const username = useAppSelector((state) => state.user.username);

  if (!username) return null;

  return (
    <div className="hidden text-sm font-semibold md:block">{username}</div>
  );
}
