import { useDispatch } from 'react-redux';
import Button from '../../ui/Button';
import { decreaseItemQuantity, increaseItemQuantity } from './cartSlice';

export default function UpdateItemQuantity({ id, currentQuantity }) {
  const dispatch = useDispatch();

  const handleIncreaseQuantity = () => dispatch(increaseItemQuantity(id));
  const handleDecreaseQuantity = () => dispatch(decreaseItemQuantity(id));
  return (
    <div className="flex items-center gap-1 md:gap-3">
      <Button type="round" onClick={handleDecreaseQuantity}>
        -
      </Button>
      <span className="text-sm font-medium">{currentQuantity}</span>
      <Button type="round" onClick={handleIncreaseQuantity}>
        +
      </Button>
    </div>
  );
}
