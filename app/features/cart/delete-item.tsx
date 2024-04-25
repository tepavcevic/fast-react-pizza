import { useDispatch } from 'react-redux';
import Button from 'app/components/button';
import { deleteItem } from './cartSlice';

export default function DeleteItem({ id }: { id: number }) {
  const dispatch = useDispatch();

  const handleDeleteItem = () => dispatch(deleteItem(id));
  return (
    <Button type="small" onClick={handleDeleteItem}>
      Delete
    </Button>
  );
}
