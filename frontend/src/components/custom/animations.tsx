// SVG Animation Components
export const AnimatedCamera = ({ delay = 0, x = 0, y = 0 }) => (
    <g transform={`translate(${x}, ${y})`}>
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values={`${x},${y}; ${x},${y - 10}; ${x},${y}`}
            dur="3s"
            begin={`${delay}s`}
            repeatCount="indefinite"
        />
        <rect
            x="0"
            y="10"
            width="40"
            height="25"
            rx="3"
            fill="rgba(245, 245, 233, 0.3)"
            stroke="rgba(245, 245, 233, 0.5)"
            strokeWidth="1"
        />
        <circle
            cx="20"
            cy="22"
            r="8"
            fill="none"
            stroke="rgba(245, 245, 233, 0.6)"
            strokeWidth="2"
        />
        <circle cx="20" cy="22" r="5" fill="rgba(245, 245, 233, 0.4)" />
        <rect
            x="15"
            y="5"
            width="10"
            height="8"
            rx="2"
            fill="rgba(245, 245, 233, 0.4)"
        />
        <circle cx="32" cy="15" r="2" fill="rgba(245, 245, 233, 0.5)" />
    </g>
);

export const AnimatedPerson = ({ delay = 0, x = 0, y = 0 }) => (
    <g transform={`translate(${x}, ${y})`}>
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="translate"
            values={`${x},${y}; ${x + 5},${y}; ${x},${y}`}
            dur="4s"
            begin={`${delay}s`}
            repeatCount="indefinite"
        />
        {/* Head */}
        <circle
            cx="20"
            cy="15"
            r="8"
            fill="rgba(245, 245, 233, 0.3)"
            stroke="rgba(245, 245, 233, 0.5)"
            strokeWidth="1"
        />
        {/* Hat */}
        <ellipse
            cx="20"
            cy="10"
            rx="10"
            ry="4"
            fill="rgba(245, 245, 233, 0.4)"
        />
        {/* Body */}
        <rect
            x="12"
            y="23"
            width="16"
            height="25"
            rx="3"
            fill="rgba(245, 245, 233, 0.3)"
            stroke="rgba(245, 245, 233, 0.4)"
            strokeWidth="1"
        />
        {/* Arms */}
        <rect
            x="5"
            y="25"
            width="12"
            height="4"
            rx="2"
            fill="rgba(245, 245, 233, 0.3)"
        />
        <rect
            x="23"
            y="25"
            width="12"
            height="4"
            rx="2"
            fill="rgba(245, 245, 233, 0.3)"
        />
        {/* Legs */}
        <rect
            x="14"
            y="45"
            width="5"
            height="15"
            rx="2"
            fill="rgba(245, 245, 233, 0.3)"
        />
        <rect
            x="21"
            y="45"
            width="5"
            height="15"
            rx="2"
            fill="rgba(245, 245, 233, 0.3)"
        />
    </g>
);

export const AnimatedArtifact = ({
    delay = 0,
    x = 0,
    y = 0,
    type = 'vase',
}) => (
    <g transform={`translate(${x}, ${y})`}>
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="0; 5; -5; 0"
            dur="6s"
            begin={`${delay}s`}
            repeatCount="indefinite"
        />
        {type === 'vase' ? (
            <>
                <ellipse
                    cx="20"
                    cy="35"
                    rx="12"
                    ry="5"
                    fill="rgba(245, 245, 233, 0.3)"
                />
                <rect
                    x="12"
                    y="15"
                    width="16"
                    height="20"
                    rx="2"
                    fill="rgba(245, 245, 233, 0.3)"
                    stroke="rgba(245, 245, 233, 0.4)"
                    strokeWidth="1"
                />
                <ellipse
                    cx="20"
                    cy="15"
                    rx="8"
                    ry="3"
                    fill="rgba(245, 245, 233, 0.4)"
                />
                <rect
                    x="18"
                    y="10"
                    width="4"
                    height="8"
                    rx="1"
                    fill="rgba(245, 245, 233, 0.4)"
                />
            </>
        ) : (
            <>
                <rect
                    x="8"
                    y="20"
                    width="24"
                    height="16"
                    rx="2"
                    fill="rgba(245, 245, 233, 0.3)"
                    stroke="rgba(245, 245, 233, 0.4)"
                    strokeWidth="1"
                />
                <rect
                    x="10"
                    y="22"
                    width="20"
                    height="12"
                    fill="rgba(245, 245, 233, 0.2)"
                />
                <line
                    x1="12"
                    y1="24"
                    x2="28"
                    y2="24"
                    stroke="rgba(245, 245, 233, 0.4)"
                    strokeWidth="1"
                />
                <line
                    x1="12"
                    y1="27"
                    x2="25"
                    y2="27"
                    stroke="rgba(245, 245, 233, 0.4)"
                    strokeWidth="1"
                />
                <line
                    x1="12"
                    y1="30"
                    x2="22"
                    y2="30"
                    stroke="rgba(245, 245, 233, 0.4)"
                    strokeWidth="1"
                />
            </>
        )}
    </g>
);

