import type { ReactNode } from "react";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

export type SidebarNavItem = {
	title: string;
	path?: string;
	icon?: ReactNode;
	subItems?: SidebarNavItem[];
};

export type SidebarNavGroup = {
	label: string;
	items: SidebarNavItem[];
};

export const navGroups: SidebarNavGroup[] = [
	{
		label: "Overview",
		items: [
			{
				title: "Dashboard",
				path: "#/dashboard",
				icon: (
					<IconPlaceholder
						hugeicons="DashboardSquare01Icon"
						lucide="LayoutGridIcon"
						phosphor="SquaresFourIcon"
						remixicon="RiDashboardLine"
						tabler="IconLayoutGrid"
					/>
				),
			},
			{
				title: "Sales",
				path: "#/sales",
				icon: (
					<IconPlaceholder
						hugeicons="Analytics02Icon"
						lucide="BarChart3Icon"
						phosphor="ChartBarIcon"
						remixicon="RiBarChartLine"
						tabler="IconChartBar"
					/>
				),
			},
		],
	},
	{
		label: "Store",
		items: [
			{
				title: "Orders",
				path: "#/orders",
				icon: (
					<IconPlaceholder
						hugeicons="ShoppingCart01Icon"
						lucide="ShoppingCartIcon"
						phosphor="ShoppingCartIcon"
						remixicon="RiShoppingCartLine"
						tabler="IconShoppingCart"
					/>
				),
				subItems: [
					{ title: "All orders", path: "#/orders/all" },
					{ title: "Unfulfilled", path: "#/orders/unfulfilled" },
					{ title: "Returns", path: "#/orders/returns" },
				],
			},
			{
				title: "Products",
				path: "#/products",
				icon: (
					<IconPlaceholder
						hugeicons="File02Icon"
						lucide="FileTextIcon"
						phosphor="FileTextIcon"
						remixicon="RiFileTextLine"
						tabler="IconFileText"
					/>
				),
				subItems: [
					{ title: "Catalog", path: "#/products/catalog" },
					{ title: "Inventory", path: "#/products/inventory" },
					{ title: "Collections", path: "#/products/collections" },
				],
			},
			{
				title: "Customers",
				path: "#/customers",
				icon: (
					<IconPlaceholder
						hugeicons="UserMultipleIcon"
						lucide="UsersIcon"
						phosphor="UsersIcon"
						remixicon="RiGroupLine"
						tabler="IconUsers"
					/>
				),
			},
			{
				title: "Marketing",
				path: "#/marketing",
				icon: (
					<IconPlaceholder
						hugeicons="Rocket01Icon"
						lucide="MegaphoneIcon"
						phosphor="MegaphoneIcon"
						remixicon="RiMegaphoneLine"
						tabler="IconPennant"
					/>
				),
			},
		],
	},
	{
		label: "Administration",
		items: [
			{
				title: "Settings",
				path: "#/settings",
				icon: (
					<IconPlaceholder
						hugeicons="Settings01Icon"
						lucide="SettingsIcon"
						phosphor="GearIcon"
						remixicon="RiSettings3Line"
						tabler="IconSettings"
					/>
				),
			},
			{
				title: "Billing",
				path: "#/billing",
				icon: (
					<IconPlaceholder
						hugeicons="CreditCardIcon"
						lucide="CreditCardIcon"
						phosphor="CreditCardIcon"
						remixicon="RiBankCardLine"
						tabler="IconCreditCard"
					/>
				),
				subItems: [
					{ title: "Plan", path: "#/billing/plan" },
					{ title: "Invoices", path: "#/billing/invoices" },
					{ title: "Payment methods", path: "#/billing/payment-methods" },
				],
			},
		],
	},
];

export const footerNavLinks: SidebarNavItem[] = [
	{
		title: "All systems",
		path: "/design-system",
		icon: (
			<IconPlaceholder
				hugeicons="Home01Icon"
				lucide="HouseIcon"
				phosphor="HouseIcon"
				remixicon="RiHomeLine"
				tabler="IconHome"
			/>
		),
	},
	{
		title: "Ledger case",
		path: "/design-system/ledger",
		icon: (
			<IconPlaceholder
				hugeicons="PaintBoardIcon"
				lucide="SwatchBookIcon"
				phosphor="SwatchesIcon"
				remixicon="RiPaletteLine"
				tabler="IconPalette"
			/>
		),
	},
	{
		title: "Seller help",
		path: "#/seller-help",
		icon: (
			<IconPlaceholder
				hugeicons="HelpCircleIcon"
				lucide="HelpCircleIcon"
				phosphor="QuestionIcon"
				remixicon="RiQuestionLine"
				tabler="IconHelpCircle"
			/>
		),
	},
	{
		title: "Platform status",
		path: "#/status",
		icon: (
			<IconPlaceholder
				hugeicons="ActivityIcon"
				lucide="ActivityIcon"
				phosphor="PulseIcon"
				remixicon="RiPulseLine"
				tabler="IconActivity"
			/>
		),
	},
];

export const navLinks: SidebarNavItem[] = [
	...navGroups.flatMap((group) =>
		group.items.flatMap((item) =>
			item.subItems?.length ? [item, ...item.subItems] : [item]
		)
	),
	...footerNavLinks,
];
