import { Blocker } from '@remix-run/react';

import Button from './button';

export default function NavigationDialog({ blocker }: { blocker: Blocker }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 bg-black bg-opacity-30 backdrop-blur-sm">
      <dialog
        open
        className="m-0 justify-self-center bg-white rounded-lg shadow-xl transition-duration-500 overflow-hidden"
      >
        <main className="px-4 py-8">
          <p>Are you sure you want to leave?</p>
        </main>
        <footer className="flex justify-end gap-2 bg-yellow-50 px-4 py-2">
          <Button onClick={() => blocker.reset?.()} type="primary">
            Stay
          </Button>
          <Button onClick={() => blocker.proceed?.()} type="secondary">
            Leave
          </Button>
        </footer>
      </dialog>
    </div>
  );
}
