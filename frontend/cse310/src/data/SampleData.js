// HOW TO USE:
// This file simulates a database with related data.
// - getItemsList() returns all items.
// - getItemById(id) returns a single item.
// - getUsers() returns all users.
// - getUserById(id) returns a single user, useful for finding an item's author details.
// - getReviews() returns all reviews.

// --- Users Data ---
const users = [
    { 
        id: 1, 
        name: "Trinh Tran Phuong Tuan",
        email: "tuanphuong97@gmail.com",
        profilePicture: "https://randomuser.me/api/portraits/men/1.jpg",
    },
    { id: 2, name: "Nguyen Van An", profilePicture: "https://randomuser.me/api/portraits/men/2.jpg" },
    { id: 3, name: "Le Thi Binh", profilePicture: "https://randomuser.me/api/portraits/women/3.jpg" },
    { id: 4, name: "Pham Minh Cuong", profilePicture: "https://randomuser.me/api/portraits/men/4.jpg" },
    { id: 5, name: "Vo Thi Dung", profilePicture: "https://randomuser.me/api/portraits/women/5.jpg" },
    { id: 6, name: "Le Minh Tri", profilePicture: "https://randomuser.me/api/portraits/men/6.jpg" },
];

// --- Items Data ---
const itemsList = [
    {
        id: 1,
        name: "CSE201 Lab Files",
        authorId: 6, // Le Minh Tri
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
        authorId: 2, // Nguyen Van An
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
        authorId: 3, // Le Thi Binh
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
        authorId: 4, // Pham Minh Cuong
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
        authorId: 5, // Vo Thi Dung
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
        authorId: 6, // Le Minh Tri
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
        authorId: 1, // Trinh Tran Phuong Tuan
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
        authorId: 2, // Nguyen Van An
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

// --- Current Logged-In User's Data ---
const currentUserData = {
    id: 1,
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

// --- Reviews Data ---
const reviews = [
    { id: 1, itemId: 1, userId: 1, rating: 5, comment: "Great lab files, very helpful!", date: "2023-10-03" },
    { id: 2, itemId: 2, userId: 2, rating: 4, comment: "Good notes, but could use more examples.", date: "2023-09-20" },
    { id: 3, itemId: 3, userId: 1, rating: 5, comment: "This exam prep was a lifesaver!", date: "2023-11-15" },
    { id: 4, itemId: 1, userId: 3, rating: 4, comment: "Well-organized and saved me a lot of time.", date: "2023-10-05" },
    { id: 5, itemId: 4, userId: 4, rating: 5, comment: "The essays provided great insight.", date: "2023-10-25" },
    { id: 6, itemId: 5, userId: 5, rating: 3, comment: "The slides are okay, but a bit too basic.", date: "2023-12-10" },
];

// --- Data Getters ---

export const getItemsList = () => {
    return itemsList;
};

export const getItemById = (id) => {
    return itemsList.find(item => item.id === id);
};

export const getUsers = () => {
    return users;
}

export const getUserById = (id) => {
    return users.find(user => user.id === id);
};

export const getCurrentUser = () => {
    const profile = getUserById(currentUserData.id);
    return { ...profile, ...currentUserData }; // Combine profile info with account data
};

export const getReviews = () => {
    return reviews;
};
