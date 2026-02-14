import { Link } from "@tanstack/react-router";
import { Button } from "./ui/button";

export const NotFound = () => {
	return (
		<div className=" flex h-screen justify-center items-center">
			<div className=" flex flex-col space-y-4 items-center">
				<h1 className="text-4xl font-bold">404 Not Found</h1>
				<Link to="/">
					<Button>Back to home</Button>
				</Link>
			</div>
		</div>
	);
};
