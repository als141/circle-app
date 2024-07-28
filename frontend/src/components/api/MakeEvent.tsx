import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { makeEvent, MakeEventResponse } from '../../api/makeEvent';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const MakeEvent: React.FC = () => {
  const [description, setDescription] = useState<string>('');
  const [dateTime, setDateTime] = useState<string>('');
  const [location, setLocation] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleMakeEvent = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const result: MakeEventResponse = await makeEvent(description, dateTime, location, budget);
      setResponse(result.event_suggestions);
    } catch (err) {
      setError('イベントの提案に失敗しました。再試行してください。');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>AIによるイベント提案</CardTitle>
        <CardDescription>イベントの詳細を入力してください</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">イベントの説明</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="どんなイメージのイベントにするか"
              rows={3}
            />
          </div>
          <div>
            <Label htmlFor="dateTime">日時</Label>
            <Input
              id="dateTime"
              type="datetime-local"
              value={dateTime}
              onChange={(e) => setDateTime(e.target.value)}
              className="w-full"
            />
          </div>
          <div>
            <Label htmlFor="location">場所</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="イベントの場所"
            />
          </div>
          <div>
            <Label htmlFor="budget">予算</Label>
            <Input
              id="budget"
              value={budget}
              onChange={(e) => setBudget(e.target.value)}
              placeholder="イベントの予算"
            />
          </div>
          {error && (
            <Alert variant="destructive">
              <AlertTitle>エラー</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {response && (
            <Alert variant="default">
              <AlertTitle>イベント提案</AlertTitle>
              <AlertDescription className="prose max-w-none">
                <ReactMarkdown>{response}</ReactMarkdown>
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={handleMakeEvent}
          disabled={isLoading || !description || !dateTime || !location || !budget}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              提案中
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              イベントを提案する
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MakeEvent;