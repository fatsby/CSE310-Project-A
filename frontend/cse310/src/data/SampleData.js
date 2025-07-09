// HOW TO USE:
// Import this file in your components to access the sample data.
// Example: import { getItemsList, getCurrentUser, getOtherUsers, getReviews } from './data/SampleData';
// Use the useState hook to set the data in your components.
// Example: const [items, setItems] = useState(getItemsList());
//
// useEffect(() => {
//     setItems(getItemsList());
// }, []);
// or simply call the functions to get the data directly.
// Example: const items = getItemsList();


const itemsList = [
    {
        id: 1,
        name: "CSE201 Lab Files",
        author: "Le Minh Tri",
        description: "Comprehensive lab files for CSE201, covering all major topics and experiments. Includes commented code and detailed explanations to help you ace your assignments.",
        images: [
            "https://picsum.photos/1920/1080?random=10",
            "https://picsum.photos/1920/1080?random=11",
            "https://picsum.photos/1920/1080?random=12"
        ],
        price: "200,000",
        university: "Eastern International University",
        subject: "CSE201",
        lastUpdated: "2023-10-01",
    },
    {
        id: 2,
        name: "MTH101 Calculus Notes",
        author: "Nguyen Van An",
        description: "Detailed and easy-to-understand lecture notes for MTH101. Covers everything from limits to integration, with solved examples and practice problems.",
        images: [
            "https://picsum.photos/1920/1080?random=20",
            "https://picsum.photos/1920/1080?random=21",
            "https://picsum.photos/1920/1080?random=22"
        ],
        price: "150,000",
        university: "Vietnam National University",
        subject: "MTH101",
        lastUpdated: "2023-09-15",
    },
    {
        id: 3,
        name: "PHY102 Physics Exam Prep",
        author: "Le Thi Binh",
        description: "A complete exam preparation kit for PHY102. Contains summaries of key formulas, mock exam questions, and fully solved past papers.",
        images: [
            "https://picsum.photos/1920/1080?random=30",
            "https://picsum.photos/1920/1080?random=31",
            "https://picsum.photos/1920/1080?random=32"
        ],
        price: "250,000",
        university: "FPT University",
        subject: "PHY102",
        lastUpdated: "2023-11-05",
    },
    {
        id: 4,
        name: "ENG303 English Literature Essays",
        author: "Pham Minh Cuong",
        description: "A collection of A-grade essays on major works of English literature. Perfect for inspiration and understanding complex themes for your ENG303 course.",
        images: [
            "https://picsum.photos/1920/1080?random=40",
            "https://picsum.photos/1920/1080?random=41",
            "https://picsum.photos/1920/1080?random=42"
        ],
        price: "180,000",
        university: "Eastern International University",
        subject: "ENG303",
        lastUpdated: "2023-10-20",
    },
    {
        id: 5,
        name: "BUS101 Business Management Slides",
        author: "Vo Thi Dung",
        description: "Complete set of presentation slides for BUS101. Visually engaging and packed with key information, case studies, and business theories.",
        images: [
            "https://picsum.photos/1920/1080?random=50",
            "https://picsum.photos/1920/1080?random=51",
            "https://picsum.photos/1920/1080?random=52"
        ],
        price: "120,000",
        university: "RMIT University Vietnam",
        subject: "BUS101",
        lastUpdated: "2023-12-01",
    },
    {
        id: 6,
        name: "CHE101 Chemistry Lab Guide",
        author: "Le Minh Tri",
        description: "A step-by-step guide for all CHE101 lab experiments. Includes safety protocols, expected results, and tips for writing excellent lab reports.",
        images: [
            "https://picsum.photos/1920/1080?random=60",
            "https://picsum.photos/1920/1080?random=61",
            "https://picsum.photos/1920/1080?random=62"
        ],
        price: "220,000",
        university: "Vietnam National University",
        subject: "CHE101",
        lastUpdated: "2024-01-10",
    },
    {
        id: 7,
        name: "CSE305 Database Systems Project",
        author: "Trinh Tran Phuong Tuan",
        description: "A full project implementation for CSE305, featuring a relational database schema, SQL queries, and a front-end interface. Great for reference.",
        images: [
            "https://picsum.photos/1920/1080?random=70",
            "https://picsum.photos/1920/1080?random=71",
            "https://picsum.photos/1920/1080?random=72"
        ],
        price: "350,000",
        university: "Eastern International University",
        subject: "CSE305",
        lastUpdated: "2024-02-15",
    },
    {
        id: 8,
        name: "ECO101 Microeconomics Summary",
        author: "Nguyen Van An",
        description: "Concise summary of all key concepts in ECO101. Perfect for last-minute revision before midterms or finals. Includes graphs and charts.",
        images: [
            "https://picsum.photos/1920/1080?random=80",
            "https://picsum.photos/1920/1080?random=81",
            "https://picsum.photos/1920/1080?random=82"
        ],
        price: "90,000",
        university: "FPT University",
        subject: "ECO101",
        lastUpdated: "2024-03-01",
    }
];

