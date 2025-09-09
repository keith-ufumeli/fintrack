"use client";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import { motion, AnimatePresence, useAnimate } from "motion/react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  children: React.ReactNode;
  onFormSubmit?: (event: React.MouseEvent<HTMLButtonElement>) => Promise<boolean>;
}

export const Button = ({ className, children, onFormSubmit, ...props }: ButtonProps) => {
  const [scope, animate] = useAnimate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);

  const animateLoading = async () => {
    await animate(
      ".loader",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );
  };

  const animateSuccess = async () => {
    // Brief success color flash
    await animate(
      scope.current,
      {
        backgroundColor: "var(--accent)",
        color: "var(--accent-foreground)",
      },
      {
        duration: 0.1,
      },
    );
    
    await animate(
      ".loader",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        duration: 0.2,
      },
    );
    await animate(
      ".check",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );

    await animate(
      ".check",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        delay: 1.5,
        duration: 0.2,
      },
    );
    
    // Reset to original color
    await animate(
      scope.current,
      {
        backgroundColor: "var(--primary)",
        color: "var(--primary-foreground)",
      },
      {
        duration: 0.3,
      },
    );
  };

  const animateError = async () => {
    // Set error state for styling
    setHasError(true);
    
    // Shake animation
    await animate(
      scope.current,
      {
        x: [-2, 2, -2, 2, -1, 1, 0],
      },
      {
        duration: 0.4,
        ease: "easeInOut",
      },
    );

    // Show error icon
    await animate(
      ".loader",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        duration: 0.2,
      },
    );
    await animate(
      ".error",
      {
        width: "20px",
        scale: 1,
        display: "block",
      },
      {
        duration: 0.2,
      },
    );

    // Hide error icon and reset error state
    await animate(
      ".error",
      {
        width: "0px",
        scale: 0,
        display: "none",
      },
      {
        delay: 1.5,
        duration: 0.2,
      },
    );
    
    // Reset error state and color after animation
    setTimeout(async () => {
      setHasError(false);
      // Reset to original color
      await animate(
        scope.current,
        {
          backgroundColor: "var(--primary)",
          color: "var(--primary-foreground)",
        },
        {
          duration: 0.3,
        },
      );
    }, 2000);
  };

  const handleClick = async (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isSubmitting) return;
    
    setIsSubmitting(true);
    await animateLoading();
    
    try {
      let success = true;
      
      if (onFormSubmit) {
        success = await onFormSubmit(event);
      } else {
        await props.onClick?.(event);
      }
      
      if (success) {
        await animateSuccess();
      } else {
        await animateError();
      }
    } catch (error) {
      await animateError();
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    onClick,
    onDrag,
    onDragStart,
    onDragEnd,
    onAnimationStart,
    onAnimationEnd,
    ...buttonProps
  } = props;

  return (
    <motion.button
      layout
      layoutId="button"
      ref={scope}
      disabled={isSubmitting}
      className={cn(
        "flex min-w-[120px] items-center justify-center gap-2 rounded-full px-4 py-2 font-medium ring-offset-2 transition-all duration-300 ease-in-out",
        // Theme colors
        "bg-primary text-primary-foreground",
        "hover:bg-accent hover:text-accent-foreground",
        "ring-primary hover:ring-2",
        "dark:ring-offset-black",
        // Error state styling
        hasError && "bg-destructive text-destructive-foreground ring-destructive",
        // Disabled state
        isSubmitting ? "cursor-not-allowed opacity-70" : "cursor-pointer",
        // Accessibility
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
        className,
      )}
      {...buttonProps}
      onClick={handleClick}
      aria-live="polite"
      aria-label={hasError ? "Form validation error" : isSubmitting ? "Submitting form" : "Submit form"}
    >
      <motion.div layout className="flex items-center gap-2">
        <Loader />
        <CheckIcon />
        <ErrorIcon />
        <motion.span layout>{children}</motion.span>
      </motion.div>
    </motion.button>
  );
};

const Loader = () => {
  return (
    <motion.svg
      animate={{
        rotate: [0, 360],
      }}
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      transition={{
        duration: 0.3,
        repeat: Infinity,
        ease: "linear",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="loader text-primary-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 3a9 9 0 1 0 9 9" />
    </motion.svg>
  );
};

const CheckIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="check text-primary-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M9 12l2 2l4 -4" />
    </motion.svg>
  );
};

const ErrorIcon = () => {
  return (
    <motion.svg
      initial={{
        scale: 0,
        width: 0,
        display: "none",
      }}
      style={{
        scale: 0.5,
        display: "none",
      }}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="error text-destructive-foreground"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
      <path d="M10 10l4 4m0 -4l-4 4" />
    </motion.svg>
  );
};
