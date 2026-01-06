import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
	"inline-flex items-center rounded-md border px-2.5 py-0.5 font-semibold text-xs transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
	{
		variants: {
			variant: {
				default:
					"border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
				secondary:
					"border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
				destructive:
					"border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
				outline: "text-foreground",
				// CEFR Level variants
				A1: "border-emerald-500/50 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
				A2: "border-teal-500/50 bg-teal-500/10 text-teal-700 dark:text-teal-400",
				B1: "border-blue-500/50 bg-blue-500/10 text-blue-700 dark:text-blue-400",
				B2: "border-indigo-500/50 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400",
				C1: "border-purple-500/50 bg-purple-500/10 text-purple-700 dark:text-purple-400",
				C2: "border-rose-500/50 bg-rose-500/10 text-rose-700 dark:text-rose-400",
				// Mastery variants
				notStarted:
					"border-gray-400/50 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
				struggling:
					"border-red-500/50 bg-red-500/10 text-red-700 dark:text-red-400",
				learning:
					"border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400",
				mastered:
					"border-green-500/50 bg-green-500/10 text-green-700 dark:text-green-400",
			},
		},
		defaultVariants: {
			variant: "default",
		},
	},
);

export interface BadgeProps
	extends React.HTMLAttributes<HTMLDivElement>,
		VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
	return (
		<div className={cn(badgeVariants({ variant }), className)} {...props} />
	);
}

export { Badge, badgeVariants };
