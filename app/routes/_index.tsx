import { useAppSelector } from '~/hooks/redux';
import { type MetaFunction, useNavigation } from '@remix-run/react';

import CreateUser from '~/features/user/create-user';
import Button from '~/components/button';
import Loader from '~/components/loader';

export const meta: MetaFunction = () => {
  return [{ title: 'Home | Fast React Pizza Co.' }];
};

function Home() {
  const username = useAppSelector((state) => state.user.username);
  const navigation = useNavigation();

  if (navigation.state === 'loading') return <Loader />;

  return (
    <div className="my-10 px-4 text-center sm:my-16">
      <h1 className="mb-8 text-xl font-semibold md:text-3xl">
        The best pizza.
        <br />
        <span className="text-yellow-500">
          Straight out of the oven, straight to you.
        </span>
      </h1>

      {!username ? (
        <CreateUser />
      ) : (
        <Button type="primary" to="/menu">
          Continue ordering, {username}
        </Button>
      )}
    </div>
  );
}

export default Home;
