"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function WelcomeDialog({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to FitWeb! 🎉</DialogTitle>
          <DialogDescription>
            We&apos;re excited to have you here! Let us show you around.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Packages</h4>
            <p className="text-sm text-muted-foreground">
              Browse our carefully curated fitness packages designed to match
              your goals. From starter to elite, we have something for everyone.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Personalization</h4>
            <p className="text-sm text-muted-foreground">
              Your dashboard is customized to your preferences. Track your
              progress, manage your subscriptions, and access exclusive content.
            </p>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium leading-none">Support</h4>
            <p className="text-sm text-muted-foreground">
              Our team is here to help! Reach out through the contact form or
              check our FAQ section for quick answers.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={onClose}>Get Started</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
