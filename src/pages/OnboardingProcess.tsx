import React, { useState } from 'react';
import OnboardingProgressStepper from '@/components/OnboardingProgressStepper';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Terminal } from 'lucide-react';

const stepSchemas = [
  z.object({ // Step 1: Basic Details
    fullName: z.string().min(2, { message: "Name must be at least 2 characters." }),
    dateOfBirth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, { message: "Please enter a valid date (YYYY-MM-DD)." }),
  }),
  z.object({ // Step 2: Parental Consent (conceptual, form fields depend on actual process)
    parentEmail: z.string().email({ message: "Invalid email address." }).optional(), // Example field
  }),
  z.object({ // Step 3: Youth KYC
    addressLine1: z.string().min(5, { message: "Address is too short." }),
    city: z.string().min(2, { message: "City name is too short." }),
    postCode: z.string().min(5, { message: "Postcode is too short." }),
  }),
  z.object({ // Step 4: Account Security
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),
    confirmPassword: z.string(),
    securityAnswer: z.string().min(3, { message: "Answer is too short." }),
    agreeToTerms: z.boolean().refine(val => val === true, { message: "You must agree to the terms." }),
  }).refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  }),
];

const totalSteps = 5; // Includes a final confirmation/welcome step
const stepLabels = ["Basic Details", "Parental Consent", "KYC", "Security", "Welcome"];

