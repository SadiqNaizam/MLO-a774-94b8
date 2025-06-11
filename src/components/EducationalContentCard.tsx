import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Lightbulb } from 'lucide-react'; // Example icon

interface EducationalContentCardProps {
  title: string;
  description?: string;
  content: React.ReactNode;
  imageUrl?: string;
  actionText?: string;
  onActionClick?: () => void;
  className?: string;
}

const EducationalContentCard: React.FC<EducationalContentCardProps> = ({
  title,
  description,
  content,
  imageUrl,
  actionText,
  onActionClick,
  className,
}) => {
  console.log(`Rendering EducationalContentCard: ${title}`);
  return (
    <Card className={cn("w-full", className)}>
      <CardHeader>
        <div className="flex items-start justify-between">
            <CardTitle className="text-md font-semibold">{title}</CardTitle>
            <Lightbulb className="h-5 w-5 text-yellow-500 flex-shrink-0 ml-2" />
        </div>
        {description && <CardDescription className="text-xs">{description}</CardDescription>}
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {imageUrl && (
          <div className="aspect-video w-full overflow-hidden rounded-md mb-3">
            <img src={imageUrl} alt={title} className="object-cover w-full h-full" />
          </div>
        )}
        <div>{content}</div>
      </CardContent>
      {actionText && onActionClick && (
        <CardFooter>
          <Button variant="link" size="sm" onClick={onActionClick} className="p-0 h-auto">
            {actionText}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
};

export default EducationalContentCard;