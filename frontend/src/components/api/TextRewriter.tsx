import React, { useState } from 'react';
import { rewriteText, RewriteResponse } from '../../api/rewrite';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const TextRewriter: React.FC = () => {
  const [originalText, setOriginalText] = useState<string>('');
  const [rewrittenText, setRewrittenText] = useState<string>('');
  const [tone, setTone] = useState<string>('フレンドリーで絵文字も使う');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleRewrite = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response: RewriteResponse = await rewriteText(originalText, tone);
      setRewrittenText(response.rewritten_text);
    } catch (err) {
      setError('Failed to rewrite text. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AI Text Rewriter</CardTitle>
        <CardDescription>指定した口調でリライトしてくれます</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Textarea
            value={originalText}
            onChange={(e) => setOriginalText(e.target.value)}
            placeholder="Enter text to rewrite"
            rows={5}
          />
          <Select value={tone} onValueChange={setTone}>
            <SelectTrigger>
              <SelectValue placeholder="Select tone" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="フレンドリーで絵文字も使う">フレンドリー（絵文字付き）</SelectItem>
              <SelectItem value="フォーマル">フォーマル</SelectItem>
              <SelectItem value="カジュアル">カジュアル</SelectItem>
              <SelectItem value="プロフェッショナル">プロフェッショナル</SelectItem>
            </SelectContent>
          </Select>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {rewrittenText && (
            <Card>
              <CardHeader>
                <CardTitle>Rewritten Text</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{rewrittenText}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRewrite} 
          disabled={isLoading || !originalText}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Rewriting
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Rewrite
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TextRewriter;