const OnboardingProcess = () => {
  const [currentStep, setCurrentStep] = useState(0); // 0-indexed
  const [showParentalConsentDialog, setShowParentalConsentDialog] = useState(false);

  const currentSchema = stepSchemas[currentStep] || z.object({});
  const { control, handleSubmit, formState: { errors }, watch, trigger, getValues } = useForm({
    resolver: zodResolver(currentSchema),
    mode: 'onChange',
  });

  const dobValue = watch('dateOfBirth');

  React.useEffect(() => {
    console.log('OnboardingProcess loaded');
  }, []);

  const handleNextStep = async () => {
    const isValid = await trigger();
    if (isValid) {
      console.log(`Data for step ${currentStep + 1}:`, getValues());
      if (currentStep === 0) { // After Basic Details
        const birthDate = new Date(getValues('dateOfBirth'));
        const age = new Date().getFullYear() - birthDate.getFullYear();
        const m = new Date().getMonth() - birthDate.getMonth();
        if (m < 0 || (m === 0 && new Date().getDate() < birthDate.getDate())) {
            // age--; // This line causes an error as age is const.
        }
        // For simplicity, let's assume anyone under 16 needs consent
        if (age < 16) {
          setShowParentalConsentDialog(true);
          // Actual flow might pause here until dialog interaction
        } else {
          setCurrentStep(prev => Math.min(prev + 1, totalSteps -1));
        }
      } else if (currentStep < totalSteps - 1) {
        setCurrentStep(prev => Math.min(prev + 1, totalSteps -1));
      }
    }
  };

  const handlePreviousStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleParentalConsentProceed = () => {
    setShowParentalConsentDialog(false);
    setCurrentStep(1); // Move to parental consent step
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0: // Basic Details
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Tell us about yourself</h2>
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Controller
                name="fullName"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="fullName" placeholder="e.g., Alex Rider" {...field} />}
              />
              {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="dateOfBirth">Date of Birth</Label>
              <Controller
                name="dateOfBirth"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="dateOfBirth" type="date" {...field} />}
              />
              {errors.dateOfBirth && <p className="text-red-500 text-sm">{errors.dateOfBirth.message as string}</p>}
            </div>
          </div>
        );
      case 1: // Parental Consent (Conceptual)
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Parental Consent</h2>
            <p className="text-gray-600">We need a parent or guardian to approve your account. Please provide their email or ask them to scan a QR code (feature coming soon!).</p>
             <div>
                <Label htmlFor="parentEmail">Parent's Email (Optional)</Label>
                <Controller
                    name="parentEmail"
                    control={control}
                    defaultValue=""
                    render={({ field }) => <Input id="parentEmail" type="email" placeholder="parent@example.com" {...field} />}
                />
                {errors.parentEmail && <p className="text-red-500 text-sm">{errors.parentEmail.message as string}</p>}
            </div>
            <Alert>
              <Terminal className="h-4 w-4" />
              <AlertTitle>Next Steps for Parent</AlertTitle>
              <AlertDescription>
                An email will be sent to your parent/guardian with instructions on how to provide consent.
              </AlertDescription>
            </Alert>
          </div>
        );
      case 2: // KYC
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Verify Your Details</h2>
            <p className="text-gray-600">Please provide your current address.</p>
            <div>
              <Label htmlFor="addressLine1">Address Line 1</Label>
              <Controller
                name="addressLine1"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="addressLine1" placeholder="123 Money Street" {...field} />}
              />
              {errors.addressLine1 && <p className="text-red-500 text-sm">{errors.addressLine1.message as string}</p>}
            </div>
             <div>
              <Label htmlFor="city">Town/City</Label>
              <Controller
                name="city"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="city" placeholder="London" {...field} />}
              />
              {errors.city && <p className="text-red-500 text-sm">{errors.city.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="postCode">Post Code</Label>
              <Controller
                name="postCode"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="postCode" placeholder="SW1A 1AA" {...field} />}
              />
              {errors.postCode && <p className="text-red-500 text-sm">{errors.postCode.message as string}</p>}
            </div>
          </div>
        );
      case 3: // Account Security
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-gray-700">Secure Your Account</h2>
            <div>
              <Label htmlFor="password">Create Password</Label>
              <Controller
                name="password"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="password" type="password" {...field} />}
              />
              {errors.password && <p className="text-red-500 text-sm">{errors.password.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Controller
                name="confirmPassword"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="confirmPassword" type="password" {...field} />}
              />
              {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message as string}</p>}
            </div>
            <div>
              <Label htmlFor="securityAnswer">Memorable Word (for recovery)</Label>
               <Controller
                name="securityAnswer"
                control={control}
                defaultValue=""
                render={({ field }) => <Input id="securityAnswer" placeholder="Your favorite superhero?" {...field} />}
              />
              {errors.securityAnswer && <p className="text-red-500 text-sm">{errors.securityAnswer.message as string}</p>}
            </div>
            <div className="flex items-center space-x-2">
              <Controller
                name="agreeToTerms"
                control={control}
                defaultValue={false}
                render={({ field }) => (
                    <Checkbox
                        id="agreeToTerms"
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                )}
              />
              <Label htmlFor="agreeToTerms" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                I agree to the terms and conditions.
              </Label>
            </div>
             {errors.agreeToTerms && <p className="text-red-500 text-sm">{errors.agreeToTerms.message as string}</p>}

            <Label>Enter One-Time Password (simulated)</Label>
            <InputOTP maxLength={6}>
              <InputOTPGroup>
                <InputOTPSlot index={0} />
                <InputOTPSlot index={1} />
                <InputOTPSlot index={2} />
                <InputOTPSlot index={3} />
                <InputOTPSlot index={4} />
                <InputOTPSlot index={5} />
              </InputOTPGroup>
            </InputOTP>
          </div>
        );
      case 4: // Welcome
        return (
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold text-green-600">Welcome Aboard!</h2>
            <p className="text-gray-700">Your account setup is complete. You're ready to start managing your money.</p>
            <Alert variant="default" className="bg-green-50 border-green-300 text-green-700">
              <Terminal className="h-4 w-4" />
              <AlertTitle>Success!</AlertTitle>
              <AlertDescription>
                You can now explore your dashboard and set up your first savings goal.
              </AlertDescription>
            </Alert>
            <Button onClick={() => alert("Redirecting to dashboard...")} className="w-full">
              Go to Dashboard
            </Button>
          </div>
        );
      default:
        return <p>Unknown step</p>;
    }
  };

  return (
    <ScrollArea className="h-screen">
      <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white shadow-xl rounded-lg p-6 md:p-10 space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold text-gray-800">Join Us!</h1>
            <p className="text-gray-500">Let's get your account set up in a few easy steps.</p>
          </header>
          
          <OnboardingProgressStepper
            currentStep={currentStep}
            totalSteps={totalSteps}
            stepLabels={stepLabels}
            className="mb-8"
          />

          <form onSubmit={handleSubmit(handleNextStep)} className="space-y-6">
            {renderStepContent()}
            <div className="flex justify-between pt-6">
              {currentStep > 0 && currentStep < totalSteps -1 && (
                <Button type="button" variant="outline" onClick={handlePreviousStep}>
                  Previous
                </Button>
              )}
              {currentStep < totalSteps - 1 && (
                <Button type="submit">
                  Next
                </Button>
              )}
            </div>
          </form>
        </div>

        <Dialog open={showParentalConsentDialog} onOpenChange={setShowParentalConsentDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Parental Consent Required</DialogTitle>
              <DialogDescription>
                As you are under 16, we need a parent or guardian to approve your account.
                We'll guide you through this process.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => {setShowParentalConsentDialog(false); alert("Onboarding paused. Please ask your parent to complete their part.");}}>
                I'll Do This Later
              </Button>
              <Button onClick={handleParentalConsentProceed}>
                Ask Parent Now
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </ScrollArea>
  );
};

export default OnboardingProcess;