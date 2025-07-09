import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  words: string[];
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  // বাস্তবে এখানে আপনি ডাটাবেস থেকে শব্দগুলো আনবেন
  // আপাতত আমরা কিছু স্যাম্পল শব্দ হার্ডকোড করছি
  const customWords = [
    "Jodit",
    "NextJS",
    "TypeScript",
    "Vercel",
    "ami",
    "tumi",
    "akas",
  ];

  res.status(200).json({ words: customWords });
}
