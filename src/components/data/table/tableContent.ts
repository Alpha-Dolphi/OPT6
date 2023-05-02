export enum ProductName {
  'Мраморный щебень фр. 2-5 мм, 25кг' = 'Мраморный щебень фр. 2-5 мм, 25кг',
  'Мраморный щебень фр. 2-5 мм, 25кг (белый)' = 'Мраморный щебень фр. 2-5 мм, 25кг (белый)',
  'Мраморный щебень фр. 2-5 мм, 25кг (вайт)' = 'Мраморный щебень фр. 2-5 мм, 25кг (вайт)',
  'Мраморный щебень фр. 2-5 мм, 25кг, возврат' = 'Мраморный щебень фр. 2-5 мм, 25кг, возврат',
  'Мраморный щебень фр. 2-5 мм, 1т' = 'Мраморный щебень фр. 2-5 мм, 1т',
}

export enum Actions {
  'Удалить' = 'Удалить',
}

export interface Product {
  index: number,
  action: Actions;
  unit_name: string;
  price: number;
  amount: number;
  product_name: string;
  total: number;
  id: string | number;
}

const products: Product[] = [
  {
    index: 1,
    action: Actions['Удалить'],
    unit_name: ProductName['Мраморный щебень фр. 2-5 мм, 25кг'],
    price: 234,
    amount: 34,
    product_name: 'Первый',
    total: 234*34,
    id: Math.floor(Math.random() * 100000) + 1,
  },
  {
    index: 2,
    action: Actions['Удалить'],
    unit_name: ProductName['Мраморный щебень фр. 2-5 мм, 25кг (вайт)'],
    price: 234,
    amount: 34,
    product_name: 'Второй',
    total: 234*34,
    id: Math.floor(Math.random() * 100000) + 1,
  },
  {
    index: 3,
    action: Actions['Удалить'],
    unit_name: ProductName['Мраморный щебень фр. 2-5 мм, 25кг'],
    price: 234,
    amount: 34,
    product_name: 'Третий',
    total: 234*34,
    id: Math.floor(Math.random() * 100000) + 1,
  },
  {
    index: 4,
    action: Actions['Удалить'],
    unit_name: ProductName['Мраморный щебень фр. 2-5 мм, 25кг'],
    price: 199,
    amount: 21,
    product_name: 'Четвёртый',
    total: 199*21,
    id: Math.floor(Math.random() * 100000) + 1,
  },
  {
    index: 5,
    action: Actions['Удалить'],
    unit_name: ProductName['Мраморный щебень фр. 2-5 мм, 25кг'],
    price: 234,
    amount: 34,
    product_name: 'Пятый',
    total: 234*34,
    id: Math.floor(Math.random() * 100000) + 1,
  },
];

export default products;
