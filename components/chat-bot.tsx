'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Bot, User, Copy, RotateCcw, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCurrentUserImage } from '@/hooks/use-current-user-image';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { askAranya } from '@/app/ai/flows/plant-chatbot-flow';

interface Message {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    timestamp: Date;
}

interface TypingIndicatorProps {
    isVisible: boolean;
}

function TypingIndicator({ isVisible }: TypingIndicatorProps) {
    if (!isVisible) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="flex items-center space-x-2 px-4 py-2"
        >
            <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-primary/10">
                    <Bot className="w-4 h-4 text-primary" />
                </AvatarFallback>
            </Avatar>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <span>Aranya is thinking</span>
                <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.2, 1],
                                opacity: [0.5, 1, 0.5],
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.15,
                                ease: 'easeInOut',
                            }}
                            className="w-1 h-1 bg-muted-foreground rounded-full"
                        />
                    ))}
                </div>
            </div>
        </motion.div>
    );
}

interface MessageItemProps {
    message: Message;
    onCopy: (content: string) => void;
    onRegenerate?: () => void;
    userImage?: string | null;
}

function MessageItem({ message, onCopy, onRegenerate, userImage }: MessageItemProps) {
    const isUser = message.role === 'user';

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex gap-3 p-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
        >
            <Avatar className="w-8 h-8 shrink-0 ">
                {isUser && userImage ? (
                        <img src={userImage} alt="User" className="w-full h-full object-cover rounded-full" />
        
                ) : (
                    <AvatarFallback className={isUser ? 'bg-blue-100 dark:bg-blue-900' : 'bg-primary/10'}>
                        {isUser ? (
                            <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        ) : (
                            <Bot className="w-4 h-4 text-primary" />
                        )}
                    </AvatarFallback>
                )}
            </Avatar>

            <div className={`flex-1 max-w-[80%] ${isUser ? 'items-end' : 'items-start'} flex flex-col`}>
                <Card
                    className={`p-3 max-w-full ${isUser
                        ? 'bg-sidebar-primary text-white ml-auto border-blue-500'
                        : 'bg-muted/50 border-muted'
                        }`}
                >
                    <div className="text-sm leading-relaxed whitespace-pre-wrap wrap-break-words prose prose-sm max-w-none dark:prose-invert">
                        {/* Render markdown-style content */}
                        <div dangerouslySetInnerHTML={{
                            __html: message.content
                                .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                .replace(/\*(.*?)\*/g, '<em>$1</em>')
                                .replace(/\n/g, '<br>')
                        }} />
                    </div>
                </Card>

                <div className={`flex items-center gap-1 mt-2 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                    <p className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
                    </p>

                    {!isUser && (
                        <div className="flex items-center gap-1">
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0"
                                onClick={() => onCopy(message.content)}
                            >
                                <Copy className="w-3 h-3" />
                            </Button>
                            {onRegenerate && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0"
                                    onClick={onRegenerate}
                                >
                                    <RotateCcw className="w-3 h-3" />
                                </Button>
                            )}
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsUp className="w-3 h-3" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <ThumbsDown className="w-3 h-3" />
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
}

export default function ChatBot() {
    const userImage = useCurrentUserImage();
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'assistant',
            content: '🌿 ** नमस्ते !** I\'m ** अरण्य **, your AI plant healing assistant. My name means "forest" in Sanskrit.\n\nI specialize in:\n• **Plant identification** and botanical knowledge\n• **Ayurvedic medicine** and herbal remedies\n• **Natural treatments** for plant diseases\n• **Traditional healing** wisdom and practices\n\nHow can I help you explore the healing power of plants today?',
            timestamp: new Date(),
        },
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            role: 'user',
            content: input.trim(),
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        // Call the actual Gemini API through the askAranya flow
        try {
            const response = await askAranya({ question: userMessage.content });

            const aiResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, aiResponse]);
        } catch (error) {
            console.error('Gemini API error:', error);
            toast.error('Failed to get response from Aranya. Please try again.');

            // Add error message to chat
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: 'assistant',
                content: '🌿 I apologize, but I\'m having trouble connecting to my knowledge base right now. Please try asking your question again in a moment.\n\n**Error:** Unable to process your request at this time.',
                timestamp: new Date(),
            };
            setMessages((prev) => [...prev, errorResponse]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const handleCopy = (content: string) => {
        // Remove markdown formatting for clipboard
        const plainText = content
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/<[^>]*>/g, '');

        navigator.clipboard.writeText(plainText);
        toast.success('Message copied to clipboard!');
    };

    const handleRegenerate = async () => {
        // Regenerate last AI response
        if (messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
            const lastUserMessage = messages[messages.length - 2];
            if (lastUserMessage) {
                setMessages((prev) => prev.slice(0, -1));
                setIsLoading(true);

                try {
                    const response = await askAranya({ question: lastUserMessage.content });

                    const aiResponse: Message = {
                        id: Date.now().toString(),
                        role: 'assistant',
                        content: response,
                        timestamp: new Date(),
                    };
                    setMessages((prev) => [...prev, aiResponse]);
                } catch (error) {
                    console.error('Regeneration error:', error);
                    toast.error('Failed to regenerate response.');
                } finally {
                    setIsLoading(false);
                }
            }
        }
    };

    return (
        <div className="flex flex-col max-h-screen bg-background py-20">
            {/* Header */}
            <div className="0 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
                            <Bot className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                            <h1 className="font-semibold text-lg">अरण्य - Plant Healing Assistant</h1>
                            <p className="text-sm text-muted-foreground">AI-powered Ayurvedic & Botanical Guide</p>
                        </div>
                    </div>
                    <Badge variant="secondary" className="text-xs">
                        🌿 Online
                    </Badge>
                </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 space-y-2">
                <div className="max-w-4xl mx-auto">
                    <AnimatePresence>
                        {messages.map((message) => (
                            <MessageItem
                                key={message.id}
                                message={message}
                                onCopy={handleCopy}
                                userImage={userImage}
                                onRegenerate={
                                    message.role === 'assistant' &&
                                        message.id === messages[messages.length - 1]?.id
                                        ? handleRegenerate
                                        : undefined
                                }
                            />
                        ))}
                    </AnimatePresence>

                    <TypingIndicator isVisible={isLoading} />
                    <div ref={messagesEndRef} />
                </div>
            </div>

            {/* Input */}
            <div className="shrink-0 h-12 border-t bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="max-w-4xl mx-auto p-4">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Ask Aranya about plants, herbs, Ayurveda, natural healing..."
                                className="min-h-11 max-h-50 pr-12 resize-none"
                                disabled={isLoading}
                            />
                            <Button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                size="sm"
                                className="absolute right-1 bottom-1 h-8 w-8 p-0"
                            >
                                <Send className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 text-center">
                        Press Enter to send, Shift+Enter for new line • Powered by Gemini AI
                    </p>
                </div>
            </div>
        </div>
    );
}