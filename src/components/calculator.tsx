'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Loader2, BrainCircuit, Delete } from 'lucide-react';
import { getMathProblems } from '@/app/actions';
import { useToast } from "@/hooks/use-toast"
import { Separator } from '@/components/ui/separator';

export function Calculator() {
    const [expression, setExpression] = useState('');
    const [result, setResult] = useState('');
    const [history, setHistory] = useState<string[]>([]);
    const [generatedProblems, setGeneratedProblems] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const { toast } = useToast();

    const handleButtonClick = (value: string) => {
        if (result === 'Error') {
            setExpression('');
            setResult('');
        }
    
        if (value === 'C') {
            setExpression('');
            setResult('');
            return;
        }

        if (value === 'backspace') {
            setExpression(prev => prev.slice(0, -1));
            return;
        }

        if (value === '=') {
            if (!expression) return;
            try {
                if (/[\+\-\*\/]$/.test(expression)) throw new Error('Invalid Expression');
                
                const evalResult = new Function('return ' + expression.replace(/--/g, '+'))();

                if (typeof evalResult !== 'number' || !isFinite(evalResult)) {
                  throw new Error("Invalid Result");
                }
                
                const res = String(evalResult);
                setResult(res);
                setHistory(prev => [`${expression} = ${res}`, ...prev].slice(0, 10));
                setExpression(res);
            } catch (e) {
                setResult('Error');
                setExpression('');
                toast({
                    title: "Calculation Error",
                    description: "The mathematical expression is invalid.",
                    variant: "destructive",
                });
            }
            return;
        }

        if (['+', '-', '*', '/'].includes(value)) {
            if (expression === '' && result) {
                setExpression(result + value);
                setResult('');
                return;
            }
            if (expression === '' && value !== '-') return;
            
            const lastChar = expression.slice(-1);
            if (['+', '*', '/'].includes(lastChar)) {
                setExpression(expression.slice(0, -1) + value);
            } else if (lastChar === '-' && value === '-') {
                return;
            }
            else {
                setExpression(expression + value);
            }
            setResult('');
            return;
        }
        
        if (value === '.') {
            const segments = expression.split(/([+\-*/])/);
            const lastSegment = segments[segments.length - 1];
            if (lastSegment.includes('.')) {
                return;
            }
        }
        
        if (result && !['+', '-', '*', '/'].some(op => expression.includes(op, expression.startsWith('-') ? 1 : 0))) {
            setExpression(value);
        } else {
            setExpression(prev => prev + value);
        }
        setResult('');
    };

    const handleGenerateProblems = async () => {
        setIsGenerating(true);
        setGeneratedProblems([]);
        const problems = await getMathProblems(history);
        if (problems[0].includes('error')) {
             toast({
                title: "AI Error",
                description: "Could not generate practice problems at this time.",
                variant: "destructive",
            });
        }
        setGeneratedProblems(problems);
        setIsGenerating(false);
    };

    const buttonLayout = [
        ['C', 'backspace', '(', ')'],
        ['7', '8', '9', '/'],
        ['4', '5', '6', '*'],
        ['1', '2', '3', '-'],
        ['0', '.', '+', '=']
    ];

    const getButtonClass = (btn: string) => {
        if (['/', '*', '-', '+', '='].includes(btn)) {
            return 'bg-primary/80 hover:bg-primary text-primary-foreground text-2xl';
        }
        if (['C', 'backspace'].includes(btn)) {
            return 'bg-destructive/90 hover:bg-destructive text-destructive-foreground text-xl';
        }
        return 'bg-secondary hover:bg-accent hover:text-accent-foreground text-2xl';
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 w-full max-w-5xl">
            <Card className="lg:col-span-3 border-2 border-primary/20 bg-background/50 shadow-lg shadow-primary/10 backdrop-blur-sm">
                <CardContent className="p-4 sm:p-6">
                    <div className="bg-muted/50 rounded-lg p-4 mb-6 text-right min-h-[120px] flex flex-col justify-between border border-border">
                        <p className="text-muted-foreground text-2xl sm:text-3xl font-mono break-words">{expression || <span className="opacity-50">0</span>}</p>
                        <p className="text-primary font-bold text-4xl sm:text-5xl font-mono break-words">{result || <span className="opacity-0">0</span>}</p>
                    </div>
                    <div className="grid grid-cols-4 gap-2">
                        {buttonLayout.flat().map((btn) => {
                            const isZero = btn === '0';
                            const isEqual = btn === '=';
                            return (
                                <Button
                                    key={btn}
                                    onClick={() => handleButtonClick(btn)}
                                    className={`h-16 transition-transform duration-100 active:scale-95 ${getButtonClass(btn)} ${isZero ? 'col-span-2' : ''} ${isEqual ? 'col-span-1' : ''}`}
                                >
                                    {btn === 'backspace' ? <Delete /> : btn}
                                </Button>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2 border-2 border-primary/20 bg-background/50 shadow-lg shadow-primary/10 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle>History & Practice</CardTitle>
                    <CardDescription>Your recent calculations and AI-powered practice problems.</CardDescription>
                </CardHeader>
                <CardContent>
                    <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Calculation History</h3>
                    <ScrollArea className="h-40 rounded-md border p-3 bg-muted/50">
                        {history.length > 0 ? (
                            history.map((item, index) => <p key={index} className="font-mono text-sm mb-1 text-foreground">{item}</p>)
                        ) : (
                            <p className="text-sm text-muted-foreground italic">Your calculation history will appear here.</p>
                        )}
                    </ScrollArea>

                    <Separator className="my-4 bg-border/50" />

                    <div className="space-y-4">
                        <Button onClick={handleGenerateProblems} disabled={isGenerating} className="w-full bg-primary/90 hover:bg-primary text-primary-foreground">
                            {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <BrainCircuit className="mr-2 h-4 w-4" />}
                            Generate Problems
                        </Button>

                        <div>
                            <h3 className="font-semibold mb-2 text-sm text-muted-foreground">Practice Problems</h3>
                            <div className="min-h-[100px] rounded-md border border-dashed border-primary/30 p-3 text-primary space-y-2 bg-muted/30">
                                {generatedProblems.length > 0 ? (
                                    generatedProblems.map((prob, index) => (
                                        <p key={index} className="font-mono">{prob}</p>
                                    ))
                                ) : (
                                    <p className="text-sm text-muted-foreground italic">Click the button to generate practice problems based on your history.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
