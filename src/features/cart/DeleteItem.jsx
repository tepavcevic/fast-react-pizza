import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { deleteItem } from './cartSlice';

export default function DeleteItem({ id }) {
  const dispatch = useDispatch();

  const handleDeleteItem = () => dispatch(deleteItem(id));
  return (
    <Button type="small" onClick={handleDeleteItem}>
      Delete
    </Button>
  );
}
