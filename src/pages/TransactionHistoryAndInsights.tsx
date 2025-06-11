import React, { useState, useMemo } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import YouthTransactionListItem from '@/components/YouthTransactionListItem';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'; // Bar for spending, Pie for category breakdown
import EducationalContentCard from '@/components/EducationalContentCard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';

type TransactionType = 'credit' | 'debit' | 'transfer';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: TransactionType;
  category: string;
}

const initialTransactions: Transaction[] = [
  { id: 'tx1', date: "2024-07-28", description: "Pocket Money", amount: 20.00, type: 'credit', category: "Allowance" },
  { id: 'tx2', date: "2024-07-27", description: "Cafe Treats", amount: -5.50, type: 'debit', category: "Food" },
  { id: 'tx3', date: "2024-07-26", description: "Book Store", amount: -12.00, type: 'debit', category: "Education" },
  { id: 'tx4', date: "2024-07-25", description: "Online Game Credit", amount: -10.00, type: 'debit', category: "Entertainment" },
  { id: 'tx5', date: "2024-07-24", description: "Birthday Money from Gran", amount: 50.00, type: 'credit', category: "Gifts" },
  { id: 'tx6', date: "2024-07-23", description: "Cinema Ticket", amount: -8.00, type: 'debit', category: "Entertainment" },
  { id: 'tx7', date: "2024-07-20", description: "Savings Transfer", amount: -10.00, type: 'transfer', category: "Savings" },
];

const chartConfig = {
  spending: { label: "Spending", color: "hsl(var(--chart-1))" },
  income: { label: "Income", color: "hsl(var(--chart-2))" },
};
const PIE_COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82Ca9D"];


const TransactionHistoryAndInsights = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all'); // 'all', 'credit', 'debit'
  const [filterCategory, setFilterCategory] = useState<string>('all');

  React.useEffect(() => {
    console.log('TransactionHistoryAndInsights loaded');
  }, []);

  const categories = useMemo(() => ['all', ...new Set(initialTransactions.map(tx => tx.category))], []);

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter(tx => {
      const matchesSearch = tx.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'all' || tx.type === filterType;
      const matchesCategory = filterCategory === 'all' || tx.category === filterCategory;
      return matchesSearch && matchesType && matchesCategory;
    });
  }, [searchTerm, filterType, filterCategory]);

  const spendingByCategory = useMemo(() => {
    const spending: { [key: string]: number } = {};
    filteredTransactions.filter(tx => tx.type === 'debit').forEach(tx => {
      spending[tx.category] = (spending[tx.category] || 0) + Math.abs(tx.amount);
    });
    return Object.entries(spending).map(([name, value]) => ({ name, value }));
  }, [filteredTransactions]);

  const monthlySpendingData = useMemo(() => { // Simplified for example
    return [
      { month: "May", spending: 50 },
      { month: "June", spending: 75 },
      { month: "July", spending: filteredTransactions.filter(tx => tx.type === 'debit').reduce((sum, tx) => sum + Math.abs(tx.amount),0) },
    ];
  }, [filteredTransactions]);


  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">YouthFin Transactions</div>
             <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/youth-dashboard" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/transaction-history-and-insights" className={navigationMenuTriggerStyle()}>
                    Transactions
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Transaction History & Insights</h1>

        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 mb-4">
            <TabsTrigger value="history">Transaction List</TabsTrigger>
            <TabsTrigger value="spendingChart">Spending Chart</TabsTrigger>
            <TabsTrigger value="categoryPie">Category Breakdown</TabsTrigger>
            <TabsTrigger value="tips">Financial Tips</TabsTrigger>
          </TabsList>

          <TabsContent value="history">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    type="text"
                    placeholder="Search transactions..."
                    className="pl-10"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Select value={filterType} onValueChange={setFilterType}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4 inline-block" />Type: <SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Types</SelectItem>
                    <SelectItem value="credit">Credit</SelectItem>
                    <SelectItem value="debit">Debit</SelectItem>
                    <SelectItem value="transfer">Transfer</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger><Filter className="mr-2 h-4 w-4 inline-block" />Category: <SelectValue /></SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => <SelectItem key={cat} value={cat}>{cat === 'all' ? 'All Categories' : cat}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <ScrollArea className="h-[400px] border rounded-md">
                {filteredTransactions.length > 0 ? (
                  filteredTransactions.map(tx => (
                    <YouthTransactionListItem
                      key={tx.id}
                      id={tx.id}
                      date={tx.date}
                      description={tx.description}
                      amount={tx.amount}
                      type={tx.type}
                      category={tx.category}
                      onClick={(id) => alert(`Transaction ${id} details.`)}
                    />
                  ))
                ) : (
                  <p className="p-4 text-center text-gray-500">No transactions match your filters.</p>
                )}
              </ScrollArea>
               <div className="mt-4 flex flex-wrap gap-2">
                    <Badge variant="outline">Total Transactions: {filteredTransactions.length}</Badge>
                    <Badge variant={filteredTransactions.filter(tx => tx.type === 'credit').reduce((s, tx) => s + tx.amount, 0) >= 0 ? "default" : "destructive"}>
                        Net Change: ${filteredTransactions.reduce((s, tx) => s + tx.amount, 0).toFixed(2)}
                    </Badge>
                </div>
            </div>
          </TabsContent>

          <TabsContent value="spendingChart">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Monthly Spending Overview</h2>
              <ChartContainer config={chartConfig} className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlySpendingData} margin={{ top: 20, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false}/>
                    <XAxis dataKey="month" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <ChartLegend content={<ChartLegendContent />} />
                    <Bar dataKey="spending" fill="var(--color-spending)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </TabsContent>
          
          <TabsContent value="categoryPie">
            <div className="bg-white p-4 sm:p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">Spending by Category</h2>
              {spendingByCategory.length > 0 ? (
                <ChartContainer config={{}} className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                        data={spendingByCategory}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        >
                        {spendingByCategory.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent nameKey="name" />} />
                        <ChartLegend content={<ChartLegendContent nameKey="name"/>} />
                    </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
              ) : <p className="text-center text-gray-500">No spending data to display for selected filters.</p>}
            </div>
          </TabsContent>

          <TabsContent value="tips">
            <div className="bg-white p-6 rounded-lg shadow grid md:grid-cols-2 gap-4">
              <EducationalContentCard
                title="Understanding Your Spending"
                content="Look at your spending categories. Are there any surprises? Identifying where your money goes is the first step to smart budgeting."
                imageUrl="https://placekitten.com/300/150?image=6"
                actionText="Learn Budgeting Basics"
                onActionClick={() => alert("Redirecting to budgeting basics...")}
              />
              <EducationalContentCard
                title="Needs vs. Wants"
                content="Differentiating between needs (like bus fare for school) and wants (like the latest game) can help you prioritize spending and save more effectively."
                imageUrl="https://placekitten.com/300/150?image=7"
                actionText="Explore Needs vs. Wants"
                onActionClick={() => alert("Exploring needs vs. wants...")}
              />
            </div>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} YouthFin Insights. Knowledge is power!
      </footer>
    </div>
  );
};

export default TransactionHistoryAndInsights;