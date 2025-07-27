import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { stagger, useAnimate, useInView } from "motion/react";
import { type ReactNode, useEffect, useRef } from "react";
import { slow } from "@/lib/easing";

gsap.registerPlugin(SplitText);

export default function TextReveal({
	children,
	delay = 0,
}: {
	children: ReactNode;
	delay?: number;
}) {
	const [scope, animate] = useAnimate();
	const isInView = useInView(scope, { once: true, margin: "0px 0px -25%" });

	const split = useRef<SplitText>(null);

	useEffect(() => {
		if (!split.current)
			split.current = new SplitText(scope.current, {
				type: "words, lines",
				mask: "lines",
			});

		if (isInView)
			animate(
				split.current.lines,
				{
					y: "0%",
					opacity: 1,
					filter: "blur(0px)",
				},
				{
					...slow,
					delay: stagger(0.1, { startDelay: delay }),
				},
			);
		else
			animate(
				split.current.lines,
				{ y: "100%", opacity: 0, filter: "blur(8px)" },
				{ duration: 0 },
			);
	}, [isInView, scope.current, delay, animate]);

	return (
		<span ref={scope} className="inline-block">
			{children}
		</span>
	);
}
