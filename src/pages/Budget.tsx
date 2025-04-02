
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Progress } from '@/components/ui/progress';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Plus, MoreVertical, Edit, Trash2 } from 'lucide-react';
import { Budget, CATEGORIES, budgetService } from '@/services/financeService';
import { Skeleton } from '@/components/ui/skeleton';

const Budgets = () => {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewBudgetOpen, setIsNewBudgetOpen] = useState(false);
  const [isEditBudgetOpen, setIsEditBudgetOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    category: '',
    amount: '',
    period: 'monthly' as 'monthly' | 'weekly' | 'yearly',
  });
  
  useEffect(() => {
    fetchBudgets();
  }, []);
  
  const fetchBudgets = async () => {
    setLoading(true);
    try {
      await budgetService.updateSpending();
      const data = await budgetService.getAll();
      setBudgets(data);
    } catch (error) {
      console.error('Error fetching budgets:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      category: '',
      amount: '',
      period: 'monthly',
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const budgetData = {
        category: formData.category,
        amount: parseFloat(formData.amount),
        period: formData.period,
      };
      
      if (currentBudget && isEditBudgetOpen) {
        await budgetService.update({ 
          ...budgetData, 
          id: currentBudget.id,
          spent: currentBudget.spent,
        });
        setIsEditBudgetOpen(false);
      } else {
        await budgetService.add(budgetData);
        setIsNewBudgetOpen(false);
      }
      
      resetForm();
      fetchBudgets();
    } catch (error) {
      console.error('Error saving budget:', error);
    }
  };
  
  const handleEdit = (budget: Budget) => {
    setCurrentBudget(budget);
    setFormData({
      category: budget.category,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setIsEditBudgetOpen(true);
  };
  
  const handleDelete = async () => {
    if (currentBudget) {
      try {
        await budgetService.delete(currentBudget.id);
        fetchBudgets();
        setIsDeleteDialogOpen(false);
      } catch (error) {
        console.error('Error deleting budget:', error);
      }
    }
  };
  
  const confirmDelete = (budget: Budget) => {
    setCurrentBudget(budget);
    setIsDeleteDialogOpen(true);
  };
  
  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };
  
  // Calculate budget progress percentage and status
  const getBudgetStatus = (budget: Budget) => {
    const percentage = (budget.spent / budget.amount) * 100;
    let status = 'bg-primary';
    
    if (percentage > 90) {
      status = 'bg-negative';
    } else if (percentage > 70) {
      status = 'bg-amber-500';
    }
    
    return {
      percentage: Math.min(percentage, 100),
      status,
    };
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mt-4">
        <h1 className="text-3xl font-bold">Budgets</h1>
        <Button onClick={() => {
          resetForm();
          setIsNewBudgetOpen(true);
        }}>
          <Plus className="h-4 w-4 mr-2" /> Add Budget
        </Button>
      </div>
      
      {/* Budgets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          // Skeleton loaders
          Array(6).fill(null).map((_, i) => (
            <Card key={i} className="card-shadow">
              <CardHeader>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-3 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-8 w-full" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-5 w-28" />
              </CardFooter>
            </Card>
          ))
        ) : budgets.length > 0 ? (
          budgets.map(budget => {
            const { percentage, status } = getBudgetStatus(budget);
            return (
              <Card key={budget.id} className="card-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle>{budget.category}</CardTitle>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleEdit(budget)}>
                          <Edit className="h-4 w-4 mr-2" /> Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="text-destructive focus:text-destructive" 
                          onClick={() => confirmDelete(budget)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  <CardDescription>{budget.period} budget</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">
                        {formatCurrency(budget.spent)} of {formatCurrency(budget.amount)}
                      </span>
                      <span className="text-sm font-medium">
                        {Math.round(percentage)}%
                      </span>
                    </div>
                    <Progress value={percentage} className={status} />
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="text-sm text-muted-foreground">
                    {budget.spent > budget.amount ? (
                      <span className="text-negative">
                        {formatCurrency(budget.spent - budget.amount)} over budget
                      </span>
                    ) : (
                      <span className="text-positive">
                        {formatCurrency(budget.amount - budget.spent)} remaining
                      </span>
                    )}
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground mb-4">No budgets found</p>
            <Button 
              onClick={() => {
                resetForm();
                setIsNewBudgetOpen(true);
              }}
            >
              Create your first budget
            </Button>
          </div>
        )}
      </div>
      
      {/* Add Budget Dialog */}
      <Dialog open={isNewBudgetOpen} onOpenChange={setIsNewBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Budget</DialogTitle>
            <DialogDescription>
              Create a new budget to track your expenses
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.EXPENSE.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="amount">Budget Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={value => handleSelectChange('period', value as 'monthly' | 'weekly' | 'yearly')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsNewBudgetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Budget Dialog */}
      <Dialog open={isEditBudgetOpen} onOpenChange={setIsEditBudgetOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Budget</DialogTitle>
            <DialogDescription>
              Update your budget settings
            </DialogDescription>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="edit-category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={value => handleSelectChange('category', value)}
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.EXPENSE.map(category => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-amount">Budget Amount</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                  <Input
                    id="edit-amount"
                    name="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={handleInputChange}
                    className="pl-8"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="edit-period">Period</Label>
                <Select
                  value={formData.period}
                  onValueChange={value => handleSelectChange('period', value as 'monthly' | 'weekly' | 'yearly')}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly</SelectItem>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setIsEditBudgetOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Update</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the budget.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default Budgets;
