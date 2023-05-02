export interface TableColumn {
    index: number;
    title: string;
    id: string;
    showTitle: boolean;
    inputType: "boolean" | "number" | "string" | null;
  }

  const tableColumns: TableColumn[] = [
    {
      index: 0,
      title: "Номер строки",
      id: "index",
      showTitle: true,
      inputType: null,
    },
    {
      index: 1,
      title: "Действие",
      id: "action",
      showTitle: true,
      inputType: null,
    },
    {
      index: 2,
      title: "Наименование единицы",
      id: "unit-name",
      showTitle: true,
      inputType: "string",
    },
    {
      index: 3,
      title: "Цена",
      id: "price",
      showTitle: true,
      inputType: "number",
    },
    {
      index: 4,
      title: "Кол-во",
      id: "amount",
      showTitle: true,
      inputType: "number",
    },
    {
      index: 5,
      title: "Название товара",
      id: "product-name",
      showTitle: true,
      inputType: "string",
    },
    {
      index: 6,
      title: "Итого",
      id: "title",
      showTitle: true,
      inputType: "number",
    },
  ];

  export default tableColumns;