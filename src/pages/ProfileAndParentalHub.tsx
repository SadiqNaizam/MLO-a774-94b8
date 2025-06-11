import React, { useState } from 'react';
import { NavigationMenu, NavigationMenuList, NavigationMenuItem, NavigationMenuLink, navigationMenuTriggerStyle } from '@/components/ui/navigation-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ParentalControlToggle from '@/components/ParentalControlToggle';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { User, Shield, Bell, Settings, LogOut, HelpCircle } from 'lucide-react';

const youthProfileSchema = z.object({
  fullName: z.string().min(2, "Name is too short"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  theme: z.enum(["light", "dark", "system"]).default("system"),
});

const parentSettingsSchema = z.object({
    allowanceAmount: z.coerce.number().min(0, "Allowance must be non-negative").default(0),
    spendingLimit: z.coerce.number().min(0, "Limit must be non-negative").default(50),
});

type YouthProfileData = z.infer<typeof youthProfileSchema>;
type ParentSettingsData = z.infer<typeof parentSettingsSchema>;

const ProfileAndParentalHub = () => {
  const [isParentView, setIsParentView] = useState(false); // Toggle between youth and parent view

  const { control: youthControl, handleSubmit: handleYouthSubmit, formState: { errors: youthErrors }, reset: resetYouthForm } = useForm<YouthProfileData>({
    resolver: zodResolver(youthProfileSchema),
    defaultValues: { fullName: "Alex Youth", email: "alex.youth@example.com", phone: "", theme: "light" }
  });

  const { control: parentControl, handleSubmit: handleParentSubmit, formState: { errors: parentErrors }, reset: resetParentForm, watch: watchParent } = useForm<ParentSettingsData>({
    resolver: zodResolver(parentSettingsSchema),
    defaultValues: { allowanceAmount: 10, spendingLimit: 50 }
  });
  
  const currentSpendingLimit = watchParent("spendingLimit");

  React.useEffect(() => {
    console.log('ProfileAndParentalHub loaded');
  }, []);

  const onYouthSubmit = (data: YouthProfileData) => {
    console.log("Youth profile updated:", data);
    alert("Profile updated successfully!");
  };

  const onParentSubmit = (data: ParentSettingsData) => {
    console.log("Parent settings updated:", data);
    alert("Parental settings saved!");
  };

  const [controls, setControls] = useState([
    { id: 'onlinePurchases', label: "Online Purchases", description: "Allow or block online spending.", isChecked: true },
    { id: 'atmWithdrawal', label: "ATM Withdrawals", description: "Enable or disable cash withdrawals.", isChecked: false },
    { id: 'specificMerchants', label: "Specific Merchant Blocks", description: "Block spending at certain stores (coming soon).", isChecked: false, disabled: true },
  ]);

  const handleToggleControl = (id: string, isChecked: boolean) => {
    setControls(prev => prev.map(c => c.id === id ? { ...c, isChecked } : c));
    console.log(`Control ${id} toggled to ${isChecked}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
            <div className="text-2xl font-bold text-blue-600">YouthFin Hub</div>
            <NavigationMenu>
              <NavigationMenuList>
                 <NavigationMenuItem>
                  <NavigationMenuLink href="/youth-dashboard" className={navigationMenuTriggerStyle()}>
                    Dashboard
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink href="/profile-and-parental-hub" className={navigationMenuTriggerStyle()}>
                    Profile & Hub
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
             <div className="flex items-center space-x-2">
                <Label htmlFor="view-toggle" className="text-sm">Parent View</Label>
                <Switch id="view-toggle" checked={isParentView} onCheckedChange={setIsParentView} />
            </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto p-4 md:p-6">
        <Tabs defaultValue={isParentView ? "parentControls" : "youthProfile"} className="w-full" value={isParentView ? "parentControls" : "youthProfile"}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="youthProfile" onClick={() => setIsParentView(false)}>My Profile (Youth)</TabsTrigger>
            <TabsTrigger value="parentControls" onClick={() => setIsParentView(true)}>Parental Hub</TabsTrigger>
          </TabsList>

          {/* Youth Profile Content */}
          <TabsContent value="youthProfile">
            <Card>
              <CardHeader>
                <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placekitten.com/100/100" alt="Alex Youth" />
                        <AvatarFallback>AY</AvatarFallback>
                    </Avatar>
                    <div>
                        <CardTitle className="text-2xl">Alex Youth's Profile</CardTitle>
                        <CardDescription>Manage your personal details and app preferences.</CardDescription>
                    </div>
                </div>
              </CardHeader>
              <form onSubmit={handleYouthSubmit(onYouthSubmit)}>
                <CardContent className="space-y-6">
                  <div>
                    <Label htmlFor="fullName">Full Name</Label>
                    <Controller name="fullName" control={youthControl} render={({ field }) => <Input id="fullName" {...field} />} />
                    {youthErrors.fullName && <p className="text-red-500 text-sm">{youthErrors.fullName.message}</p>}
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Controller name="email" control={youthControl} render={({ field }) => <Input id="email" type="email" {...field} />} />
                    {youthErrors.email && <p className="text-red-500 text-sm">{youthErrors.email.message}</p>}
                  </div>
                   <div>
                    <Label htmlFor="phone">Phone Number (Optional)</Label>
                    <Controller name="phone" control={youthControl} render={({ field }) => <Input id="phone" type="tel" {...field} />} />
                  </div>

                  <div className="space-y-2">
                    <Label>App Theme</Label>
                    <Controller
                        name="theme"
                        control={youthControl}
                        render={({ field }) => (
                            <select {...field} className="w-full p-2 border rounded-md">
                                <option value="light">Light</option>
                                <option value="dark">Dark</option>
                                <option value="system">System Default</option>
                            </select>
                        )}
                    />
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger><Settings className="mr-2 h-4 w-4" />Advanced Settings</AccordionTrigger>
                      <AccordionContent className="space-y-4">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="notifications">Enable Push Notifications</Label>
                          <Switch id="notifications" defaultChecked />
                        </div>
                         <Button variant="outline" size="sm">Change Password</Button>
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger><HelpCircle className="mr-2 h-4 w-4" />Help & Support</AccordionTrigger>
                      <AccordionContent>
                        <p>Need help? Visit our FAQ or contact support.</p>
                        <Button variant="link" className="p-0">Go to FAQ</Button>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                </CardContent>
                <CardFooter className="flex justify-between">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive">Close Account</Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your account and remove your data from our servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => alert("Account closure initiated.")}>Continue</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                  <Button type="submit">Save Changes</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          {/* Parental Hub Content */}
          <TabsContent value="parentControls">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center"><Shield className="mr-2 h-6 w-6 text-blue-600" />Parental Controls for Alex Youth</CardTitle>
                <CardDescription>Manage your child's account settings, limits, and allowances.</CardDescription>
              </CardHeader>
              <form onSubmit={handleParentSubmit(onParentSubmit)}>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="allowanceAmount">Weekly Allowance Amount ($)</Label>
                    <Controller name="allowanceAmount" control={parentControl} render={({ field }) => <Input id="allowanceAmount" type="number" step="1" {...field} />} />
                    {parentErrors.allowanceAmount && <p className="text-red-500 text-sm">{parentErrors.allowanceAmount.message}</p>}
                    <Button type="button" variant="outline" size="sm">Setup Automatic Allowance</Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="spendingLimit">Per-Transaction Spending Limit ($)</Label>
                    <Controller
                        name="spendingLimit"
                        control={parentControl}
                        defaultValue={[50]}
                        render={({ field }) => (
                            <Slider
                                id="spendingLimit"
                                min={0} max={200} step={5}
                                defaultValue={field.value ? [field.value] : [50]}
                                onValueChange={(value) => field.onChange(value[0])}
                            />
                        )}
                    />
                    <p className="text-sm text-gray-600">Current limit: ${currentSpendingLimit?.toFixed(2) || '50.00'}</p>
                    {parentErrors.spendingLimit && <p className="text-red-500 text-sm">{parentErrors.spendingLimit.message}</p>}
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-lg">Spending Controls</h3>
                    {controls.map(control => (
                      <ParentalControlToggle
                        key={control.id}
                        id={control.id}
                        label={control.label}
                        description={control.description}
                        isChecked={control.isChecked}
                        onToggle={(isChecked) => handleToggleControl(control.id, isChecked)}
                        disabled={control.disabled}
                      />
                    ))}
                  </div>
                  
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="parent-notifications">
                      <AccordionTrigger><Bell className="mr-2 h-4 w-4" />Notification Preferences (Parent)</AccordionTrigger>
                      <AccordionContent className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="largeTransactionAlerts">Alert for large transactions</Label>
                          <Switch id="largeTransactionAlerts" defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="lowBalanceAlerts">Alert for low balance</Label>
                          <Switch id="lowBalanceAlerts" />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className="w-full">Save Parental Settings</Button>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
      <footer className="text-center p-4 text-sm text-gray-500 border-t bg-white">
        © {new Date().getFullYear()} YouthFin Hub. Manage wisely.
      </footer>
    </div>
  );
};

export default ProfileAndParentalHub;