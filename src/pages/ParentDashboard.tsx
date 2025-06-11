import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// Progress not used directly, GamifiedSavingsGoalTracker uses it.
// import { Progress } from '@/components/ui/progress'; 
// Badge not used directly.
// import { Badge } from '@/components/ui/badge';
import { DollarSign, TrendingUp, ShieldCheck, Settings, UserCircle, AlertTriangle, LayoutDashboard } from 'lucide-react';
import GamifiedSavingsGoalTracker from '@/components/GamifiedSavingsGoalTracker';
import YouthTransactionListItem from '@/components/YouthTransactionListItem';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';

// Mock Data for Parent Dashboard
const childUser = {
  name: "Alex Youth",
  avatarUrl: "https://placekitten.com/100/100",
  balance: 125.50,
  totalSavings: 245.00,
  weeklySpending: 45.75,
  spendingAlerts: [
    { id: 'alert1', message: "High spending in 'Games' category this week.", severity: 'warning' as 'warning' | 'info' },
    { id: 'alert2', message: "Large transaction of $25.00 at 'TechStore'.", severity: 'info' as 'warning' | 'info' },
  ]
};

const childSavingsGoals = [
  { id: 'sg1', goalName: "New Video Game", currentAmount: 30, targetAmount: 60, imageUrl: "https://placekitten.com/300/200?image=1", reward: "Level Up!" },
  { id: 'sg2', goalName: "Summer Camp", currentAmount: 215, targetAmount: 400, imageUrl: "https://placekitten.com/300/200?image=2", reward: "Adventure Awaits!" },
];

const childRecentTransactions = [
  { id: 'ctx1', date: "2024-07-30", description: "TechStore Purchase", amount: -25.00, type: 'debit' as 'credit' | 'debit' | 'transfer', category: "Electronics" },
  { id: 'ctx2', date: "2024-07-29", description: "Weekly Allowance", amount: 15.00, type: 'credit' as 'credit' | 'debit' | 'transfer', category: "Allowance" },
  { id: 'ctx3', date: "2024-07-28", description: "Book for School", amount: -12.50, type: 'debit' as 'credit' | 'debit' | 'transfer', category: "Education" },
];

