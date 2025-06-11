import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button'; // Example if an action is needed
import { Target, TrendingUp } from 'lucide-react'; // Example icons

interface GamifiedSavingsGoalTrackerProps {
  goalName: string;
  currentAmount: number;
  targetAmount: number;
  description?: string;
  imageUrl?: string; // Optional image for the goal
  reward?: string; // Optional reward badge/text
  onCheer?: () => void; // Example action
}

const GamifiedSavingsGoalTracker: React.FC<GamifiedSavingsGoalTrackerProps> = ({
  goalName,
  currentAmount,
  targetAmount,
  description,
  imageUrl,
  reward,
  onCheer,
}) => {
  console.log(`Rendering GamifiedSavingsGoalTracker: ${goalName}`);
  const progressPercentage = targetAmount > 0 ? (currentAmount / targetAmount) * 100 : 0;

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{goalName}</CardTitle>
          <Target className="h-6 w-6 text-blue-500" />
        </div>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-4">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-md">
            <img src={imageUrl} alt={goalName} className="object-cover w-full h-full" />
          </div>
        )}
        <div className="text-center">
          <p className="text-2xl font-bold text-blue-600">${currentAmount.toFixed(2)}</p>
          <p className="text-sm text-gray-500">raised of ${targetAmount.toFixed(2)}</p>
        </div>
        <Progress value={progressPercentage} aria-label={`${goalName} progress`} className="w-full h-3" />
        {reward && (
          <div className="flex justify-center">
            <Badge variant="secondary" className="mt-2 bg-yellow-100 text-yellow-700">
              Reward: {reward}
            </Badge>
          </div>
        )}
      </CardContent>
      {onCheer && (
         <CardFooter>
            <Button onClick={onCheer} className="w-full" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" /> Cheer On!
            </Button>
         </CardFooter>
      )}
    </Card>
  );
};

export default GamifiedSavingsGoalTracker;