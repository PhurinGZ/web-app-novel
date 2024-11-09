const mongoose = require('mongoose');
const Novel = require('./models/Novel'); // Adjust path as needed

// Example user IDs (you should replace these with real user IDs from your database)
const userIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Example category IDs (you should replace these with real category IDs)
const categoryIds = [
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId(),
  new mongoose.Types.ObjectId()
];

// Example novel data
const novelData = [
  {
    name: "ราชันย์แห่งดาบ",
    chapters: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    rate: new mongoose.Types.ObjectId(),
    category: categoryIds[0],
    user_favorites: [userIds[0], userIds[1]],
    image_novel: "/images/novels/sword-king.jpg",
    detail: "เรื่องราวของนักดาบหนุ่มผู้ได้รับพลังพิเศษจากดาบโบราณ และการผจญภัยเพื่อกอบกู้อาณาจักร",
    reviews: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    type: "novel",
    tags: ["แฟนตาซี", "ต่อสู้", "ผจญภัย"],
    status: "ongoing",
    publishedAt: new Date(),
    createdBy: userIds[0],
    updatedBy: userIds[0],
    averageRating: 4.5
  },
  {
    name: "รักวุ่นวายของสาวออฟฟิศ",
    chapters: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    rate: new mongoose.Types.ObjectId(),
    category: categoryIds[1],
    user_favorites: [userIds[1]],
    image_novel: "/images/novels/office-romance.jpg",
    detail: "เรื่องราวความรักและการทำงานของสาวออฟฟิศที่ต้องเผชิญกับเจ้านายสุดหล่อแต่เย็นชา",
    reviews: [
      new mongoose.Types.ObjectId()
    ],
    type: "novel",
    tags: ["โรแมนติก", "ตลก", "ชีวิตประจำวัน"],
    status: "ongoing",
    publishedAt: new Date(),
    createdBy: userIds[1],
    updatedBy: userIds[1],
    averageRating: 4.2
  },
  {
    name: "ผจญภัยในโลกแฟนตาซี",
    chapters: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    rate: new mongoose.Types.ObjectId(),
    category: categoryIds[2],
    user_favorites: [userIds[0], userIds[2]],
    image_novel: "/images/novels/fantasy-world.jpg",
    detail: "การผจญภัยของเด็กหนุ่มที่ถูกเรียกไปยังโลกแฟนตาซีเพื่อปกป้องโลกจากจอมมารร้าย",
    reviews: [
      new mongoose.Types.ObjectId()
    ],
    type: "novel",
    tags: ["แฟนตาซี", "ต่างโลก", "ผจญภัย"],
    status: "ongoing",
    publishedAt: new Date(),
    createdBy: userIds[2],
    updatedBy: userIds[2],
    averageRating: 4.7
  },
  {
    name: "รักนี้ไม่มีพลาด",
    chapters: [
      new mongoose.Types.ObjectId()
    ],
    rate: new mongoose.Types.ObjectId(),
    category: categoryIds[1],
    user_favorites: [userIds[1], userIds[2]],
    image_novel: "/images/webtoons/love-story.jpg",
    detail: "เว็บตูนรักโรแมนติกของคู่รักวัยเรียนที่ต้องฝ่าฟันอุปสรรคมากมาย",
    reviews: [
      new mongoose.Types.ObjectId()
    ],
    type: "webtoon",
    tags: ["โรแมนติก", "โรงเรียน", "ตลก"],
    status: "ongoing",
    publishedAt: new Date(),
    createdBy: userIds[0],
    updatedBy: userIds[0],
    averageRating: 4.3
  },
  {
    name: "ศึกเวทมนตร์",
    chapters: [
      new mongoose.Types.ObjectId(),
      new mongoose.Types.ObjectId()
    ],
    rate: new mongoose.Types.ObjectId(),
    category: categoryIds[0],
    user_favorites: [userIds[0]],
    image_novel: "/images/webtoons/magic-battle.jpg",
    detail: "การต่อสู้ระหว่างเหล่าจอมเวทย์ผู้พิทักษ์และกองทัพปีศาจ",
    reviews: [
      new mongoose.Types.ObjectId()
    ],
    type: "webtoon",
    tags: ["แฟนตาซี", "ต่อสู้", "เวทมนตร์"],
    status: "completed",
    publishedAt: new Date(),
    createdBy: userIds[1],
    updatedBy: userIds[1],
    averageRating: 4.8
  }
];

// Function to seed the database
async function seedNovels() {
  try {
    // Connect to MongoDB (replace with your connection string)
    await mongoose.connect('mongodb+srv://Phurin:a0990567355@cluster0.lebl5er.mongodb.net/Novel', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    // Clear existing novels
    await Novel.deleteMany({});

    // Insert new novels
    const novels = await Novel.insertMany(novelData);

    console.log('Database seeded successfully');
    console.log(`Inserted ${novels.length} novels`);

    // Print inserted novels for verification
    novels.forEach(novel => {
      console.log(`- ${novel.name} (${novel.type})`);
    });

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    // Close the connection
    await mongoose.connection.close();
  }
}

// Run the seeding function
seedNovels();