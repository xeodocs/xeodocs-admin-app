"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function AnimatedBackground() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
            {/* Animated Gradient Orbs - Optimized */}
            <div className={`transition-opacity duration-1000 ${mounted ? "opacity-100" : "opacity-0"}`}>
                <motion.div
                    initial={{ opacity: 0.3, scale: 1 }}
                    animate={{
                        scale: [1, 1.1, 1],
                        opacity: [0.3, 0.4, 0.3],
                    }}
                    transition={{
                        duration: 15,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -top-[10%] -left-[10%] h-[50%] w-[50%] rounded-full bg-primary/10 blur-[80px]"
                    style={{ willChange: "transform, opacity" }}
                />

                <motion.div
                    initial={{ opacity: 0.2, x: 0 }}
                    animate={{
                        x: [0, -30, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute top-[20%] right-[0%] h-[40%] w-[40%] rounded-full bg-secondary/10 blur-[80px]"
                    style={{ willChange: "transform, opacity" }}
                />

                <motion.div
                    initial={{ opacity: 0.2, y: 0 }}
                    animate={{
                        y: [0, -30, 0],
                        opacity: [0.2, 0.3, 0.2],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                    }}
                    className="absolute -bottom-[10%] left-[20%] h-[60%] w-[60%] rounded-full bg-accent/10 blur-[100px]"
                    style={{ willChange: "transform, opacity" }}
                />
            </div>

            {/* Grid Overlay */}
            <div
                className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                style={{
                    backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
                    backgroundSize: '50px 50px',
                }}
            />
        </div>
    );
}
