"use client";

import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from "@/features/ledger/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/features/ledger/ui/dropdown-menu";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

const user = {
	name: "Shaban Haider",
	email: "shaban@efferd.com",
	avatar: "https://github.com/shabanhr.png",
};

/**
 * The account menu.
 *
 * The first version was a stack of separators with no hierarchy: seven rows, six
 * rules, and a label that was really just a bigger row. This one is a card —
 * identity at the top, then three groups that answer different questions: who am
 * I, how do I work faster, what am I paying for. A rule appears only where the
 * question changes.
 *
 * Every surface here is `data-ledger`: Radix portals this menu to <body>, so
 * without the attribute it inherits the portfolio's own cream palette instead of
 * the harbor one. See `.ledger-canvas` in `ledger-tokens.css`.
 */
export function NavUser() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					aria-label="Account menu"
					className="rounded-full ring-offset-background transition-shadow duration-200 outline-none hover:ring-2 hover:ring-border/70 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
					type="button"
				>
					<Avatar className="size-8">
						<AvatarImage alt={user.name} src={user.avatar} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent align="end" className="w-60" sideOffset={8}>
				<DropdownMenuLabel className="flex items-center gap-3 px-1.5 py-2">
					<Avatar className="isolate size-9 ring-1 ring-border/70">
						<AvatarImage alt={user.name} src={user.avatar} />
						<AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
					</Avatar>
					<div className="min-w-0">
						<p className="truncate font-medium text-[13px] text-foreground leading-tight">
							{user.name}
						</p>
						<p className="truncate text-[11px] text-muted-foreground leading-tight">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="UserIcon"
							phosphor="UserIcon"
							remixicon="RiUserLine"
							tabler="IconUser"
						/>
						Profile
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="BellIcon"
							phosphor="BellIcon"
							remixicon="RiNotification3Line"
							tabler="IconBell"
						/>
						Notifications
						<DropdownMenuShortcut className="ml-auto rounded bg-muted px-1.5 py-0.5 font-mono text-[10px] text-muted-foreground">
							3
						</DropdownMenuShortcut>
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="CommandIcon"
							phosphor="CommandIcon"
							remixicon="RiCommandLine"
							tabler="IconCommand"
						/>
						Keyboard shortcuts
						<DropdownMenuShortcut className="ml-auto font-mono text-[10px] text-muted-foreground/70 tabular-nums">
							⌘K
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="LifeBuoyIcon"
							phosphor="LifebuoyIcon"
							remixicon="RiLifebuoyLine"
							tabler="IconHelpCircle"
						/>
						Seller help
					</DropdownMenuItem>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="BookOpenIcon"
							phosphor="BookOpenIcon"
							remixicon="RiBookOpenLine"
							tabler="IconBook"
						/>
						Seller guides
					</DropdownMenuItem>
				</DropdownMenuGroup>

				<DropdownMenuSeparator />

				<DropdownMenuGroup>
					<DropdownMenuItem>
						<IconPlaceholder
							lucide="CreditCardIcon"
							phosphor="CreditCardIcon"
							remixicon="RiBankCardLine"
							tabler="IconCreditCard"
						/>
						Plan &amp; billing
						<DropdownMenuShortcut className="ml-auto font-mono text-[10px] text-muted-foreground/70">
							Pro
						</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem variant="destructive">
						<IconPlaceholder
							lucide="LogOutIcon"
							phosphor="SignOutIcon"
							remixicon="RiLogoutBoxRLine"
							tabler="IconLogout2"
						/>
						Log out
					</DropdownMenuItem>
				</DropdownMenuGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