const ParentDashboard = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log('ParentDashboard loaded');
  }, []);

  const handleNavigateToProfileHub = () => {
    navigate('/profile-and-parental-hub');
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/parent-dashboard" className="text-2xl font-bold text-indigo-600">Parent Dashboard</Link>
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuLink href="/parent-dashboard" className={navigationMenuTriggerStyle({ className: "font-semibold" })}>
                  Overview
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/transaction-history-and-insights" className={navigationMenuTriggerStyle()}>
                  Child's Full Activity
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink href="/profile-and-parental-hub" className={navigationMenuTriggerStyle()}>
                  Settings & Controls
                </NavigationMenuLink>
              </NavigationMenuItem>
                 <NavigationMenuItem>
                  <NavigationMenuLink href="/youth-dashboard" className={navigationMenuTriggerStyle()}>
                    View Child's Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-600">Viewing for: {childUser.name}</span>
            <Avatar>
              <AvatarImage src={childUser.avatarUrl} alt={childUser.name} />
              <AvatarFallback>{childUser.name.split(" ").map(n=>n[0]).join("").toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <section>
          <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">Welcome, Parent!</CardTitle>
              <CardDescription className="text-indigo-200">Here's an overview of {childUser.name.split(" ")[0]}'s financial journey.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-3 gap-4 text-center py-6">
              <div>
                <p className="text-sm text-indigo-100 uppercase tracking-wider">Current Balance</p>
                <p className="text-4xl font-bold mt-1">${childUser.balance.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 uppercase tracking-wider">Total Saved</p>
                <p className="text-4xl font-bold mt-1">${childUser.totalSavings.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-indigo-100 uppercase tracking-wider">This Week's Spending</p>
                <p className="text-4xl font-bold mt-1">${childUser.weeklySpending.toFixed(2)}</p>
              </div>
            </CardContent>
          </Card>
        </section>

        {childUser.spendingAlerts.length > 0 && (
          <section>
             <h2 className="text-xl font-semibold text-gray-700 mb-3">Important Alerts</h2>
            <div className="space-y-3">
            {childUser.spendingAlerts.map(alert => (
              <Card key={alert.id} className={`${alert.severity === 'warning' ? 'border-yellow-500 bg-yellow-50' : 'border-blue-500 bg-blue-50'} shadow-sm`}>
                <CardContent className="p-4 flex items-center">
                  <AlertTriangle className={`mr-3 h-6 w-6 flex-shrink-0 ${alert.severity === 'warning' ? 'text-yellow-600' : 'text-blue-600'}`} />
                  <p className={`text-sm ${alert.severity === 'warning' ? 'text-yellow-800' : 'text-blue-800'}`}>{alert.message}</p>
                </CardContent>
              </Card>
            ))}
            </div>
          </section>
        )}

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Child's Savings Goals</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/savings-goals-manager')}>View All Goals <TrendingUp className="ml-2 h-4 w-4" /></Button>
          </div>
          {childSavingsGoals.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childSavingsGoals.map(goal => (
                <GamifiedSavingsGoalTracker
                  key={goal.id}
                  goalName={goal.goalName}
                  currentAmount={goal.currentAmount}
                  targetAmount={goal.targetAmount}
                  imageUrl={goal.imageUrl}
                  reward={goal.reward}
                />
              ))}
            </div>
          ) : (
            <Card className="text-center p-6 bg-white shadow">
                <CardTitle className="text-lg text-gray-600">No Savings Goals Yet</CardTitle>
                <CardDescription className="mt-2"> {childUser.name.split(" ")[0]} hasn't set any savings goals.</CardDescription>
            </Card>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-700">Recent Transactions</h2>
            <Button variant="link" size="sm" onClick={() => navigate('/transaction-history-and-insights')}>View Full History</Button>
          </div>
          <Card className="bg-white shadow">
            <CardContent className="p-0">
              {childRecentTransactions.length > 0 ? (
                <div className="divide-y divide-gray-200">
                {childRecentTransactions.map(tx => (
                  <YouthTransactionListItem
                    key={tx.id}
                    id={tx.id}
                    date={tx.date}
                    description={tx.description}
                    amount={tx.amount}
                    type={tx.type}
                    category={tx.category}
                    // onClick for parent could navigate to detailed view or be disabled
                  />
                ))}
                </div>
              ) : (
                 <p className="p-6 text-center text-gray-500">No recent transactions for {childUser.name.split(" ")[0]}.</p>
              )}
            </CardContent>
          </Card>
        </section>

        <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-3">Quick Access to Controls</h2>
            <Card className="bg-white shadow">
                <CardContent className="p-6 grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <Button variant="default" className="w-full h-auto justify-start text-left py-4 px-4 flex items-center space-x-3 shadow-sm hover:bg-indigo-700 bg-indigo-600" onClick={handleNavigateToProfileHub}>
                        <Settings className="h-6 w-6 flex-shrink-0" />
                        <div>
                            <p className="font-semibold">Manage Spending Rules</p>
                            <p className="text-xs opacity-90">Set limits, allowances & more.</p>
                        </div>
                    </Button>
                     <Button variant="outline" className="w-full h-auto justify-start text-left py-4 px-4 flex items-center space-x-3 shadow-sm" onClick={handleNavigateToProfileHub}>
                        <ShieldCheck className="h-6 w-6 flex-shrink-0 text-indigo-600" />
                        <div>
                            <p className="font-semibold">Parental Controls</p>
                            <p className="text-xs text-gray-600">Adjust feature access.</p>
                        </div>
                    </Button>
                    <Button variant="outline" className="w-full h-auto justify-start text-left py-4 px-4 flex items-center space-x-3 shadow-sm" onClick={handleNavigateToProfileHub}>
                        <UserCircle className="h-6 w-6 flex-shrink-0 text-indigo-600" />
                        <div>
                            <p className="font-semibold">Account Settings</p>
                            <p className="text-xs text-gray-600">Manage profiles and security.</p>
                        </div>
                    </Button>
                </CardContent>
            </Card>
        </section>
      </main>

      <footer className="text-center p-6 text-sm text-gray-600 border-t bg-white">
        © {new Date().getFullYear()} YouthFin Parent Portal. Empowering responsible finance.
      </footer>
    </div>
  );
};

export default ParentDashboard;