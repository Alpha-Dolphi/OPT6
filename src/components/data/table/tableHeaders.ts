export interface TableColumn {
    index: number;
    title: string;
    id: string;
    showTitle: boolean;
  }

  const tableColumns: TableColumn[] = [
    {
      index: 0,
      title: "Номер строки",
      id: "index",
      showTitle: true,
    },
    {
      index: 1,
      title: "Действие",
      id: "action",
      showTitle: true,
    },
    {
      index: 2,
      title: "Наименование единицы",
      id: "unit-name",
      showTitle: true,
    },
    {
      index: 3,
      title: "Цена",
      id: "price",
      showTitle: true,
    },
    {
      index: 4,
      title: "Кол-во",
      id: "amount",
      showTitle: true,
    },
    {
      index: 5,
      title: "Название товара",
      id: "product-name",
      showTitle: true,
    },
    {
      index: 6,
      title: "Итого",
      id: "title",
      showTitle: true,
    },
  ];

  export default tableColumns;