import parseContent from "../util/parseContent";
import Link from "next/link";

export default props => {
	const segments = parseContent(props.children);
	return segments.map(
		(segment, i) =>
			({
				text: segment.string,
				tag: (
					<Link href="/tag/[tag]" as={`/tag/${segment.string}`} key={i}>
						<a className="normal" onClick={e => e.stopPropagation()}>
							#{segment.string}
						</a>
					</Link>
				),
				username: (
					<Link href="/[username]" as={`/${segment.string}`} key={i}>
						<a className="normal" onClick={e => e.stopPropagation()}>
							@{segment.string}
						</a>
					</Link>
				),
				post: (
					<Link href="/[username]/[slug]" as={`/_/${segment.string}`} key={i}>
						<a className="normal" onClick={e => e.stopPropagation()}>
							${segment.string}
						</a>
					</Link>
				)
			}[segment.type])
	);
};
