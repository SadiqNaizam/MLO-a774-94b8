import React from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import GamifiedSavingsGoalTracker from '@/components/GamifiedSavingsGoalTracker';
import YouthTransactionListItem from '@/components/YouthTransactionListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DollarSign, TrendingUp, BookOpen, Settings, LogOut } from 'lucide-react'; // Example icons

// Placeholder data
const user = {
  name: "Alex Youth",
  avatarUrl: "https://placekitten.com/100/100",
  balance: 125.50,
};

const savingsGoals = [
  { id: 1, goalName: "New Video Game", currentAmount: 30, targetAmount: 60, imageUrl: "https://placekitten.com/300/200?image=1", reward: "Level Up!" },
  { id: 2, goalName: "Birthday Gift for Mom", currentAmount: 15, targetAmount: 25, imageUrl: "https://placekitten.com/300/200?image=2" },
];

const recentTransactions = [
  { id: 't1', date: "2024-07-28", description: "Pocket Money In", amount: 20.00, type: 'credit' as 'credit' | 'debit' | 'transfer', category: "Allowance" },
  { id: 't2', date: "2024-07-27", description: "Corner Shop Sweets", amount: -2.50, type: 'debit' as 'credit' | 'debit' | 'transfer', category: "Snacks" },
  { id: 't3', date: "2024-07-25", description: "Online Game Top-up", amount: -10.00, type: 'debit' as 'credit' | 'debit' | 'transfer', category: "Gaming" },
];

const YouthDashboard = () => {
  React.useEffect(() => {
    console.log('YouthDashboard loaded');
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">YouthFin</div>
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
                <NavigationMenuItem>
                  <NavigationMenuLink href="/transaction-history-and-insights" className={navigationMenuTriggerStyle()}>
                    Transactions
                  </NavigationMenuLink>
                </NavigationMenuItem>
                 <NavigationMenuItem>
                  <NavigationMenuLink href="/profile-and-parental-hub" className={navigationMenuTriggerStyle()}>
                    Profile
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
             <Avatar>
                <AvatarImage src={user.avatarUrl} alt={user.name} />
                <AvatarFallback>{user.name.split(" ").map(n=>n[0]).join("")}</AvatarFallback>
            </Avatar>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <section>
          <Card className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
            <CardHeader>
              <CardTitle>Welcome back, {user.name.split(" ")[0]}!</CardTitle>
              <CardDescription className="text-blue-200">Here's your financial snapshot.</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-100">Current Balance</p>
                <p className="text-4xl font-bold">${user.balance.toFixed(2)}</p>
              </div>
              <DollarSign className="h-12 w-12 text-blue-300" />
            </CardContent>
          </Card>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Your Savings Goals</h2>
            <Button variant="outline" size="sm" onClick={() => window.location.href='/savings-goals-manager'}>Manage Goals <TrendingUp className="ml-2 h-4 w-4" /></Button>
          </div>
          {savingsGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {savingsGoals.map(goal => (
                <GamifiedSavingsGoalTracker
                  key={goal.id}
                  goalName={goal.goalName}
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                  imageUrl={goal.imageUrl}
                  reward={goal.reward}
                  onCheer={() => alert(`Cheering for ${goal.goalName}!`)}
                />
              ))}
            </div>
          ) : (
            <p className="text-gray-500">You haven't set any savings goals yet. Start one today!</p>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold text-gray-700">Recent Transactions</h2>
            <Button variant="link" size="sm" onClick={() => window.location.href='/transaction-history-and-insights'}>View All</Button>
          </div>
          <Card>
            <CardContent className="p-0">
              <ScrollArea className="h-[250px]">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map(tx => (
                    <YouthTransactionListItem
                      key={tx.id}
                      id={tx.id}
                      date={tx.date}
                      description={tx.description}
                      amount={tx.amount}
                      type={tx.type}
                      category={tx.category}
                      onClick={(id) => alert(`Clicked transaction ${id}`)}
                    />
                  ))
                ) : (
                  <p className="p-4 text-gray-500">No recent transactions.</p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </section>
        
        <section>
          <h2 className="text-2xl font-semibold text-gray-700 mb-4">Quick Tips & Learning</h2>
          <Card className="bg-yellow-50 border-yellow-300">
            <CardHeader>
              <CardTitle className="text-yellow-800 flex items-center"><BookOpen className="mr-2 h-5 w-5" />Smart Spending Tip</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-yellow-700">Did you know? Tracking small expenses can help you save big over time! Try categorizing your spending for a week.</p>
            </CardContent>
            <CardFooter>
              <Button variant="link" className="text-yellow-800 p-0">Learn More</Button>
            </CardFooter>
          </Card>
        </section>
      </main>

      <footer className="text-center p-4 text-sm text-gray-500 border-t">
        © {new Date().getFullYear()} YouthFin. All rights reserved.
      </footer>
    </div>
  );
};

export default YouthDashboard;