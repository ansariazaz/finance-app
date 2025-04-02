
import { useEffect, useState } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from 'recharts';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { transactionService, budgetService, Transaction } from '@/services/financeService';
import { ArrowUp, ArrowDown, DollarSign, Wallet, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { useNavigate } from 'react-router-dom';

// Format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'];

const Dashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{
    totalIncome: number;
    totalExpenses: number;
    netIncome: number;
    expenseByCategory: Record<string, number>;
    recentTransactions: Transaction[];
  }>({
    totalIncome: 0,
    totalExpenses: 0,
    netIncome: 0,
    expenseByCategory: {},
    recentTransactions: [],
  });
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await budgetService.updateSpending();
        const summaryData = await transactionService.getSummary();
        console.log(summaryData,"summaryData")
        setSummary(summaryData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  // Prepare chart data
  const expenseData = Object.entries(summary.expenseByCategory).map(([name, value]) => ({
    name,
    value,
  }));
  
  // Income vs Expenses data for bar chart
  const overviewData = [
    { name: 'Income', value: summary.totalIncome },
    { name: 'Expenses', value: summary.totalExpenses },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
      </div>
      
      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center">
                <ArrowUp className="mr-2 h-4 w-4 text-positive" />
                <span className="text-2xl font-bold">
                  {formatCurrency(summary.totalIncome)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Expenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center">
                <ArrowDown className="mr-2 h-4 w-4 text-negative" />
                <span className="text-2xl font-bold">
                  {formatCurrency(summary.totalExpenses)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Net Income
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <Skeleton className="h-8 w-28" />
            ) : (
              <div className="flex items-center">
                <Wallet className="mr-2 h-4 w-4 text-primary" />
                <span className={`text-2xl font-bold ${summary.netIncome >= 0 ? 'text-positive' : 'text-negative'}`}>
                  {formatCurrency(summary.netIncome)}
                </span>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Income vs Expenses</CardTitle>
            <CardDescription>Monthly overview</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={overviewData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis
                    tickFormatter={(value) => 
                      new Intl.NumberFormat('en-US', {
                        notation: 'compact',
                        compactDisplay: 'short',
                      }).format(value)
                    }
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value as number), '']} 
                    labelFormatter={(label) => `${label}`}
                  />
                  <Bar dataKey="value">
                    {overviewData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={index === 0 ? '#10B981' : '#EF4444'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
        
        <Card className="card-shadow">
          <CardHeader>
            <CardTitle>Expenses by Category</CardTitle>
            <CardDescription>Where your money goes</CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <Skeleton className="h-full w-full" />
              </div>
            ) : expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={(entry) => entry.name}
                  >
                    {expenseData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [formatCurrency(value as number), 'Amount']} />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                <DollarSign className="h-10 w-10 mb-2" />
                <p>No expense data available</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Recent Transactions */}
      <Card className="card-shadow">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Your latest financial activity</CardDescription>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/transactions')}
            >
              View All
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              {Array(5).fill(null).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-2">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-4 w-20" />
                </div>
              ))}
            </div>
          ) : summary.recentTransactions.length > 0 ? (
            <div className="space-y-2">
              {summary.recentTransactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-full ${
                      transaction.type === 'income' ? 'bg-positive/10' : 'bg-negative/10'
                    }`}>
                      {transaction.type === 'income' ? (
                        <TrendingUp className={`h-4 w-4 text-positive`} />
                      ) : (
                        <ArrowDown className={`h-4 w-4 text-negative`} />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {transaction.category} • {new Date(transaction.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <p className={`font-medium ${
                    transaction.type === 'income' ? 'text-positive' : 'text-negative'
                  }`}>
                    {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
              <DollarSign className="h-10 w-10 mb-2" />
              <p>No transactions found</p>
              <Button 
                variant="link" 
                onClick={() => navigate('/transactions')}
                className="mt-2"
              >
                Add your first transaction
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
