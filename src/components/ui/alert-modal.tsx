"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

interface AlertModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    loading: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
}

export function AlertModal({
    isOpen,
    onClose,
    onConfirm,
    loading,
    title,
    description,
    confirmText = "Continue",
    cancelText = "Cancel",
}: AlertModalProps) {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all"
                        onClick={loading ? undefined : onClose}
                    />

                    {/* Modal Content */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        className="relative z-50 w-full max-w-lg"
                    >
                        <Card className="border-destructive/20 shadow-2xl">
                            <CardHeader>
                                <CardTitle className="text-xl">{title}</CardTitle>
                                <CardDescription className="text-muted-foreground mt-2">
                                    {description}
                                </CardDescription>
                            </CardHeader>
                            <CardFooter className="flex justify-end space-x-2 pt-6">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    disabled={loading}
                                >
                                    {cancelText}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={onConfirm}
                                    disabled={loading}
                                >
                                    {loading ? "Deleting..." : confirmText}
                                </Button>
                            </CardFooter>
                        </Card>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>,
        document.body
    );
}