const user = {
    id: 1,
    name: "Trinh Tran Phuong Tuan",
    email: "tuanphuong97@gmail.com",
    purchasedItems: [
        {
            id: 1,
            purchaseDate: "2023-10-02",
            price: "200,000",
            name: "CSE201 Lab Files",
        },
        {
            id: 3,
            purchaseDate: "2023-11-10",
            price: "250,000",
            name: "PHY102 Physics Exam Prep",
        }
    ],
    favoriteItems: [2, 7], //item IDs
    money: "550,000",
    moneyearned: "500,000",
    moneyspent: "450,000",
};

const otherUsers = [
    { id: 2, name: "Nguyen Van An" },
    { id: 3, name: "Le Thi Binh" },
    { id: 4, name: "Pham Minh Cuong" },
    { id: 5, name: "Vo Thi Dung" },
];


const reviews = [
    {
        id: 1,
        itemId: 1,
        userId: 1,
        rating: 5,
        comment: "Great lab files, very helpful for understanding the course material!",
        date: "2023-10-03",
    },
    {
        id: 2,
        itemId: 2,
        userId: 2,
        rating: 4,
        comment: "Good notes, but could use more examples for the harder topics.",
        date: "2023-09-20",
    },
    {
        id: 3,
        itemId: 3,
        userId: 1,
        rating: 5,
        comment: "This exam prep was a lifesaver! The mock questions were very similar to the real exam.",
        date: "2023-11-15",
    },
    {
        id: 4,
        itemId: 1,
        userId: 3,
        rating: 4,
        comment: "Well-organized and saved me a lot of time. Thank you!",
        date: "2023-10-05",
    },
    {
        id: 5,
        itemId: 4,
        userId: 4,
        rating: 5,
        comment: "The essays provided great insight and helped me structure my own arguments.",
        date: "2023-10-25",
    },
    {
        id: 6,
        itemId: 5,
        userId: 5,
        rating: 3,
        comment: "The slides are okay, but a bit too basic. Good for an overview but not for in-depth study.",
        date: "2023-12-10",
    },
    {
        id: 7,
        itemId: 2,
        userId: 3,
        rating: 5,
        comment: "Fantastic notes! Clear, concise, and well-structured. Highly recommend.",
        date: "2023-09-22",
    },
    {
        id: 8,
        itemId: 7,
        userId: 1,
        rating: 5,
        comment: "Incredible project, very well documented and helped me understand database design.",
        date: "2024-02-20",
    },
    {
        id: 9,
        itemId: 8,
        userId: 2,
        rating: 4,
        comment: "Very useful for a quick review before the exam.",
        date: "2024-03-05",
    },
    {
        id: 10,
        itemId: 3,
        userId: 4,
        rating: 5,
        comment: "Passed my physics exam thanks to this. Worth every penny!",
        date: "2023-11-20",
    }
];

export const getCurrentUser = () => {   
    return user;
};

export const getItemsList = () => {
    return itemsList;
};

export const getOtherUsers = () => {
    return otherUsers;
};

export const getReviews = () => {
    return reviews;
};
