import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import {
    Search,
    Clock,
    User,
    FileText,
    X,
    Filter,
    BookOpen,
} from 'lucide-react';
import { museumData } from '@/utils/museumData';
import type { LibraryItem } from '@/types/museum';

export default function Library() {
    const { themeColors } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedArticle, setSelectedArticle] = useState<LibraryItem | null>(
        null
    );

    // Get unique categories
    const categories = Array.from(
        new Set(museumData.libraryContent.map((item) => item.category))
    );

    const filteredArticles = museumData.libraryContent.filter((article) => {
        const matchesCategory =
            !selectedCategory || article.category === selectedCategory;
        const matchesSearch =
            !searchQuery ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
            <MuseumHeader />

            {/* Main content */}
            <main className="flex-1 relative">
                {/* Background */}
                <div className="absolute inset-0 z-0">
                    <DotGridBackground
                        dotSize={2}
                        gap={30}
                        baseColor={themeColors.primary || '#ff8a00'}
                        activeColor="#ffffff"
                        proximity={100}
                        speedTrigger={0.5}
                        shockRadius={150}
                        shockStrength={0.3}
                        maxSpeed={2}
                        resistance={0.95}
                        returnDuration={1}
                        className="w-full h-full"
                    />
                </div>

                {/* Library Content */}
                <div className="relative z-10 container mx-auto px-4 py-8">
                    {/* Search and Filters */}
                    <div className="mb-8">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="flex-1 relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                            </div>
                            <Button
                                variant="outline"
                                className="bg-white/5 text-white border-white/10"
                            >
                                <Filter className="w-4 h-4 mr-2" />
                                Filters
                            </Button>
                        </div>
                    </div>

                    {/* Categories */}
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                        <Button
                            variant={
                                selectedCategory === null
                                    ? 'default'
                                    : 'outline'
                            }
                            className={`flex items-center space-x-2 ${
                                selectedCategory === null
                                    ? 'bg-white/20'
                                    : 'bg-white/5 border-white/10'
                            }`}
                            onClick={() => setSelectedCategory(null)}
                        >
                            All Categories
                        </Button>
                        {categories.map((category) => (
                            <Button
                                key={category}
                                variant={
                                    selectedCategory === category
                                        ? 'default'
                                        : 'outline'
                                }
                                className={`flex items-center space-x-2 ${
                                    selectedCategory === category
                                        ? 'bg-white/20'
                                        : 'bg-white/5 border-white/10'
                                }`}
                                onClick={() =>
                                    setSelectedCategory(
                                        selectedCategory === category
                                            ? null
                                            : category
                                    )
                                }
                            >
                                {category}
                            </Button>
                        ))}
                    </div>

                    {/* Articles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <motion.div
                                key={article.id}
                                whileHover={{ scale: 1.02 }}
                                className="bg-white/5 rounded-lg overflow-hidden cursor-pointer"
                                onClick={() => setSelectedArticle(article)}
                            >
                                <div className="aspect-video relative">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-6">
                                    <h3 className="text-xl font-bold text-white mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-white/70 mb-4 line-clamp-2">
                                        {article.excerpt}
                                    </p>
                                    <div className="flex items-center gap-6 text-white/50 text-sm">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {article.author}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {article.readTime}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Article Modal */}
                    {selectedArticle && (
                        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-slate-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            >
                                <div className="aspect-video relative">
                                    <img
                                        src={selectedArticle.imageUrl}
                                        alt={selectedArticle.title}
                                        className="w-full h-full object-cover"
                                    />
                                    <Button
                                        variant="ghost"
                                        className="absolute top-4 right-4 text-white"
                                        onClick={() => setSelectedArticle(null)}
                                    >
                                        <X className="h-6 w-6" />
                                    </Button>
                                </div>
                                <div className="p-8">
                                    <h2 className="text-3xl font-bold text-white mb-4">
                                        {selectedArticle.title}
                                    </h2>
                                    <div className="flex items-center gap-6 text-white/50 text-sm mb-6">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4" />
                                            {selectedArticle.author}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4" />
                                            {selectedArticle.readTime}
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4" />
                                            {selectedArticle.category}
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-lg leading-relaxed">
                                        {selectedArticle.excerpt}
                                    </p>
                                    {/* Full article content would go here */}
                                </div>
                            </motion.div>
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <motion.div
                                key={article.id}
                                whileHover={{ y: -5 }}
                                className="bg-white/5 rounded-lg overflow-hidden"
                            >
                                <div className="aspect-video">
                                    <img
                                        src={article.imageUrl}
                                        alt={article.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <div className="p-4">
                                    <div className="flex items-center gap-2 text-white/60 text-sm mb-2">
                                        <BookOpen className="w-4 h-4" />
                                        <span>{article.readTime}</span>
                                    </div>
                                    <h3 className="text-xl font-semibold text-white mb-2">
                                        {article.title}
                                    </h3>
                                    <p className="text-white/70 text-sm">
                                        {article.excerpt}
                                    </p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
