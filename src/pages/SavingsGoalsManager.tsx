import React, { useState } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import GamifiedSavingsGoalTracker from '@/components/GamifiedSavingsGoalTracker';
import EducationalContentCard from '@/components/EducationalContentCard';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { PlusCircle, BookOpen } from 'lucide-react';

const goalSchema = z.object({
  goalName: z.string().min(3, "Goal name is too short"),
  targetAmount: z.coerce.number().positive("Target amount must be positive"),
  targetDate: z.date().optional(),
  description: z.string().optional(),
  imageUrl: z.string().url("Invalid URL").optional().or(z.literal('')),
});

type GoalFormData = z.infer<typeof goalSchema>;

interface SavingsGoal extends GoalFormData {
  id: string;
  currentAmount: number;
  reward?: string;
}

const initialGoals: SavingsGoal[] = [
  { id: 'sg1', goalName: "New Headphones", currentAmount: 75, targetAmount: 150, imageUrl: "https://placekitten.com/300/200?image=3", reward: "Audio Pro!" },
  { id: 'sg2', goalName: "Summer Trip Fund", currentAmount: 200, targetAmount: 500, description: "Saving for a trip with friends.", reward: "Explorer Badge!" },
  { id: 'sg3', goalName: "Learn to Code Course", currentAmount: 25, targetAmount: 100, imageUrl: "https://placekitten.com/300/200?image=4" },
];

const SavingsGoalsManager = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>(initialGoals);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { control, handleSubmit, reset, formState: { errors } } = useForm<GoalFormData>({
    resolver: zodResolver(goalSchema),
    defaultValues: {
      goalName: '',
      targetAmount: 0,
      targetDate: undefined,
      description: '',
      imageUrl: '',
    }
  });

  React.useEffect(() => {
    console.log('SavingsGoalsManager loaded');
  }, []);

  const onSubmitGoal = (data: GoalFormData) => {
    const newGoal: SavingsGoal = {
      ...data,
      id: `sg${Date.now()}`,
      currentAmount: 0, // New goals start with 0
      reward: "New Achiever!" // Example reward
    };
    setGoals(prevGoals => [newGoal, ...prevGoals]);
    reset();
    setIsDialogOpen(false);
    console.log("New goal created:", newGoal);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
       <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">YouthFin Goals</div>
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/youth-dashboard" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/savings-goals-manager" className={navigationMenuTriggerStyle()}>
                    Savings
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-8">
        <section className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-800">Manage Your Savings Goals</h1>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button><PlusCircle className="mr-2 h-5 w-5" /> Create New Goal</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px]">
              <DialogHeader>
                <DialogTitle>Create a New Savings Goal</DialogTitle>
                <DialogDescription>
                  What are you saving up for? Let's make a plan!
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit(onSubmitGoal)} className="space-y-4 py-4">
                <div>
                  <Label htmlFor="goalName">Goal Name</Label>
                  <Controller name="goalName" control={control} render={({ field }) => <Input id="goalName" placeholder="e.g., Concert Tickets" {...field} />} />
                  {errors.goalName && <p className="text-red-500 text-sm">{errors.goalName.message}</p>}
                </div>
                <div>
                  <Label htmlFor="targetAmount">Target Amount ($)</Label>
                  <Controller name="targetAmount" control={control} render={({ field }) => <Input id="targetAmount" type="number" step="0.01" placeholder="e.g., 50" {...field} />} />
                  {errors.targetAmount && <p className="text-red-500 text-sm">{errors.targetAmount.message}</p>}
                </div>
                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Controller name="description" control={control} render={({ field }) => <Input id="description" placeholder="A short note about your goal" {...field} />} />
                </div>
                 <div>
                  <Label htmlFor="imageUrl">Image URL (Optional)</Label>
                  <Controller name="imageUrl" control={control} render={({ field }) => <Input id="imageUrl" placeholder="https://example.com/image.png" {...field} />} />
                  {errors.imageUrl && <p className="text-red-500 text-sm">{errors.imageUrl.message}</p>}
                </div>
                <div>
                  <Label>Target Date (Optional)</Label>
                  <Controller
                    name="targetDate"
                    control={control}
                    render={({ field }) => (
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        className="rounded-md border"
                      />
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">Cancel</Button>
                  </DialogClose>
                  <Button type="submit">Save Goal</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Active Goals</h2>
          {goals.length > 0 ? (
            <ScrollArea className="h-[60vh] pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {goals.map(goal => (
                    <GamifiedSavingsGoalTracker
                    key={goal.id}
                    goalName={goal.goalName}
                    currentAmount={goal.currentAmount}
                    targetAmount={goal.targetAmount || 0}
                    description={goal.description}
                    imageUrl={goal.imageUrl}
                    reward={goal.reward}
                    onCheer={() => alert(`Keep going for ${goal.goalName}!`)}
                    />
                ))}
                </div>
            </ScrollArea>
          ) : (
            <p className="text-gray-500 bg-white p-6 rounded-lg shadow text-center">No active savings goals. Click "Create New Goal" to start one!</p>
          )}
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Learn About Saving</h2>
          <EducationalContentCard
            title="Tips for Reaching Your Savings Goals Faster"
            description="Smart strategies to boost your savings."
            content={
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Set small, achievable milestones.</li>
                <li>Automate your savings if possible.</li>
                <li>Review your progress regularly.</li>
                <li>Find ways to earn a little extra.</li>
              </ul>
            }
            imageUrl="https://placekitten.com/400/200?image=5"
            actionText="Read More Tips"
            onActionClick={() => alert("Showing more saving tips...")}
          />
        </section>
      </main>
       <footer className="text-center p-4 text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} YouthFin Goals. Keep saving!
      </footer>
    </div>
  );
};

export default SavingsGoalsManager;