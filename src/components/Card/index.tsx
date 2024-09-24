import { forwardRef } from 'react';

interface CardProp {
  name: string;
  price: number;
  date: string;
}

const Card = forwardRef<HTMLDivElement, CardProp>(
  ({ name, price, date }, ref) => {
    return (
      <div ref={ref} className="border p-4 rounded shadow">
        <h2 className="text-xl font-semibold">{name}</h2>
        <p className="text-gray-600">Price: ${price.toFixed(2)}</p>
        <p className="text-sm text-gray-500">
          Bought: {new Date(date).toLocaleDateString()}
        </p>
      </div>
    );
  },
);

export default Card;
