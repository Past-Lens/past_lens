export interface Artifact {
    id: number;
    name: string;
    period: string;
    origin: string;
    description: string;
    imageUrl: string;
    model3dUrl: string;
    category: string;
    position: [number, number, number];
}

export interface CulturalStory {
    id: number;
    title: string;
    culture: string;
    period: string;
    description: string;
    audioUrl: string;
    imageUrl: string;
    duration: string;
}

export interface LibraryItem {
    id: number;
    title: string;
    category: string;
    author: string;
    readTime: string;
    excerpt: string;
    imageUrl: string;
}

export interface TourStep {
    id: number;
    title: string;
    description: string;
    location: string;
    videoUrl: string;
}

export interface GuideTour {
    welcomeVideo: string;
    steps: TourStep[];
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    artifactCount: number;
}

export interface MuseumData {
    artifacts: Artifact[];
    culturalStories: CulturalStory[];
    libraryContent: LibraryItem[];
    guideTour: GuideTour;
    categories: Category[];
}