const AnimatedFilmReel = ({ delay = 0, x = 0, y = 0 }) => (
    <g transform={`translate(${x}, ${y})`}>
        <animateTransform
            attributeName="transform"
            attributeType="XML"
            type="rotate"
            values="0; 360"
            dur="8s"
            begin={`${delay}s`}
            repeatCount="indefinite"
        />
        <circle
            cx="20"
            cy="20"
            r="15"
            fill="none"
            stroke="rgba(245, 245, 233, 0.4)"
            strokeWidth="2"
        />
        <circle
            cx="20"
            cy="20"
            r="8"
            fill="none"
            stroke="rgba(245, 245, 233, 0.5)"
            strokeWidth="1"
        />
        {[0, 60, 120, 180, 240, 300].map((angle, i) => (
            <circle
                key={i}
                cx={20 + 10 * Math.cos((angle * Math.PI) / 180)}
                cy={20 + 10 * Math.sin((angle * Math.PI) / 180)}
                r="3"
                fill="rgba(245, 245, 233, 0.3)"
            />
        ))}
    </g>
);

export const BackgroundPattern = () => (
    <div className="absolute inset-0 overflow-hidden">
        <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
        >
            {/* Floating background icons */}
            {[...Array(8)].map((_, i) => (
                <g key={i} opacity="0.1">
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        values={`${Math.random() * 500},${Math.random() * 800}; ${
                            Math.random() * 500
                        },${Math.random() * 800 - 50}; ${Math.random() * 500},${
                            Math.random() * 800
                        }`}
                        dur={`${15 + Math.random() * 10}s`}
                        repeatCount="indefinite"
                    />
                    <AnimatedCamera delay={i * 2} x={0} y={0} />
                </g>
            ))}

            {[...Array(6)].map((_, i) => (
                <g key={i} opacity="0.08">
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        values={`${Math.random() * 500},${Math.random() * 800}; ${
                            Math.random() * 500
                        },${Math.random() * 800 - 30}; ${Math.random() * 500},${
                            Math.random() * 800
                        }`}
                        dur={`${20 + Math.random() * 15}s`}
                        repeatCount="indefinite"
                    />
                    <AnimatedArtifact
                        delay={i * 3}
                        x={0}
                        y={0}
                        type={i % 2 === 0 ? 'vase' : 'scroll'}
                    />
                </g>
            ))}

            {[...Array(4)].map((_, i) => (
                <g key={i} opacity="0.06">
                    <animateTransform
                        attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        values={`${Math.random() * 500},${Math.random() * 800}; ${
                            Math.random() * 500
                        },${Math.random() * 800 - 20}; ${Math.random() * 500},${
                            Math.random() * 800
                        }`}
                        dur={`${25 + Math.random() * 10}s`}
                        repeatCount="indefinite"
                    />
                    <AnimatedFilmReel delay={i * 4} x={0} y={0} />
                </g>
            ))}
        </svg>
    </div>
);

export const ForegroundAnimations = () => (
    <div className="absolute inset-0 pointer-events-none">
        <svg
            width="100%"
            height="100%"
            xmlns="http://www.w3.org/2000/svg"
            className="absolute inset-0"
        >
            {/* Main featured animations */}
            <AnimatedCamera delay={1} x={50} y={150} />
            <AnimatedPerson delay={0} x={80} y={300} />
            <AnimatedCamera delay={3} x={150} y={100} />
            <AnimatedArtifact delay={2} x={200} y={250} type="vase" />
            <AnimatedPerson delay={4} x={120} y={500} />
            <AnimatedFilmReel delay={1.5} x={300} y={180} />
            <AnimatedArtifact delay={3.5} x={180} y={400} type="scroll" />
            <AnimatedCamera delay={2.5} x={250} y={350} />

            {/* Additional scattered elements */}
            <AnimatedPerson delay={5} x={60} y={600} />
            <AnimatedFilmReel delay={4.5} x={320} y={450} />
            <AnimatedArtifact delay={1} x={40} y={450} type="vase" />
            <AnimatedCamera delay={4} x={280} y={520} />
        </svg>
    </div>
);

// Micro Animation (emoji sparkles)
export const MicroAnimation = () => (
    <>
        <span
            style={{
                position: 'absolute',
                left: 24,
                top: 24,
                fontSize: '1.5rem',
                opacity: 0.18,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            ✨
        </span>
        <span
            style={{
                position: 'absolute',
                right: 32,
                top: 32,
                fontSize: '1.2rem',
                opacity: 0.18,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            💡
        </span>
        <span
            style={{
                position: 'absolute',
                left: '50%',
                top: 80,
                transform: 'translateX(-50%)',
                fontSize: '4rem',
                opacity: 0.12,
                pointerEvents: 'none',
                zIndex: 0,
            }}
        >
            ❤️
        </span>
    </>
);
