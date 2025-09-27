import DashboardLayout from '@/components/layout/DashboardLayout';
import { BookOpen } from 'lucide-react';
import { motion } from 'framer-motion';

const youtubeVideos = [
  {
    id: "yt-jee-1",
    title: "JEE: Calculus Tutorial",
    topic: "Calculus",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=TG67Lxffzts&list=PLVLoWQFkZbhWhXFdLmL68li7gVt7s0KVs"
  },
  {
    id: "yt-jee-2",
    title: "JEE: Algebra Tutorial",
    topic: "Algebra",
    stream: "JEE",
    language: "English",
    youtube_url: "https://www.youtube.com/watch?v=j6NBRQ_FrNE"
  },
  {
    id: "yt-jee-3",
    title: "JEE: Mechanics Tutorial",
    topic: "Mechanics",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=B3yFILY36i8"
  },
  {
    id: "yt-jee-4",
    title: "JEE: Electrostatics Tutorial",
    topic: "Electrostatics",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=oes_203yHBU"
  },
  {
    id: "yt-jee-5",
    title: "JEE: Coordinate Geometry Tutorial",
    topic: "Coordinate Geometry",
    stream: "JEE",
    language: "English",
    youtube_url: "https://www.youtube.com/watch?v=w_89Eiz2LcE"
  },
  {
    id: "yt-jee-6",
    title: "JEE: Probability Tutorial",
    topic: "Probability",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=SaaSf99UWxo"
  },
  {
    id: "yt-jee-7",
    title: "JEE: Trigonometry Tutorial",
    topic: "Trigonometry",
    stream: "JEE",
    language: "English",
    youtube_url: "https://www.youtube.com/watch?v=pzzoBw3cm1Q"
  },
  {
    id: "yt-jee-8",
    title: "JEE: Thermodynamics Tutorial",
    topic: "Thermodynamics",
    stream: "JEE",
    language: "English",
    youtube_url: "https://www.youtube.com/watch?v=tMHrpmJH5I8"
  },
  {
    id: "yt-jee-9",
    title: "JEE: Complex Numbers Tutorial",
    topic: "Complex Numbers",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=sKwCHRS8zqA"
  },
  {
    id: "yt-jee-10",
    title: "JEE: Vectors Tutorial",
    topic: "Vectors",
    stream: "JEE",
    language: "Hindi",
    youtube_url: "https://www.youtube.com/watch?v=dcVOOKmOEmw"
  },
];

// Helper: extract embed URL from youtube_url
const getEmbedUrl = (url: string) => {
  const urlObj = new URL(url);
  const videoId = urlObj.searchParams.get("v");
  return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
};

export default function Lessons() {
  return (
    <DashboardLayout>
      <div className="h-full overflow-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl text-center mb-8"
        >
          <BookOpen className="w-16 h-16 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-foreground mb-4">Lessons</h1>
          <p className="text-muted-foreground">
            Explore video tutorials for JEE preparation. Watch and learn at your own pace.
          </p>
        </motion.div>

        {/* Videos Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {youtubeVideos.map((video) => (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl overflow-hidden shadow-lg"
            >
              <div className="aspect-video">
                <iframe
                  width="100%"
                  height="100%"
                  src={getEmbedUrl(video.youtube_url)}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="rounded-t-2xl"
                ></iframe>
              </div>
              <div className="p-4 text-left">
                <h2 className="font-semibold text-lg">{video.title}</h2>
                <p className="text-sm text-muted-foreground">
                  {video.topic} • {video.language}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
