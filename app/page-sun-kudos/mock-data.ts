// Types used across the /sun-kudos page. Sample data is now seeded into
// Supabase (see supabase/migrations); the constants below are kept only as
// a fallback for stories/tests that do not hit the DB.

export interface KudosPerson {
  name: string;
  department: string;
  badge: "Rising Hero" | "Legend Hero" | "Super Hero" | "New Hero";
  avatarUrl: string;
}

export interface KudosEntry {
  id: string;
  sender: KudosPerson;
  receiver: KudosPerson;
  postedAt: string;
  title: string;
  content: string;
  hashtags: string[];
  imageUrls: string[];
  likeCount: number;
  isLiked: boolean;
  isNew?: boolean;
}

export const MOCK_KUDOS: KudosEntry[] = [
  {
    id: "k1",
    sender: {
      name: "Huỳnh Dương Xuân Nhật",
      department: "CECV10",
      badge: "Rising Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=huynh-duong-xuan-nhat",
    },
    receiver: {
      name: "Huỳnh Dương Xuân Nhật",
      department: "CECV10",
      badge: "Legend Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=huynh-duong-nhat-recv",
    },
    postedAt: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    content:
      "Cảm ơn bạn đã luôn hỗ trợ tôi trong suốt dự án vừa qua. Sự tận tâm và tinh thần trách nhiệm của bạn thực sự là nguồn cảm hứng lớn cho cả team. Tôi trân trọng mọi đóng góp của bạn!",
    hashtags: ["#Dedicated", "#Inspiring", "#TeamPlayer", "#Excellence", "#SunStar"],
    imageUrls: [
      "/award-top-talent.png",
      "/award-top-project.png",
      "/award-mvp.png",
      "/award-best-manager.png",
      "/award-signature.png",
    ],
    likeCount: 1000,
    isLiked: false,
    isNew: true,
  },
  {
    id: "k2",
    sender: {
      name: "Nguyễn Bá Chức",
      department: "CECV10",
      badge: "Rising Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-ba-chuc",
    },
    receiver: {
      name: "Nguyễn Văn Quý",
      department: "CECV10",
      badge: "Legend Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-van-quy",
    },
    postedAt: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    content:
      "Bạn luôn mang lại năng lượng tích cực cho team. Những ý tưởng sáng tạo và cách tiếp cận vấn đề của bạn luôn làm tôi ngạc nhiên. Cảm ơn vì đã là một người đồng đội tuyệt vời!",
    hashtags: ["#Dedicated", "#Inspiring", "#Dedicated", "#Innovation", "#BestTeam"],
    imageUrls: [
      "/award-top-talent.png",
      "/award-top-project.png",
      "/award-mvp.png",
      "/award-best-manager.png",
      "/award-top-project-leader.png",
    ],
    likeCount: 1000,
    isLiked: false,
  },
  {
    id: "k3",
    sender: {
      name: "Nguyễn Hoàng Linh",
      department: "CECV10",
      badge: "Super Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-hoang-linh",
    },
    receiver: {
      name: "Nguyễn Bá Chức",
      department: "CECV10",
      badge: "Legend Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-ba-chuc-recv",
    },
    postedAt: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    content:
      "Sự chuyên nghiệp và kỹ năng lãnh đạo của bạn thật sự ấn tượng. Cảm ơn vì luôn dẫn dắt team vượt qua mọi thử thách một cách xuất sắc!",
    hashtags: ["#Leadership", "#Dedicated", "#Excellence", "#Inspiring", "#SunStar"],
    imageUrls: [
      "/award-top-talent.png",
      "/award-mvp.png",
      "/award-top-project.png",
      "/award-signature.png",
      "/award-best-manager.png",
    ],
    likeCount: 1000,
    isLiked: false,
  },
  {
    id: "k4",
    sender: {
      name: "Nguyễn Văn Quý",
      department: "CECV10",
      badge: "Super Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-van-quy-sender",
    },
    receiver: {
      name: "Nguyễn Hoàng Linh",
      department: "CECV10",
      badge: "Legend Hero",
      avatarUrl: "https://i.pravatar.cc/64?u=nguyen-hoang-linh-recv",
    },
    postedAt: "10:00 - 10/30/2025",
    title: "IDOL GIỚI TRẺ",
    content:
      "Cảm ơn bạn đã luôn đồng hành và hỗ trợ trong những thời điểm khó khăn nhất. Tinh thần không ngại thử thách của bạn là nguồn động lực tuyệt vời cho toàn bộ team.",
    hashtags: ["#TeamWork", "#Dedicated", "#Champion", "#BestPartner", "#SunStar"],
    imageUrls: [
      "/award-top-talent.png",
      "/award-top-project.png",
      "/award-mvp.png",
      "/award-best-manager.png",
      "/award-signature.png",
    ],
    likeCount: 1000,
    isLiked: false,
  },
];

export const HIGHLIGHT_KUDOS = MOCK_KUDOS.slice(0, 3);

export const SPOTLIGHT_NAMES = [
  "Huỳnh Dương Xuân Nhật",
  "Nguyễn Bá Chức",
  "Nguyễn Văn Quý",
  "Nguyễn Hoàng Linh",
  "Trần Minh Khoa",
  "Lê Thị Hương",
  "Phạm Văn An",
  "Vũ Thị Mai",
  "Đỗ Quang Huy",
  "Bùi Thị Lan",
  "Hoàng Văn Nam",
  "Ngô Thị Thu",
  "Đinh Văn Tài",
  "Phan Thị Nga",
  "Lý Minh Tuấn",
  "Cao Thị Liên",
  "Dương Văn Đức",
  "Trịnh Thị Hà",
];

export const ACTIVITY_LOG = [
  {
    time: "08:30PM",
    text: "Nguyễn Bá Chức đã nhận được Kudos mới",
  },
  {
    time: "08:25PM",
    text: "Huỳnh Dương Xuân Nhật đã nhận được Kudos mới",
  },
  {
    time: "08:20PM",
    text: "Nguyễn Văn Quý đã nhận được Kudos mới",
  },
  {
    time: "08:15PM",
    text: "Nguyễn Hoàng Linh đã nhận được Kudos mới",
  },
];

export const GIFT_RECIPIENTS = [
  {
    name: "Huỳnh Dương Xuân",
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: "https://i.pravatar.cc/64?u=gift-1",
  },
  {
    name: "Nguyễn Bá Chức",
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: "https://i.pravatar.cc/64?u=gift-2",
  },
  {
    name: "Nguyễn Văn Quý",
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: "https://i.pravatar.cc/64?u=gift-3",
  },
  {
    name: "Nguyễn Hoàng Linh",
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: "https://i.pravatar.cc/64?u=gift-4",
  },
  {
    name: "Trần Minh Khoa",
    gift: "Nhận được 1 áo phông SAA",
    avatarUrl: "https://i.pravatar.cc/64?u=gift-5",
  },
];
