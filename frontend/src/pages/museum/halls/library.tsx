import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/themecontext';
import MuseumHeader from '@/components/custom/MuseumHeader';
import DotGridBackground from '@/components/immmersive 3d/DotGridBackground';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectTrigger,
    SelectValue,
    SelectContent,
    SelectItem,
} from '@/components/ui/select';
import ReactMarkDown from 'react-markdown';

// ⭐ MODIFIED IMPORT: Added ChevronDown
import { Search, Clock, User, FileText, X, ChevronDown } from 'lucide-react';
import { museumData } from '@/utils/museumData';
import type { LibraryItem } from '@/types/museum';
import axInstance from '@/utils/axiosInstance'; // adjust path

// --- HELPER FUNCTION: Fetch Proverb Strings ---
// Assuming the backend (proverbs.ts) returns a list of proverb strings (string[])
const fetchProverbsList = async (community: string): Promise<string[]> => {
    try {
        // The backend endpoint is called with the selected community
        const res = await axInstance.get(`/proverbs?community=${community}`); // The response data (string[]) is returned
        return res.data;
    } catch (err) {
        console.error('Failed to fetch proverbs list:', err);
        return [];
    }
};

export default function Library() {
    const { themeColors } = useTheme(); /** Articles state */

    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<string | null>(
        null
    );
    const [selectedArticle, setSelectedArticle] = useState<LibraryItem | null>(
        null
    ); /** Proverbs state */

    const [community, setCommunity] = useState<'Maasai' | 'Kikuyu'>('Maasai'); // proverbsList holds the fetched array of proverb strings
    const [proverbsList, setProverbsList] = useState<string[]>([]); // proverbQuery holds the input text (either selected or typed)
    const [proverbQuery, setProverbQuery] = useState('');
    const [proverbResult, setProverbResult] = useState<string | null>(null);
    const [loadingProverb, setLoadingProverb] = useState(false);
    const [retryAttempt, setRetryAttempt] = useState(0); // ⭐ CORE FUNCTIONALITY: Fetching the list
    /** Load proverbs list whenever community changes */

    useEffect(() => {
        // Reset proverb data when community changes
        setProverbResult(null);
        setProverbQuery(''); // Call the async fetch function and update the state
        fetchProverbsList(community).then((list) => {
            setProverbsList(list);
            if (list.length === 0) {
                console.warn(
                    `No proverbs received for ${community}. Check backend logs.`
                );
            }
        });
    }, [community]); /** Articles filtering */

    const categories = Array.from(
        new Set(museumData.libraryContent.map((i) => i.category))
    );
    const filteredArticles = museumData.libraryContent.filter((article) => {
        const matchesCategory =
            !selectedCategory || article.category === selectedCategory;
        const matchesSearch =
            !searchQuery ||
            article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            article.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesCategory && matchesSearch;
    }); /** Handle AI explanation request (with retry logic) */

    const handleProverbSearch = async () => {
        if (!proverbQuery)
            return setProverbResult('Please select or type a proverb.');

        setLoadingProverb(true);
        setRetryAttempt(0);

        const maxAttempts = 3;
        const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            setRetryAttempt(attempt);
            try {
                const res = await axInstance.post('/proverbs/explain', {
                    community,
                    proverb: proverbQuery,
                });

                setProverbResult(
                    res.data.explanation || 'No explanation returned.'
                );
                break;
            } catch (err: any) {
                if (err.response?.status === 503 && attempt < maxAttempts) {
                    await delay(2000);
                } else {
                    setProverbResult(
                        err.response?.data?.error ||
                            'Failed to fetch explanation.'
                    );
                    break;
                }
            }
        }

        setLoadingProverb(false);
    };

    return (
        <div className="min-h-screen flex flex-col bg-slate-900">
                  <MuseumHeader />     {' '}
            <main className="flex-1 relative">
                       {' '}
                <div className="absolute inset-0 z-0">
                             {' '}
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
                           {' '}
                </div>
                       {' '}
                <div className="relative z-10 container mx-auto px-4 py-8">
                              {/* Library Section (Articles) */}         {' '}
                    <div className="mb-12">
                                   {' '}
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Library
                        </h2>
                                    {/* Search & Categories */}           {' '}
                        <div className="mb-8 flex flex-col md:flex-row gap-4">
                                         {' '}
                            <div className="flex-1 relative">
                                               {' '}
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                               {' '}
                                <input
                                    type="text"
                                    placeholder="Search articles..."
                                    className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                                    value={searchQuery}
                                    onChange={(e) =>
                                        setSearchQuery(e.target.value)
                                    }
                                />
                                             {' '}
                            </div>
                                       {' '}
                        </div>
                                   {' '}
                        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                                         {' '}
                            <Button
                                variant={
                                    selectedCategory === null
                                        ? 'default'
                                        : 'outline'
                                }
                                onClick={() => setSelectedCategory(null)}
                            >
                                All Categories
                            </Button>
                                         {' '}
                            {categories.map((cat) => (
                                <Button
                                    key={cat}
                                    variant={
                                        selectedCategory === cat
                                            ? 'default'
                                            : 'outline'
                                    }
                                    onClick={() =>
                                        setSelectedCategory(
                                            selectedCategory === cat
                                                ? null
                                                : cat
                                        )
                                    }
                                >
                                                      {cat}               {' '}
                                </Button>
                            ))}
                                       {' '}
                        </div>
                                    {/* Articles Grid */}           {' '}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                         {' '}
                            {filteredArticles.map((article) => (
                                <motion.div
                                    key={article.id}
                                    whileHover={{ scale: 1.02 }}
                                    className="bg-white/5 rounded-lg overflow-hidden cursor-pointer"
                                    onClick={() => setSelectedArticle(article)}
                                >
                                                     {' '}
                                    <div className="aspect-video relative">
                                                           {' '}
                                        <img
                                            src={article.imageUrl}
                                            alt={article.title}
                                            className="w-full h-full object-cover"
                                        />
                                                         {' '}
                                    </div>
                                                     {' '}
                                    <div className="p-6">
                                                           {' '}
                                        <h3 className="text-xl font-bold text-white mb-2">
                                            {article.title}
                                        </h3>
                                                           {' '}
                                        <p className="text-white/70 mb-4 line-clamp-2">
                                            {article.excerpt}
                                        </p>
                                                           {' '}
                                        <div className="flex items-center gap-6 text-white/50 text-sm">
                                                                 {' '}
                                            <div className="flex items-center gap-2">
                                                <User className="h-4 w-4" />
                                                {article.author}
                                            </div>
                                                                 {' '}
                                            <div className="flex items-center gap-2">
                                                <Clock className="h-4 w-4" />
                                                {article.readTime}
                                            </div>
                                                               {' '}
                                        </div>
                                                         {' '}
                                    </div>
                                                   {' '}
                                </motion.div>
                            ))}
                                       {' '}
                        </div>
                                 {' '}
                    </div>
                              ---           {/* Proverbs Section */}         {' '}
                    <div className="mb-12">
                                   {' '}
                        <h2 className="text-3xl font-bold text-white mb-6">
                            Proverbs & Oral Traditions
                        </h2>
                                   {' '}
                        <div className="flex flex-col md:flex-row gap-4 mb-6 items-center">
                                          {/* Community Select */}             {' '}
                            <Select
                                value={community}
                                onValueChange={(val: 'Maasai' | 'Kikuyu') =>
                                    setCommunity(val)
                                }
                            >
                                               {' '}
                                <SelectTrigger className="w-48 bg-white/5 border border-white/10 text-white rounded-lg p-2">
                                                     {' '}
                                    <SelectValue placeholder="Select community" />
                                                   {' '}
                                </SelectTrigger>
                                               {' '}
                                <SelectContent>
                                                     {' '}
                                    <SelectItem value="Maasai">
                                        Maasai
                                    </SelectItem>
                                                     {' '}
                                    <SelectItem value="Kikuyu">
                                        Kikuyu
                                    </SelectItem>
                                                   {' '}
                                </SelectContent>
                                             {' '}
                            </Select>
                                         {' '}
                            {/* Proverb search/select (input + datalist) */}   
                                     {' '}
                            <div className="flex-1 relative">
                                               {' '}
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
                                               {' '}
                                {/* ⭐ ADDED ICON: ChevronDown to visually suggest a dropdown */}
                                               {' '}
                                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/50 pointer-events-none" />
                                               {' '}
                                <input
                                    type="text"
                                    placeholder="Select a proverb..."
                                    className="w-full pl-10 pr-10 py-2 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-white/20"
                                    value={proverbQuery}
                                    onChange={(e) =>
                                        setProverbQuery(e.target.value)
                                    }
                                    list="proverbs-list"
                                />
                                               {' '}
                                <datalist id="proverbs-list">
                                                     {' '}
                                    {/* Populated by the fetched proverbsList state */}
                                                     {' '}
                                    {proverbsList.map((p, i) => (
                                        <option key={i} value={p} />
                                    ))}
                                                   {' '}
                                </datalist>
                                             {' '}
                            </div>
                                         {' '}
                            <Button
                                onClick={handleProverbSearch}
                                className="bg-white/5 text-white border-white/10"
                            >
                                               {' '}
                                {loadingProverb ? 'Loading...' : 'Explain'}     
                                       {' '}
                            </Button>
                                       {' '}
                        </div>
                                    {/* Loading/Retry Messages */}           {' '}
                        {loadingProverb && (
                            <p className="text-white/50">
                                               {' '}
                                {retryAttempt > 1
                                    ? `Retrying... (Attempt ${retryAttempt})`
                                    : 'Generating explanation...'}
                                             {' '}
                            </p>
                        )}
                                    {/* Result Display */}           {' '}
                        {proverbResult && !loadingProverb && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="bg-white/10 p-6 rounded-lg text-white"
                            >
                                <p>
                                                   {' '}
                                    <ReactMarkDown>
                                        {proverbResult}
                                    </ReactMarkDown>
                                </p>
                                             {' '}
                            </motion.div>
                        )}
                                 {' '}
                    </div>
                           {' '}
                </div>
                     {' '}
            </main>
                  {/* Article Modal */}     {' '}
            {selectedArticle && (
                <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
                             {' '}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="bg-slate-800 rounded-xl overflow-hidden max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                    >
                                   {' '}
                        <div className="aspect-video relative">
                                         {' '}
                            <img
                                src={selectedArticle.imageUrl}
                                alt={selectedArticle.title}
                                className="w-full h-full object-cover"
                            />
                                         {' '}
                            <Button
                                variant="ghost"
                                className="absolute top-4 right-4 text-white"
                                onClick={() => setSelectedArticle(null)}
                            >
                                <X className="h-6 w-6" />
                            </Button>
                                       {' '}
                        </div>
                                   {' '}
                        <div className="p-8">
                                         {' '}
                            <h2 className="text-3xl font-bold text-white mb-4">
                                {selectedArticle.title}
                            </h2>
                                         {' '}
                            <div className="flex items-center gap-6 text-white/50 text-sm mb-6">
                                               {' '}
                                <div className="flex items-center gap-2">
                                    <User className="h-4 w-4" />
                                    {selectedArticle.author}
                                </div>
                                               {' '}
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4" />
                                    {selectedArticle.readTime}
                                </div>
                                               {' '}
                                <div className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    {selectedArticle.category}
                                </div>
                                             {' '}
                            </div>
                                         {' '}
                            <p className="text-white/70 text-lg leading-relaxed">
                                {selectedArticle.excerpt}
                            </p>
                                       {' '}
                        </div>
                                 {' '}
                    </motion.div>
                           {' '}
                </div>
            )}
               {' '}
        </div>
    );
}
