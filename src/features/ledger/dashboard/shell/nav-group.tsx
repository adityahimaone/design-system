import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@/features/ledger/ui/collapsible";
import {
	SidebarGroup,
	SidebarGroupLabel,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/features/ledger/ui/sidebar";
import type { SidebarNavGroup } from "@/features/ledger/dashboard/shell/app-shared";
import { IconPlaceholder } from "@/features/ledger/ui/icon-placeholder";

export function NavGroup({
	label,
	items,
	pathname,
}: SidebarNavGroup & { pathname?: string }) {
	return (
		<SidebarGroup>
			{label && <SidebarGroupLabel>{label}</SidebarGroupLabel>}
			<SidebarMenu>
				{items.map((item) => (
					<Collapsible
						asChild
						className="group/collapsible"
						defaultOpen={
							item.path === pathname ||
							item.subItems?.some((subItem) => subItem.path === pathname)
						}
						key={item.title}
					>
						<SidebarMenuItem>
							{item.subItems?.length ? (
								<>
									<CollapsibleTrigger asChild>
										<SidebarMenuButton isActive={item.path === pathname}>
											{item.icon}
											<span className="group-data-[collapsible=icon]:hidden">
												{item.title}
											</span>
											<IconPlaceholder
												className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90 group-data-[collapsible=icon]:hidden"
												hugeicons="ArrowRight01Icon"
												lucide="ChevronRightIcon"
												phosphor="CaretRightIcon"
												remixicon="RiArrowRightSLine"
												tabler="IconChevronRight"
											/>
										</SidebarMenuButton>
									</CollapsibleTrigger>
									<CollapsibleContent>
										<SidebarMenuSub>
											{item.subItems?.map((subItem) => (
												<SidebarMenuSubItem key={subItem.title}>
													<SidebarMenuSubButton
														asChild
														isActive={subItem.path === pathname}
													>
														<a href={subItem.path}>
															{subItem.icon}
															<span>{subItem.title}</span>
														</a>
													</SidebarMenuSubButton>
												</SidebarMenuSubItem>
											))}
										</SidebarMenuSub>
									</CollapsibleContent>
								</>
							) : (
								<SidebarMenuButton
									asChild
									isActive={item.path === pathname}
									tooltip={item.title}
								>
									<a href={item.path}>
										{item.icon}
										<span className="group-data-[collapsible=icon]:hidden">
											{item.title}
										</span>
									</a>
								</SidebarMenuButton>
							)}
						</SidebarMenuItem>
					</Collapsible>
				))}
			</SidebarMenu>
		</SidebarGroup>
	);
}
