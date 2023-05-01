interface Category {
    title: string;
    subcategories: string[] | null;
    showSubcategory: boolean;
    id: string | number;
  }


const sideMenuCategories : Category[] = [
    {
        title: "Логистика",
        subcategories: null,
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Перевозчики",
        subcategories: [],
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Задачи",
        subcategories: null,
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Аналитика",
        subcategories: [
            "Cправочник",
            "База",
            "Ваза"
        ],
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Адреса",
        subcategories: null,
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Товары",
        subcategories: null,
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Информация для склада",
        subcategories: [],
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
    {
        title: "Адреса",
        subcategories: [],
        showSubcategory: false,
        id: Math.floor(Math.random() * 100000) + 1,
    },
]

export default sideMenuCategories;