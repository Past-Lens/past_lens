// Museum data containing artifacts, stories, and other content
export const museumData = {
    artifacts: [
        {
            id: 1,
            name: 'The Rosetta Stone',
            period: '196 BCE',
            origin: 'Ancient Egypt',
            description:
                'A granodiorite stele inscribed with three versions of a decree issued in Memphis, Egypt. The key to understanding Egyptian hieroglyphs.',
            imageUrl: '/images/artifacts/rosetta-stone.jpg',
            model3dUrl: '/models/rosetta-stone.glb',
            category: 'Ancient Writing',
            position: [0, 0, -5],
        },
        {
            id: 2,
            name: 'Sutton Hoo Helmet',
            period: '6th-7th century CE',
            origin: 'Anglo-Saxon England',
            description:
                'An ornate ceremonial helmet from the Sutton Hoo ship burial, featuring intricate decorations and a fearsome face mask.',
            imageUrl: '/images/artifacts/sutton-hoo.jpg',
            model3dUrl: '/models/sutton-hoo.glb',
            category: 'Medieval',
            position: [5, 3, -3],
        },
        {
            id: 3,
            name: 'Terracotta Warriors',
            period: '210-209 BCE',
            origin: 'Ancient China',
            description:
                'Life-sized terracotta sculptures depicting the armies of Qin Shi Huang, protecting the emperor in the afterlife.',
            imageUrl: '/images/artifacts/terracotta-warrior.jpg',
            model3dUrl: '/models/terracotta-warrior.glb',
            category: 'Ancient Army',
            position: [-5, -2, -4],
        },
        {
            id: 4,
            name: 'Aztec Sun Stone',
            period: 'Late Post-classic period',
            origin: 'Mexico',
            description:
                'A massive basalt disk carved with symbols representing the Aztec universe and calendar system.',
            imageUrl: '/images/artifacts/sun-stone.jpg',
            model3dUrl: '/models/sun-stone.glb',
            category: 'Mesoamerican',
            position: [3, 2, -6],
        },
    ],
    culturalStories: [
        {
            id: 1,
            title: 'The Epic of Gilgamesh',
            culture: 'Ancient Mesopotamia',
            period: 'c. 2100 BCE',
            description:
                "The world's oldest surviving literary work, telling the story of a legendary king's quest for immortality.",
            audioUrl: '/audio/gilgamesh.mp3',
            imageUrl: '/images/stories/gilgamesh.jpg',
            duration: '15:30',
        },
        {
            id: 2,
            title: 'Tale of the Dreamtime',
            culture: 'Indigenous Australian',
            period: 'Ancient',
            description:
                "Aboriginal stories of the Rainbow Serpent and the creation of the world's landscapes and creatures.",
            audioUrl: '/audio/dreamtime.mp3',
            imageUrl: '/images/stories/dreamtime.jpg',
            duration: '12:45',
        },
        {
            id: 3,
            title: 'The Legend of Amaterasu',
            culture: 'Japanese',
            period: 'Classical Period',
            description:
                'The tale of the sun goddess Amaterasu and her retreat into a cave, plunging the world into darkness.',
            audioUrl: '/audio/amaterasu.mp3',
            imageUrl: '/images/stories/amaterasu.jpg',
            duration: '18:20',
        },
    ],
    libraryContent: [
        {
            id: 1,
            title: 'The Evolution of Writing Systems',
            category: 'History',
            author: 'Dr. Sarah Chen',
            readTime: '15 min',
            excerpt:
                'From cuneiform to modern alphabets, discover how human communication evolved across civilizations.',
            imageUrl: '/images/library/writing-systems.jpg',
        },
        {
            id: 2,
            title: 'Sacred Architecture Through Ages',
            category: 'Architecture',
            author: 'Prof. James Martinez',
            readTime: '20 min',
            excerpt:
                'Exploring the design principles behind temples, churches, mosques, and other sacred spaces.',
            imageUrl: '/images/library/sacred-architecture.jpg',
        },
        {
            id: 3,
            title: 'Traditional Crafts & Their Modern Revival',
            category: 'Artisan Skills',
            author: 'Emma Thompson',
            readTime: '12 min',
            excerpt:
                'How ancient crafting techniques are being preserved and reimagined in the contemporary world.',
            imageUrl: '/images/library/traditional-crafts.jpg',
        },
    ],
    guideTour: {
        welcomeVideo: '/videos/welcome-tour.mp4',
        steps: [
            {
                id: 1,
                title: 'Ancient Writing Gallery',
                description:
                    'Begin your journey through the evolution of human communication, featuring the Rosetta Stone.',
                location: 'Ground Floor, East Wing',
                videoUrl: '/videos/writing-gallery.mp4',
            },
            {
                id: 2,
                title: 'Medieval Treasures',
                description:
                    'Discover artifacts from the Middle Ages, including the magnificent Sutton Hoo burial treasure.',
                location: 'First Floor, North Wing',
                videoUrl: '/videos/medieval-gallery.mp4',
            },
            {
                id: 3,
                title: 'Asian Civilizations',
                description:
                    'Explore the rich cultural heritage of Asia, from the Terracotta Warriors to Japanese samurai armor.',
                location: 'Second Floor, West Wing',
                videoUrl: '/videos/asian-gallery.mp4',
            },
            {
                id: 4,
                title: 'Americas Gallery',
                description:
                    'Journey through the pre-Columbian civilizations and their remarkable achievements.',
                location: 'Second Floor, South Wing',
                videoUrl: '/videos/americas-gallery.mp4',
            },
        ],
    },
    categories: [
        {
            id: 1,
            name: 'Ancient Writing',
            icon: 'Scroll',
            artifactCount: 15,
        },
        {
            id: 2,
            name: 'Medieval',
            icon: 'Sword',
            artifactCount: 23,
        },
        {
            id: 3,
            name: 'Religious Artifacts',
            icon: 'Prayer',
            artifactCount: 18,
        },
        {
            id: 4,
            name: 'Ancient Warfare',
            icon: 'Shield',
            artifactCount: 12,
        },
        {
            id: 5,
            name: 'Daily Life',
            icon: 'Home',
            artifactCount: 30,
        },
        {
            id: 6,
            name: 'Art & Culture',
            icon: 'Palette',
            artifactCount: 25,
        },
    ],
};
