import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardStats } from "@/modules/dashboard/useDashboard";
import { useGetMealPlansQuery } from "@/routes/_authed/meal-plan/-hook";

export const Route = createFileRoute("/_authed/")({
	component: RouteComponent,
	staticData: {
		crumb: {
			module: "Dashboard",
		},
	},
});

function RouteComponent() {
	const { data: stats, isLoading } = useGetDashboardStats();
	const { data: mealPlansData } = useGetMealPlansQuery();
	const [currentDate, setCurrentDate] = useState(new Date());

	const cards = [
		{
			title: "Sekolah",
			value: stats?.schoolCount ?? 0,
		},
		{
			title: "Ingredient (Stock > 0)",
			value: stats?.ingredientInStock ?? 0,
		},
		{
			title: "Recipe",
			value: stats?.recipeCount ?? 0,
		},
		{
			title: "User",
			value: stats?.userCount ?? 0,
		},
	];

	const mealPlans = mealPlansData?.meal_plans ?? [];

	const getDaysInMonth = (date: Date) => {
		const year = date.getFullYear();
		const month = date.getMonth();
		const firstDay = new Date(year, month, 1);
		const lastDay = new Date(year, month + 1, 0);
		const daysInMonth = lastDay.getDate();
		const startingDay = firstDay.getDay();

		const days: (number | null)[] = [];

		for (let i = 0; i < startingDay; i++) {
			days.push(null);
		}

		for (let i = 1; i <= daysInMonth; i++) {
			days.push(i);
		}

		return days;
	};

	const getPortionsForDate = (day: number) => {
		const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;

		return mealPlans
			.filter((mp: { date: string }) => mp.date.startsWith(dateStr))
			.reduce((sum: number, mp: { portion: number }) => sum + mp.portion, 0);
	};

	const monthNames = [
		"Januari",
		"Februari",
		"Maret",
		"April",
		"Mei",
		"Juni",
		"Juli",
		"Agustus",
		"September",
		"Oktober",
		"November",
		"Desember",
	];

	const days = getDaysInMonth(currentDate);
	const today = new Date();

	const prevMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1),
		);
	};

	const nextMonth = () => {
		setCurrentDate(
			new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1),
		);
	};

	return (
		<div className="flex flex-col gap-4">
			<h1 className="text-2xl font-bold">Dashboard</h1>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
					{cards.map((card) => (
						<Card key={card.title}>
							<CardHeader className="pb-2">
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{card.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-3xl font-bold">{card.value}</div>
							</CardContent>
						</Card>
					))}
				</div>
			)}

			<Card>
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle>
							Meal Plan - {monthNames[currentDate.getMonth()]}{" "}
							{currentDate.getFullYear()}
						</CardTitle>
						<div className="flex gap-2">
							<Button variant="outline" size="sm" onClick={prevMonth}>
								Prev
							</Button>
							<Button variant="outline" size="sm" onClick={nextMonth}>
								Next
							</Button>
						</div>
					</div>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-7 gap-1 text-center">
						<div className="font-medium text-muted-foreground p-2">Min</div>
						<div className="font-medium text-muted-foreground p-2">Sen</div>
						<div className="font-medium text-muted-foreground p-2">Sel</div>
						<div className="font-medium text-muted-foreground p-2">Rab</div>
						<div className="font-medium text-muted-foreground p-2">Kam</div>
						<div className="font-medium text-muted-foreground p-2">Jum</div>
						<div className="font-medium text-muted-foreground p-2">Sab</div>

						{days.map((day, index) => (
							<div
								key={`${currentDate.getMonth()}-${day ?? "empty"}-${index}`}
								className={`p-2 min-h-[60px] border rounded ${
									day === today.getDate() &&
									currentDate.getMonth() === today.getMonth() &&
									currentDate.getFullYear() === today.getFullYear()
										? "bg-primary/10 border-primary"
										: "bg-background"
								}`}
							>
								{day && (
									<>
										<div className="text-sm font-medium">{day}</div>
										{getPortionsForDate(day) > 0 && (
											<div className="text-xs text-muted-foreground mt-1">
												{getPortionsForDate(day)} porsi
											</div>
										)}
									</>
								)}
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
