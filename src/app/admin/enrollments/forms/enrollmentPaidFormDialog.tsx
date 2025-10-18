"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm, Controller, Form } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { handleFormError } from "@/lib/helpers";
import { usePaidEnrollment } from "@/hooks/useEnrollment";
import { Enrollment, PaymentMethod } from "@/types/api/enrollment";
import { format } from "date-fns";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from "@/components/ui/select";
import { CalendarDatePicker } from "@/components/common/CalendarDatePicker";

interface EnrollmentPaidFormDialogProps {
  enrollment: Enrollment;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const paidSchema = z.object({
  paidAt: z.string().min(1, "Payment Date is required"),
  paymentMethod: z.enum(PaymentMethod, { error: "Payment Method is required" }),
});

type EnrollmentPaidFormValues = z.infer<typeof paidSchema>;

export function EnrollmentPaidFormDialog({
  enrollment,
  open,
  onOpenChange,
}: EnrollmentPaidFormDialogProps) {
  const { mutate: paidMutation, isPending: isPayingPending } =
    usePaidEnrollment(enrollment.id);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(paidSchema),
    defaultValues: {
      paidAt: format(new Date(), "yyyy-MM-dd"),
      paymentMethod: undefined,
    },
  });

  const onSubmit = (data: EnrollmentPaidFormValues) => {
    paidMutation(data, {
      onSuccess: () => onOpenChange(false),
      onError: (err: any) => handleFormError(err),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add Payment</DialogTitle>
        </DialogHeader>

        <div className="border rounded-md p-4 mb-2 space-y-2 bg-muted/40">
          <div className="flex justify-between">
            <Label className="text-md">Student Name:</Label>
            <span className="text-md">{enrollment.student.fullName}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Registration No:</Label>
            <span className="text-md">
              {enrollment.student.registrationNumber}
            </span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Batch:</Label>
            <span className="text-md">{enrollment.batch.name}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Course:</Label>
            <span className="text-md">{enrollment.batch.course.name}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Fee Amount:</Label>
            <span className="text-md">{enrollment.feeAmount}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Discount:</Label>
            <span className="text-md">{enrollment.discountAmount}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Final Fee:</Label>
            <span className="text-md">{enrollment.finalFee}</span>
          </div>
          <div className="flex justify-between">
            <Label className="text-md">Due Date:</Label>
            <span className="text-md">
              {format(new Date(enrollment.dueDate), "yyyy-MM-dd")}
            </span>
          </div>
        </div>

        <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
          <Controller
            control={control}
            name="paidAt"
            render={({ field }) => (
              <CalendarDatePicker
                label="Payment Date"
                value={field.value}
                onChange={field.onChange}
                error={errors.paidAt?.message}
              />
            )}
          />
          {errors.paidAt && (
            <span className="text-red-500 text-sm">
              {errors.paidAt.message}
            </span>
          )}

          <Label htmlFor="paymentMethod">Payment Method</Label>
          <Controller
            control={control}
            name="paymentMethod"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Payment Method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={PaymentMethod.CASH}>Cash</SelectItem>
                  <SelectItem value={PaymentMethod.WAVE}>Wave</SelectItem>
                  <SelectItem value={PaymentMethod.KPAY}>KPay</SelectItem>
                  <SelectItem value={PaymentMethod.AYA_PAY}>AYA Pay</SelectItem>
                  <SelectItem value={PaymentMethod.KBZ_SAVING}>
                    KBZ (Saving)
                  </SelectItem>
                  <SelectItem value={PaymentMethod.AYA_SAVING}>
                    AYA (Saving)
                  </SelectItem>
                  <SelectItem value={PaymentMethod.FOC}>FOC</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
          {errors.paymentMethod && (
            <span className="text-red-500 text-sm">
              {errors.paymentMethod.message}
            </span>
          )}

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button disabled={isPayingPending} type="submit">
              {isPayingPending ? "Adding Payment" : "Add Payment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
